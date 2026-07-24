"""Audio preprocessing: resample to 16kHz mono, trim silence, normalize peak.

Uses soundfile + numpy. librosa is used for resampling when present; otherwise a
simple linear resampler keeps the module usable. All downstream stages assume
16kHz mono float32 in [-1, 1].
"""

from __future__ import annotations

from dataclasses import dataclass

import numpy as np

TARGET_SR = 16000


@dataclass
class Audio:
    samples: np.ndarray  # float32 mono
    sr: int

    @property
    def duration_s(self) -> float:
        return len(self.samples) / self.sr if self.sr else 0.0


def load(path: str) -> Audio:
    import soundfile as sf

    data, sr = sf.read(path, dtype="float32", always_2d=False)
    if data.ndim > 1:  # stereo -> mono
        data = data.mean(axis=1)
    return Audio(samples=data.astype(np.float32), sr=sr)


def resample(audio: Audio, target_sr: int = TARGET_SR) -> Audio:
    if audio.sr == target_sr:
        return audio
    try:
        import librosa

        out = librosa.resample(audio.samples, orig_sr=audio.sr, target_sr=target_sr)
        return Audio(samples=out.astype(np.float32), sr=target_sr)
    except Exception:
        # linear fallback
        ratio = target_sr / audio.sr
        n = int(len(audio.samples) * ratio)
        idx = np.linspace(0, len(audio.samples) - 1, n)
        out = np.interp(idx, np.arange(len(audio.samples)), audio.samples)
        return Audio(samples=out.astype(np.float32), sr=target_sr)


def trim_silence(audio: Audio, threshold_db: float = -40.0) -> Audio:
    """Trim leading/trailing frames quieter than threshold relative to peak."""
    s = audio.samples
    if s.size == 0:
        return audio
    peak = float(np.max(np.abs(s))) or 1.0
    thresh = peak * (10 ** (threshold_db / 20.0))
    mask = np.abs(s) > thresh
    if not mask.any():
        return audio
    first = int(np.argmax(mask))
    last = len(s) - int(np.argmax(mask[::-1]))
    return Audio(samples=s[first:last], sr=audio.sr)


def normalize_peak(audio: Audio, target_db: float = -3.0) -> Audio:
    s = audio.samples
    peak = float(np.max(np.abs(s))) if s.size else 0.0
    if peak <= 0:
        return audio
    target = 10 ** (target_db / 20.0)
    return Audio(samples=(s * (target / peak)).astype(np.float32), sr=audio.sr)


def preprocess(path: str) -> Audio:
    audio = load(path)
    audio = resample(audio, TARGET_SR)
    audio = trim_silence(audio)
    audio = normalize_peak(audio, -3.0)
    return audio


def write_wav(audio: Audio, path: str) -> None:
    import soundfile as sf

    sf.write(path, audio.samples, audio.sr, subtype="PCM_16")
