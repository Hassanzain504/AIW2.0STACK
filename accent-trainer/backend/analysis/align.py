"""WhisperX forced alignment wrapper (phoneme-level boundaries).

WhisperX aligns the ASR transcript against the audio with a wav2vec2 model and
returns character/phone-level timings with confidence. We expose a thin adapter
that yields produced phones with millisecond boundaries. Optional dependency;
degrades gracefully.
"""

from __future__ import annotations

from dataclasses import dataclass
from functools import lru_cache

from app.config import settings


@dataclass
class AlignedPhone:
    phone: str  # aligner label (may be char-level; mapped upstream)
    start_ms: int
    end_ms: int
    confidence: float


def available() -> bool:
    try:
        import whisperx  # noqa: F401
        return True
    except Exception:
        return False


@lru_cache(maxsize=1)
def _align_model():
    import whisperx

    model, metadata = whisperx.load_align_model(
        language_code="en", device=settings.whisper_device
    )
    return model, metadata


def align(wav_path: str, asr_segments: list[dict]) -> list[AlignedPhone]:
    import whisperx

    model, metadata = _align_model()
    audio = whisperx.load_audio(wav_path)
    result = whisperx.align(
        asr_segments,
        model,
        metadata,
        audio,
        settings.whisper_device,
        return_char_alignments=True,
    )
    phones: list[AlignedPhone] = []
    for seg in result.get("segments", []):
        for ch in seg.get("chars", []) or []:
            if ch.get("start") is None:
                continue
            phones.append(
                AlignedPhone(
                    phone=ch["char"],
                    start_ms=int(ch["start"] * 1000),
                    end_ms=int(ch["end"] * 1000),
                    confidence=float(ch.get("score", 0.0)),
                )
            )
    return phones
