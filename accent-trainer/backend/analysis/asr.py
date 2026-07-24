"""faster-whisper wrapper (ASR with word timestamps).

Lazily loads the model on first use so importing the pipeline is cheap and the
server starts without downloading weights. If faster-whisper is not installed
the caller falls back to degraded mode.
"""

from __future__ import annotations

from dataclasses import dataclass
from functools import lru_cache

from app.config import settings


@dataclass
class Word:
    word: str
    start_ms: int
    end_ms: int
    probability: float


@dataclass
class Transcription:
    text: str
    words: list[Word]
    language: str


def available() -> bool:
    try:
        import faster_whisper  # noqa: F401
        return True
    except Exception:
        return False


@lru_cache(maxsize=1)
def _model():
    from faster_whisper import WhisperModel

    return WhisperModel(
        settings.whisper_model,
        device=settings.whisper_device,
        compute_type=settings.whisper_compute_type,
    )


def transcribe(wav_path: str) -> Transcription:
    model = _model()
    segments, info = model.transcribe(
        wav_path, word_timestamps=True, language="en", beam_size=5
    )
    words: list[Word] = []
    text_parts: list[str] = []
    for seg in segments:
        text_parts.append(seg.text)
        for w in seg.words or []:
            words.append(
                Word(
                    word=w.word.strip(),
                    start_ms=int(w.start * 1000),
                    end_ms=int(w.end * 1000),
                    probability=float(w.probability),
                )
            )
    return Transcription(
        text="".join(text_parts).strip(),
        words=words,
        language=info.language,
    )
