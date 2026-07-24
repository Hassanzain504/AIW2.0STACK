"""Prosody metrics.

Pure-Python / numpy implementations of the metrics the taxonomy consumes. The
heavy acoustic extraction (F0, intensity contours) is done by parselmouth when
available; this module owns the maths that turns those contours into the scalar
metrics (nPVI, F0 range in semitones, speech rate, etc.). Keeping the maths here
and dependency-light means the thresholds can be unit-tested without audio.
"""

from __future__ import annotations

import math
from dataclasses import dataclass

try:  # numpy is a hard dep of the pipeline but keep the maths importable alone
    import numpy as np
except Exception:  # pragma: no cover
    np = None  # type: ignore


FUNCTION_WORDS = {
    "a", "an", "the", "of", "to", "in", "on", "at", "for", "and", "or", "but",
    "is", "are", "was", "were", "be", "been", "am", "do", "does", "did", "has",
    "have", "had", "will", "would", "can", "could", "shall", "should", "may",
    "might", "must", "that", "this", "these", "those", "it", "its", "he", "she",
    "we", "they", "you", "i", "me", "him", "her", "us", "them", "my", "your",
    "his", "our", "their", "as", "if", "so", "than", "then", "with", "by",
    "from", "up", "out", "about", "into", "over", "after",
}

FILLERS = {"um", "uh", "er", "ah", "like", "hmm", "erm", "mm"}


def npvi(durations: list[float]) -> float:
    """Normalized Pairwise Variability Index of successive vowel durations.

    nPVI = 100 / (m-1) * sum( | (d_k - d_{k+1}) / ((d_k + d_{k+1}) / 2) | )

    Higher = more stress-timed (English target 55-70). Lower = more
    syllable-timed (the Pakistani/Indian-English default).
    """
    d = [x for x in durations if x and x > 0]
    if len(d) < 2:
        return 0.0
    total = 0.0
    for k in range(len(d) - 1):
        a, b = d[k], d[k + 1]
        denom = (a + b) / 2.0
        if denom > 0:
            total += abs((a - b) / denom)
    return 100.0 * total / (len(d) - 1)


def hz_to_semitones(f0_hz: list[float], median_hz: float | None = None) -> list[float]:
    """Convert an F0 contour (Hz) to semitones relative to the speaker's median.

    Unvoiced frames should be passed as 0 or NaN and are dropped from the median
    but kept (as NaN) in the returned contour so the timeline stays aligned.
    This is the normalisation the spec insists on: we compare *shape*, not
    absolute frequency, so a male user and a female reference are comparable.
    """
    voiced = [f for f in f0_hz if f and f > 0 and not math.isnan(f)]
    if not voiced:
        return [float("nan")] * len(f0_hz)
    if median_hz is None:
        median_hz = _median(voiced)
    out: list[float] = []
    for f in f0_hz:
        if f and f > 0 and not math.isnan(f):
            out.append(12.0 * math.log2(f / median_hz))
        else:
            out.append(float("nan"))
    return out


def f0_range_semitones(f0_hz: list[float]) -> float:
    """Pitch span in semitones between the 5th and 95th voiced percentiles.

    Percentiles rather than raw min/max so a single octave-jump artefact does
    not inflate the range. GA conversational target: 10-14 st. Monotone < 6 st.
    """
    voiced = sorted(f for f in f0_hz if f and f > 0 and not math.isnan(f))
    if len(voiced) < 3:
        return 0.0
    lo = _percentile(voiced, 5)
    hi = _percentile(voiced, 95)
    if lo <= 0:
        return 0.0
    return 12.0 * math.log2(hi / lo)


def speech_rate(num_syllables: int, voiced_duration_s: float) -> float:
    """Syllables per second over the phonated (non-silent) span."""
    if voiced_duration_s <= 0:
        return 0.0
    return num_syllables / voiced_duration_s


def content_function_intensity_ratio(
    word_intensities: list[tuple[str, float]],
) -> float:
    """Mean intensity of content words divided by mean of function words.

    GA target > 1.3: content words carry noticeably more energy.
    """
    content = [v for w, v in word_intensities if w.lower() not in FUNCTION_WORDS]
    function = [v for w, v in word_intensities if w.lower() in FUNCTION_WORDS]
    if not content or not function:
        return 1.0
    mc = sum(content) / len(content)
    mf = sum(function) / len(function)
    if mf <= 0:
        return 1.0
    return mc / mf


def filler_density(transcript: str) -> float:
    words = [w.strip(".,!?;:").lower() for w in transcript.split()]
    words = [w for w in words if w]
    if not words:
        return 0.0
    fillers = sum(1 for w in words if w in FILLERS)
    return 100.0 * fillers / len(words)


def max_interword_gap(word_timings: list[dict]) -> float:
    """Largest silent gap between consecutive words, in ms."""
    gaps = []
    for a, b in zip(word_timings, word_timings[1:]):
        gaps.append(b["start_ms"] - a["end_ms"])
    return max(gaps) if gaps else 0.0


def terminal_contour_rising(f0_hz: list[float], tail_fraction: float = 0.2) -> bool:
    """True if the final tail of the voiced contour trends upward.

    Compares the mean of the first vs second half of the last `tail_fraction`
    of voiced frames. A declarative should fall; a rise flags TERMINAL_RISE.
    """
    voiced = [(i, f) for i, f in enumerate(f0_hz) if f and f > 0 and not math.isnan(f)]
    if len(voiced) < 6:
        return False
    n = max(4, int(len(voiced) * tail_fraction))
    tail = [f for _, f in voiced[-n:]]
    half = len(tail) // 2
    first = sum(tail[:half]) / max(1, half)
    second = sum(tail[half:]) / max(1, len(tail) - half)
    # rising if second half is meaningfully higher (>0.5 st)
    if first <= 0:
        return False
    return 12.0 * math.log2(second / first) > 0.5


def segment_syllables(vowel_nuclei_ms: list[tuple[float, float]]) -> list[float]:
    """Return the durations of each vowel nucleus (proxy for syllables).

    Syllable segmentation from vowel nuclei is the standard cheap approach:
    one nucleus per syllable. Durations feed nPVI.
    """
    return [max(0.0, end - start) for start, end in vowel_nuclei_ms]


@dataclass
class StressMark:
    syllable_index: int
    intensity: float
    duration_ms: float
    mean_f0: float


def detected_stress_index(marks: list[StressMark]) -> int:
    """Index of the syllable that is loudest + longest + highest, combined.

    Stress in English is signalled by all three cues together. We z-normalise
    each cue across the word's syllables and pick the argmax of the sum, which
    is robust to any single cue being ambiguous.
    """
    if not marks:
        return -1
    if len(marks) == 1:
        return 0

    def z(vals: list[float]) -> list[float]:
        m = sum(vals) / len(vals)
        var = sum((v - m) ** 2 for v in vals) / len(vals)
        sd = math.sqrt(var) or 1.0
        return [(v - m) / sd for v in vals]

    zi = z([m.intensity for m in marks])
    zd = z([m.duration_ms for m in marks])
    zf = z([m.mean_f0 for m in marks])
    scores = [zi[k] + zd[k] + zf[k] for k in range(len(marks))]
    return scores.index(max(scores))


# --------------------------------------------------------------------------- #
# small stat helpers (avoid importing numpy just for these)
# --------------------------------------------------------------------------- #

def _median(xs: list[float]) -> float:
    s = sorted(xs)
    n = len(s)
    if n == 0:
        return 0.0
    mid = n // 2
    if n % 2:
        return s[mid]
    return (s[mid - 1] + s[mid]) / 2.0


def _percentile(sorted_xs: list[float], pct: float) -> float:
    if not sorted_xs:
        return 0.0
    if len(sorted_xs) == 1:
        return sorted_xs[0]
    rank = (pct / 100.0) * (len(sorted_xs) - 1)
    lo = int(math.floor(rank))
    hi = int(math.ceil(rank))
    if lo == hi:
        return sorted_xs[lo]
    frac = rank - lo
    return sorted_xs[lo] * (1 - frac) + sorted_xs[hi] * frac
