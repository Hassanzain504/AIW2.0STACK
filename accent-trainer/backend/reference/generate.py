"""Reference audio generation (one-time, offline).

Generate GA reference clips with Azure Neural TTS + SSML, store as 16kHz WAV,
and pre-compute F0 / intensity / alignment so the runtime never analyses the
reference. Also generates a slow (rate 0.7) version of every clip.

This is NOT part of the runtime loop. Run it once to build the clip library:

    python -m reference.generate --library reference/library.json

Requires AZURE_TTS_KEY and AZURE_TTS_REGION. If the SDK or key is missing the
script prints what it would generate and exits, so the repo stays runnable
without cloud access.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

from app.config import REFERENCE_DIR, settings


SSML_TEMPLATE = """<speak version="1.0" xml:lang="en-US">
  <voice name="{voice}">
    <prosody rate="{rate}">{body}</prosody>
  </voice>
</speak>"""


def build_ssml(text: str, voice: str, rate: float, emphasis_word: str | None) -> str:
    body = text
    if emphasis_word and emphasis_word in text:
        body = text.replace(
            emphasis_word,
            f'<emphasis level="strong">{emphasis_word}</emphasis>', 1,
        )
    return SSML_TEMPLATE.format(voice=voice, rate=rate, body=body)


def synthesize(ssml: str, out_wav: Path) -> bool:
    try:
        import azure.cognitiveservices.speech as speechsdk
    except Exception:
        print(f"[skip] azure SDK not installed; would write {out_wav}")
        return False
    if not settings.azure_tts_key:
        print(f"[skip] AZURE_TTS_KEY not set; would write {out_wav}")
        return False

    speech_config = speechsdk.SpeechConfig(
        subscription=settings.azure_tts_key, region=settings.azure_tts_region
    )
    speech_config.set_speech_synthesis_output_format(
        speechsdk.SpeechSynthesisOutputFormat.Riff16Khz16BitMonoPcm
    )
    audio_config = speechsdk.audio.AudioOutputConfig(filename=str(out_wav))
    synth = speechsdk.SpeechSynthesizer(speech_config=speech_config,
                                        audio_config=audio_config)
    result = synth.speak_ssml_async(ssml).get()
    ok = result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted
    if not ok:
        print(f"[error] TTS failed for {out_wav}: {result.reason}")
    return ok


def precompute_contours(wav_path: Path, meta_path: Path, ref_id: str) -> None:
    """Cache F0 + intensity contours next to the clip so runtime never touches it."""
    try:
        from analysis import acoustics

        if acoustics.available():
            c = acoustics.extract_contours(str(wav_path))
            meta_path.write_text(json.dumps({
                "id": ref_id,
                "wav": str(wav_path),
                "f0_hz": c.f0_hz,
                "intensity_db": c.intensity_db,
                "hop_ms": c.hop_ms,
            }))
            return
    except Exception as e:
        print(f"[warn] could not precompute contours for {ref_id}: {e}")
    meta_path.write_text(json.dumps({"id": ref_id, "wav": str(wav_path),
                                     "f0_hz": [], "intensity_db": []}))


def generate_library(library_path: str) -> None:
    REFERENCE_DIR.mkdir(parents=True, exist_ok=True)
    items = json.loads(Path(library_path).read_text())
    for item in items:
        ref_id = item["id"]
        text = item["text"]
        voice = item.get("voice", "en-US-AndrewNeural")
        emphasis = item.get("emphasis")
        for suffix, rate in (("", 0.9), (".slow", 0.7)):
            wav = REFERENCE_DIR / f"{ref_id}{suffix}.wav"
            ssml = build_ssml(text, voice, rate, emphasis)
            if synthesize(ssml, wav):
                precompute_contours(
                    wav, REFERENCE_DIR / f"{ref_id}{suffix}.json", f"{ref_id}{suffix}"
                )


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--library", default="reference/library.json")
    args = ap.parse_args()
    generate_library(args.library)
