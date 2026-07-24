"""Acoustic extraction via praat-parselmouth.

Provides:
- utterance-level F0 and intensity contours (fixed hop) for the PitchRibbon
- per-phone probes (formants for vowels, VOT/closure/burst for stops,
  spectral centroid for fricatives)

parselmouth is optional at import time; `available()` gates real extraction and
the pipeline substitutes synthetic/empty probes in degraded mode.
"""

from __future__ import annotations

from dataclasses import dataclass, field

import numpy as np

F0_MIN = 75.0
F0_MAX = 500.0
HOP_MS = 10.0


def available() -> bool:
    try:
        import parselmouth  # noqa: F401
        return True
    except Exception:
        return False


@dataclass
class Contours:
    f0_hz: list[float]  # per hop, 0 for unvoiced
    intensity_db: list[float]
    times_ms: list[float]
    hop_ms: float = HOP_MS


def extract_contours(wav_path: str) -> Contours:
    import parselmouth

    snd = parselmouth.Sound(wav_path)
    pitch = snd.to_pitch(time_step=HOP_MS / 1000.0, pitch_floor=F0_MIN,
                         pitch_ceiling=F0_MAX)
    intensity = snd.to_intensity(minimum_pitch=F0_MIN,
                                 time_step=HOP_MS / 1000.0)
    f0 = pitch.selected_array["frequency"]  # 0 where unvoiced
    times = pitch.xs()
    intens: list[float] = []
    for t in times:
        try:
            intens.append(float(intensity.get_value(t) or 0.0))
        except Exception:
            intens.append(0.0)
    return Contours(
        f0_hz=[float(x) for x in f0],
        intensity_db=intens,
        times_ms=[float(t) * 1000 for t in times],
    )


def probe_segment(
    wav_path: str, start_ms: int, end_ms: int, kind: str
) -> dict:
    """Per-phone acoustic probe.

    `kind` in {"vowel", "stop", "fricative", "approximant", "nasal"} selects
    which measurements to take. Returns a dict consumed by PhoneObservation.
    """
    import parselmouth
    from parselmouth.praat import call

    snd = parselmouth.Sound(wav_path)
    t0, t1 = start_ms / 1000.0, end_ms / 1000.0
    dur_ms = float(end_ms - start_ms)
    probe: dict = {"duration_ms": dur_ms}
    if t1 <= t0:
        return probe

    part = snd.extract_part(from_time=t0, to_time=t1, preserve_times=False)

    # mean intensity + voicing ratio for all kinds
    try:
        intensity = part.to_intensity(minimum_pitch=F0_MIN)
        probe["mean_intensity"] = float(call(intensity, "Get mean", 0, 0, "dB"))
    except Exception:
        pass
    try:
        pitch = part.to_pitch(pitch_floor=F0_MIN, pitch_ceiling=F0_MAX)
        f0vals = pitch.selected_array["frequency"]
        voiced = np.count_nonzero(f0vals)
        probe["voicing_ratio"] = float(voiced / len(f0vals)) if len(f0vals) else 0.0
        nz = f0vals[f0vals > 0]
        if nz.size:
            probe["mean_f0"] = float(np.mean(nz))
    except Exception:
        pass

    if kind == "vowel":
        _probe_vowel(part, probe)
    elif kind == "stop":
        _probe_stop(part, probe, dur_ms)
    elif kind == "fricative":
        _probe_fricative(part, probe)
    elif kind == "approximant":
        _probe_vowel(part, probe)  # need formants for R/L
    return probe


def _probe_vowel(part, probe: dict) -> None:
    from parselmouth.praat import call

    try:
        formant = part.to_formant_burg(max_number_of_formants=5,
                                       maximum_formant=5500)
        dur = part.get_total_duration()
        mid = dur / 2.0
        probe["f1"] = _safe(call(formant, "Get value at time", 1, mid, "Hertz", "Linear"))
        probe["f2"] = _safe(call(formant, "Get value at time", 2, mid, "Hertz", "Linear"))
        probe["f3"] = _safe(call(formant, "Get value at time", 3, mid, "Hertz", "Linear"))
        # 5-sample trajectory for diphthong movement
        f1t, f2t = [], []
        for k in range(5):
            t = dur * (k + 0.5) / 5.0
            f1t.append(_safe(call(formant, "Get value at time", 1, t, "Hertz", "Linear")))
            f2t.append(_safe(call(formant, "Get value at time", 2, t, "Hertz", "Linear")))
        probe["f1_trajectory"] = [x for x in f1t if x is not None]
        probe["f2_trajectory"] = [x for x in f2t if x is not None]
    except Exception:
        pass


def _probe_stop(part, probe: dict, dur_ms: float) -> None:
    # VOT approximation: gap between burst onset and voicing onset.
    # We approximate closure as the low-energy portion and burst as the sharp
    # energy rise; a full implementation would use the point process. This gives
    # a usable VOT signal that the NO_ASPIRATION detector thresholds on.
    import numpy as np

    s = part.values[0] if part.values.ndim > 1 else part.values
    s = np.asarray(s, dtype=float)
    if s.size < 4:
        return
    energy = s ** 2
    win = max(1, int(0.005 * part.sampling_frequency))  # 5ms window
    smooth = np.convolve(energy, np.ones(win) / win, mode="same")
    peak = float(np.max(smooth)) or 1.0
    burst_idx = int(np.argmax(smooth > peak * 0.5))
    # voicing onset: first sustained low-frequency periodic energy after burst
    try:
        pitch = part.to_pitch(pitch_floor=F0_MIN, pitch_ceiling=F0_MAX)
        f0 = pitch.selected_array["frequency"]
        step = part.get_total_duration() / max(1, len(f0))
        voice_frame = int(np.argmax(f0 > 0)) if np.any(f0 > 0) else len(f0)
        voice_ms = voice_frame * step * 1000
    except Exception:
        voice_ms = dur_ms
    burst_ms = burst_idx / part.sampling_frequency * 1000
    probe["burst_present"] = bool(np.max(smooth) > peak * 0.5)
    probe["vot_ms"] = max(0.0, voice_ms - burst_ms)
    probe["closure_ms"] = burst_ms


def _probe_fricative(part, probe: dict) -> None:
    import numpy as np

    try:
        spectrum = part.to_spectrum()
        from parselmouth.praat import call

        probe["spectral_centroid"] = _safe(
            call(spectrum, "Get centre of gravity", 2)
        )
    except Exception:
        pass


def _safe(v) -> float | None:
    try:
        f = float(v)
        if f != f:  # NaN
            return None
        return f
    except Exception:
        return None
