"""Analysis pipeline orchestrator.

Runs the 9 stages from the spec:

  preprocess -> transcribe -> force-align -> g2p expected phones ->
  phone compare -> acoustic probe -> prosody -> reference DTW -> score+rank

Every ML stage is optional. When faster-whisper / whisperx / g2p-en /
parselmouth are missing, the pipeline degrades: it still returns a well-formed
SessionReport with whatever it could compute and sets `degraded=True` plus a
note explaining which stage was unavailable. This keeps the API and frontend
fully exercisable before the heavy models are installed and tuned.
"""

from __future__ import annotations

import time
from dataclasses import dataclass
from pathlib import Path

from app.schemas import (
    OverallScores,
    PhonemeError,
    ProsodyError,
    SessionReport,
    WordTiming,
)
from phonetics import error_profile as ep
from phonetics.error_profile import ProsodyMetrics

from analysis import acoustics, align, asr, g2p, prosody
from analysis import phone_compare as pc
from analysis import preprocess as pp
from analysis.dtw import per_syllable_deviation


_VOWELS = g2p._VOWELS


@dataclass
class ReferenceData:
    """Pre-computed reference contours cached at TTS-generation time."""
    f0_hz: list[float]
    intensity_db: list[float]
    hop_ms: float = 10.0


def analyze(
    user_wav: str,
    target_text: str,
    reference: ReferenceData | None = None,
) -> SessionReport:
    t_start = time.time()
    notes: list[str] = []
    degraded = False

    # 1. preprocess -----------------------------------------------------------
    audio = pp.preprocess(user_wav)
    clean_path = str(Path(user_wav).with_suffix(".16k.wav"))
    pp.write_wav(audio, clean_path)

    # 2. transcribe -----------------------------------------------------------
    transcript = ""
    words: list = []
    if asr.available():
        tr = asr.transcribe(clean_path)
        transcript, words = tr.text, tr.words
    else:
        degraded = True
        transcript = target_text
        notes.append("ASR unavailable (faster-whisper not installed); used target "
                     "text as transcript.")

    # 3 + 4. force-align + expected phones -----------------------------------
    g2p_words = g2p.phonemize(target_text) if g2p.available() else []
    expected_phones = g2p.to_expected_phones(g2p_words) if g2p_words else []
    if not g2p_words:
        degraded = True
        notes.append("g2p-en unavailable; phoneme-level comparison skipped.")

    produced_phones: list[pc.ProducedPhone] = []
    if align.available() and asr.available() and expected_phones:
        seg = [{"start": w.start_ms / 1000, "end": w.end_ms / 1000,
                "text": w.word} for w in words]
        aligned = align.align(clean_path, [{"start": 0, "end": audio.duration_s,
                                            "text": transcript, "words": seg}])
        produced_phones = _aligned_to_produced(aligned, clean_path)
    elif expected_phones:
        degraded = True
        notes.append("WhisperX unavailable; used expected phones as produced "
                     "(no substitution detection).")
        produced_phones = _expected_as_produced(expected_phones, audio.duration_s)

    # 5 + 6. phone compare (probes were attached during alignment mapping) ----
    phoneme_errors: list[PhonemeError] = []
    if expected_phones and produced_phones:
        phoneme_errors = pc.compare(expected_phones, produced_phones)

    # 7. prosody --------------------------------------------------------------
    pitch_contour_st: list[float] = []
    intensity_contour: list[float] = []
    prosody_errors: list[ProsodyError] = []
    metrics: ProsodyMetrics | None = None
    syllable_spans_frames: list[tuple[int, int]] = []

    if acoustics.available():
        contours = acoustics.extract_contours(clean_path)
        pitch_contour_st = prosody.hz_to_semitones(contours.f0_hz)
        intensity_contour = contours.intensity_db
        metrics, syllable_spans_frames = _prosody_metrics(
            contours, words, transcript, target_text, g2p_words
        )
        prosody_errors = _fire_prosody_rules(metrics)
    else:
        degraded = True
        notes.append("parselmouth unavailable; prosody metrics and pitch ribbon "
                     "not computed.")

    # 8. reference DTW --------------------------------------------------------
    reference_contour_st: list[float] = []
    per_syll_dev: list[float] = []
    if reference and pitch_contour_st:
        reference_contour_st = prosody.hz_to_semitones(reference.f0_hz)
        per_syll_dev = per_syllable_deviation(
            pitch_contour_st, reference_contour_st, syllable_spans_frames
        )

    # 9. score + rank ---------------------------------------------------------
    ranked = _rank(phoneme_errors, prosody_errors)
    top_three = [_headline(e) for e in ranked[:3]]
    overall = _overall_scores(phoneme_errors, prosody_errors, metrics)
    word_timings = _word_timings(words)
    wer = _wer(transcript, target_text)

    return SessionReport(
        overall=overall,
        phoneme_errors=phoneme_errors,
        prosody_errors=prosody_errors,
        top_three_fixes=top_three,
        pitch_contour=[_nan_to_zero(x) for x in pitch_contour_st],
        reference_contour=[_nan_to_zero(x) for x in reference_contour_st],
        intensity_contour=intensity_contour,
        per_syllable_deviation=per_syll_dev,
        word_timings=word_timings,
        transcript=transcript,
        wer_vs_target=wer,
        analysis_ms=int((time.time() - t_start) * 1000),
        degraded=degraded,
        notes=notes,
    )


# --------------------------------------------------------------------------- #
# helpers
# --------------------------------------------------------------------------- #

def _phone_kind(arpabet: str) -> str:
    bare = pc.strip_stress(arpabet)
    if bare in _VOWELS:
        return "vowel"
    if bare in {"P", "T", "K", "B", "D", "G"}:
        return "stop"
    if bare in {"F", "V", "S", "Z", "SH", "ZH", "TH", "DH", "HH"}:
        return "fricative"
    if bare in {"R", "L", "W", "Y"}:
        return "approximant"
    if bare in {"M", "N", "NG"}:
        return "nasal"
    return "other"


def _expected_as_produced(
    expected: list[pc.ExpectedPhone], duration_s: float
) -> list[pc.ProducedPhone]:
    """Degraded mode: emit produced phones matching expected, no probes."""
    n = len(expected)
    step = (duration_s * 1000) / max(1, n)
    out = []
    for i, e in enumerate(expected):
        out.append(pc.ProducedPhone(
            arpabet=e.arpabet, start_ms=int(i * step),
            end_ms=int((i + 1) * step), confidence=0.0, probe={},
        ))
    return out


def _aligned_to_produced(
    aligned: list, wav_path: str
) -> list[pc.ProducedPhone]:
    """Map char-level alignment to produced phones with acoustic probes.

    WhisperX returns character alignments; a production build would map these to
    ARPAbet via a phoneme recogniser. Here we attach probes per segment so the
    taxonomy detectors have acoustic evidence to read.
    """
    produced: list[pc.ProducedPhone] = []
    for a in aligned:
        arpa = a.phone.upper()
        kind = _phone_kind(arpa)
        try:
            probe = acoustics.probe_segment(wav_path, a.start_ms, a.end_ms, kind)
        except Exception:
            probe = {}
        produced.append(pc.ProducedPhone(
            arpabet=arpa, start_ms=a.start_ms, end_ms=a.end_ms,
            confidence=a.confidence, probe=probe,
        ))
    return produced


def _prosody_metrics(contours, words, transcript, target_text, g2p_words):
    """Compute the ProsodyMetrics bundle + syllable spans (frame indices)."""
    hop = contours.hop_ms
    f0 = contours.f0_hz

    # syllable nuclei from voiced runs (proxy: contiguous voiced spans)
    spans_frames: list[tuple[int, int]] = []
    nuclei_ms: list[tuple[float, float]] = []
    in_run = False
    start = 0
    for i, v in enumerate(f0):
        voiced = v and v > 0
        if voiced and not in_run:
            in_run, start = True, i
        elif not voiced and in_run:
            in_run = False
            if i - start >= 3:  # min 30ms
                spans_frames.append((start, i))
                nuclei_ms.append((start * hop, i * hop))
    if in_run and len(f0) - start >= 3:
        spans_frames.append((start, len(f0)))
        nuclei_ms.append((start * hop, len(f0) * hop))

    durations = prosody.segment_syllables(nuclei_ms)
    npvi_val = prosody.npvi(durations)
    f0_range = prosody.f0_range_semitones(f0)

    voiced_dur_s = sum(d for d in durations) / 1000.0
    rate = prosody.speech_rate(len(durations), voiced_dur_s or 0.001)

    word_timings = [{"start_ms": w.start_ms, "end_ms": w.end_ms} for w in words]
    max_gap = prosody.max_interword_gap(word_timings)
    fillers = prosody.filler_density(transcript)

    # content/function intensity: mean intensity within each word span
    word_intens = []
    for w in words:
        s = int(w.start_ms / hop)
        e = int(w.end_ms / hop)
        seg = [contours.intensity_db[k] for k in range(s, min(e, len(contours.intensity_db)))]
        if seg:
            word_intens.append((w.word, sum(seg) / len(seg)))
    cf_ratio = prosody.content_function_intensity_ratio(word_intens)

    terminal = prosody.terminal_contour_rising(f0)

    # word stress mismatch: compare detected stress vs g2p primary stress
    mismatches = _stress_mismatches(words, g2p_words, contours)

    metrics = ProsodyMetrics(
        npvi=npvi_val,
        f0_range_st=f0_range,
        speech_rate_syll_s=rate,
        filler_per_100w=fillers,
        content_function_intensity_ratio=cf_ratio,
        nuclear_on_focus=True,  # focus-word detection is a later refinement
        max_interword_gap_ms=max_gap,
        terminal_rising=terminal,
        word_stress_mismatches=mismatches,
    )
    return metrics, spans_frames


def _stress_mismatches(words, g2p_words, contours) -> int:
    if not g2p_words:
        return 0
    patterns = g2p.stress_pattern(g2p_words)
    mismatches = 0
    for w, pat in zip(words, patterns):
        if pat.count(1) != 1 or len(pat) < 2:
            continue
        expected_idx = pat.index(1)
        # detected stress: loudest sub-span (cheap proxy within the word)
        hop = contours.hop_ms
        s = int(w.start_ms / hop)
        e = int(w.end_ms / hop)
        if e - s < len(pat):
            continue
        seg = contours.intensity_db[s:e]
        chunk = max(1, len(seg) // len(pat))
        energies = [sum(seg[k * chunk:(k + 1) * chunk]) for k in range(len(pat))]
        detected_idx = energies.index(max(energies)) if energies else 0
        if detected_idx != expected_idx:
            mismatches += 1
    return mismatches


def _fire_prosody_rules(metrics: ProsodyMetrics) -> list[ProsodyError]:
    out: list[ProsodyError] = []
    for rule in ep.PROSODY_RULES:
        try:
            fired, measured = rule.detect(metrics)
        except Exception:
            continue
        if fired:
            out.append(ProsodyError(
                rule_id=rule.id,
                measured=round(measured, 2),
                target_range=rule.target_range,
                unit=rule.unit,
                severity=rule.severity,
                explanation=rule.explanation,
                drill_suggestion=rule.drill_suggestion,
                affected_spans=[],
            ))
    return out


def _rank(phoneme_errors, prosody_errors):
    """Sort all errors by severity x intelligibility weight (+ frequency)."""
    freq: dict[str, int] = {}
    for e in phoneme_errors:
        freq[e.rule_id] = freq.get(e.rule_id, 0) + 1

    scored = []
    for e in phoneme_errors:
        rule = ep.phone_rule(e.rule_id)
        w = rule.intelligibility_weight if rule else 0.5
        scored.append((e.severity * w * freq.get(e.rule_id, 1), e))
    for e in prosody_errors:
        rule = ep.prosody_rule(e.rule_id)
        w = rule.intelligibility_weight if rule else 0.5
        scored.append((e.severity * w * 2.0, e))  # prosody weighted highest
    scored.sort(key=lambda x: x[0], reverse=True)
    return [e for _, e in scored]


def _headline(err) -> str:
    if isinstance(err, PhonemeError):
        return (f"'{err.word}': you said {err.produced_ipa} instead of "
                f"{err.expected_ipa}. {err.articulation_cue}")
    return f"{err.explanation} {err.drill_suggestion}"


def _overall_scores(phoneme_errors, prosody_errors, metrics) -> OverallScores:
    intel = 100
    for e in phoneme_errors:
        rule = ep.phone_rule(e.rule_id)
        w = rule.intelligibility_weight if rule else 0.4
        intel -= int(e.severity * w * 3)
    prosody_score = 100
    for e in prosody_errors:
        prosody_score -= int(e.severity * 4)
    fluency = 100
    if metrics:
        if metrics.filler_per_100w > 5:
            fluency -= 15
        if metrics.max_interword_gap_ms > 60:
            fluency -= 10
        if metrics.speech_rate_syll_s < 3.0 or metrics.speech_rate_syll_s > 5.5:
            fluency -= 10
    return OverallScores(
        intelligibility=max(0, min(100, intel)),
        prosody=max(0, min(100, prosody_score)),
        fluency=max(0, min(100, fluency)),
    )


def _word_timings(words) -> list[WordTiming]:
    return [WordTiming(word=w.word, start_ms=w.start_ms, end_ms=w.end_ms)
            for w in words]


def _wer(hyp: str, ref: str) -> float:
    h = hyp.lower().split()
    r = ref.lower().split()
    if not r:
        return 0.0
    # word-level Levenshtein
    d = [[0] * (len(h) + 1) for _ in range(len(r) + 1)]
    for i in range(len(r) + 1):
        d[i][0] = i
    for j in range(len(h) + 1):
        d[0][j] = j
    for i in range(1, len(r) + 1):
        for j in range(1, len(h) + 1):
            cost = 0 if r[i - 1] == h[j - 1] else 1
            d[i][j] = min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost)
    return round(d[len(r)][len(h)] / len(r), 3)


def _nan_to_zero(x: float) -> float:
    return 0.0 if x != x else round(x, 3)
