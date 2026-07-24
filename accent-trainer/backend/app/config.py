"""Runtime configuration. Env-overridable, sensible local-first defaults."""

from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
RECORDINGS_DIR = DATA_DIR / "recordings"
REFERENCE_DIR = DATA_DIR / "reference"


@dataclass
class Settings:
    db_url: str = os.environ.get("ACCENT_DB_URL", f"sqlite:///{DATA_DIR / 'accent.db'}")
    whisper_model: str = os.environ.get("ACCENT_WHISPER_MODEL", "small.en")
    whisper_device: str = os.environ.get("ACCENT_WHISPER_DEVICE", "cpu")
    whisper_compute_type: str = os.environ.get("ACCENT_WHISPER_COMPUTE", "int8")
    # Azure Neural TTS (reference generation only; never in the runtime loop)
    azure_tts_key: str = os.environ.get("AZURE_TTS_KEY", "")
    azure_tts_region: str = os.environ.get("AZURE_TTS_REGION", "eastus")
    max_analysis_seconds: float = float(os.environ.get("ACCENT_MAX_ANALYSIS_S", "8"))

    def ensure_dirs(self) -> None:
        for d in (DATA_DIR, RECORDINGS_DIR, REFERENCE_DIR):
            d.mkdir(parents=True, exist_ok=True)


settings = Settings()
