"""DTW alignment of user F0 contour to reference F0 contour.

Both contours must already be normalised to semitones relative to each
speaker's own median (see prosody.hz_to_semitones). We align on shape, then
compute per-syllable deviation by averaging the aligned distance within each
syllable span. Pure numpy, no external DTW dependency.
"""

from __future__ import annotations

import numpy as np


def _fill_unvoiced(contour: list[float]) -> np.ndarray:
    """Linearly interpolate NaN/0 (unvoiced) frames so DTW sees a smooth line."""
    a = np.array([np.nan if (x == 0 or x != x) else x for x in contour], dtype=float)
    if np.all(np.isnan(a)):
        return np.zeros(len(a))
    idx = np.arange(len(a))
    good = ~np.isnan(a)
    a[~good] = np.interp(idx[~good], idx[good], a[good])
    return a


def dtw_align(user_st: list[float], ref_st: list[float]) -> list[tuple[int, int]]:
    u = _fill_unvoiced(user_st)
    r = _fill_unvoiced(ref_st)
    n, m = len(u), len(r)
    if n == 0 or m == 0:
        return []
    cost = np.full((n + 1, m + 1), np.inf)
    cost[0, 0] = 0.0
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            d = abs(u[i - 1] - r[j - 1])
            cost[i, j] = d + min(cost[i - 1, j], cost[i, j - 1], cost[i - 1, j - 1])
    # backtrace
    path: list[tuple[int, int]] = []
    i, j = n, m
    while i > 0 and j > 0:
        path.append((i - 1, j - 1))
        step = min(cost[i - 1, j], cost[i, j - 1], cost[i - 1, j - 1])
        if step == cost[i - 1, j - 1]:
            i, j = i - 1, j - 1
        elif step == cost[i - 1, j]:
            i -= 1
        else:
            j -= 1
    path.reverse()
    return path


def per_syllable_deviation(
    user_st: list[float],
    ref_st: list[float],
    syllable_spans_frames: list[tuple[int, int]],
) -> list[float]:
    """Mean aligned |user - ref| semitone deviation within each syllable span.

    `syllable_spans_frames` are (start_frame, end_frame) into the user contour.
    Returns one deviation value per syllable, used to colour the PitchRibbon.
    """
    path = dtw_align(user_st, ref_st)
    if not path:
        return [0.0] * len(syllable_spans_frames)
    u = _fill_unvoiced(user_st)
    r = _fill_unvoiced(ref_st)
    # map each user frame to its aligned ref frame (last wins)
    u_to_r: dict[int, int] = {}
    for ui, rj in path:
        u_to_r[ui] = rj
    devs: list[float] = []
    for start, end in syllable_spans_frames:
        vals = []
        for ui in range(start, min(end, len(u))):
            rj = u_to_r.get(ui)
            if rj is not None:
                vals.append(abs(u[ui] - r[rj]))
        devs.append(float(np.mean(vals)) if vals else 0.0)
    return devs
