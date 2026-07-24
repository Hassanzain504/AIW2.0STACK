# Accent & Prosody Trainer (General American)

A local-first web app that trains a Pakistani/Indian-English speaker toward
General American pronunciation and prosody. You record a sentence, the app
analyses your audio against a reference, and it returns specific, physical,
ranked corrections. Never a bare percentage.

> You said /t/ instead of /θ/ in "think" — tongue tip between your teeth, not
> behind them.

Everything runs locally. No cloud API is needed for the core loop. Azure TTS is
used once, offline, to generate the reference clip library.

---

## What is built

This is a working foundation covering the spec's build order through the
signature UI, with the full diagnostic knowledge base in place.

### Backend (`backend/`)

| Area | Files | Status |
|---|---|---|
| Error taxonomy (the diagnostic knowledge base) | `phonetics/error_profile.py` | 20 phone rules + 11 prosody rules, each with detection logic, articulation cue, minimal pairs, mouth diagram key |
| Analysis pipeline (9 stages) | `analysis/pipeline.py` | Orchestrates preprocess → transcribe → align → g2p → phone-compare → acoustic probe → prosody → reference DTW → rank |
| Prosody maths | `analysis/prosody.py` | nPVI, F0 range in semitones (speaker-normalised), speech rate, stress detection, linking, terminal contour — unit-tested |
| Acoustic probes | `analysis/acoustics.py` | parselmouth F0/intensity contours + per-phone formants, VOT, closure, spectral centroid |
| Phone compare | `analysis/phone_compare.py` | panphon-weighted alignment of expected vs produced phones, taxonomy matching |
| Reference DTW | `analysis/dtw.py` | pitch-shape alignment + per-syllable deviation |
| Curriculum + SM-2 | `curriculum/` | 6 phases, 25-minute daily template, spaced repetition over error **rules** |
| Reference generation | `reference/generate.py` | Azure Neural TTS + SSML, caches contours; offline one-time step |
| API | `app/main.py` | FastAPI: upload, analyze, curriculum, next-session, perception gate, progress |
| Persistence | `app/db.py` | SQLite via SQLModel |

Every ML stage (faster-whisper, WhisperX, g2p-en, parselmouth) is a **lazy,
optional** dependency. When a stage is missing the pipeline degrades cleanly:
it still returns a well-formed `SessionReport`, sets `degraded: true`, and lists
which stage was unavailable in `notes`. This means the whole API and UI are
exercisable before the heavy models are installed and their acoustic thresholds
are tuned.

### Frontend (`frontend/`)

React + Vite + TypeScript + Tailwind, on the spec's dark design tokens.

- **PitchRibbon** (`components/PitchRibbon.tsx`) — the centrepiece. Custom SVG.
  Filled ribbon whose thickness = intensity and whose colour along its length =
  per-syllable deviation from the reference, sitting inside a faint ghost of the
  reference contour. Animates left-to-right on analysis (respects
  `prefers-reduced-motion`). A monotone speaker sees a thin, flat ribbon inside
  a wide, undulating ghost.
- **PhonemeStrip** — target IPA as clickable chips, green/amber/red by result,
  popover with expected vs produced IPA, cue, and minimal pairs.
- **ErrorCard** — one per top fix: rule, plain-language explanation, articulation
  cue, animated mouth cross-section, minimal-pair chips, "practice this now".
- **MouthDiagram** — reusable animatable SVG vocal-tract cross-sections.
- **Recorder** — captures mic audio and encodes 16kHz mono WAV in-browser.
- **CurriculumRail / LiveAnalysis** — the three-column layout, collapses below
  900px.

---

## Run it

### Backend

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt          # full stack incl. ML models
# or, to try the API in degraded mode first:
pip install fastapi uvicorn python-multipart sqlmodel numpy soundfile
uvicorn app.main:app --reload --port 8000
```

Check which stages are live:

```bash
curl localhost:8000/api/health
```

### Frontend

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173, proxies /api to :8000
```

### Reference clip library (offline, one-time)

```bash
cd backend
export AZURE_TTS_KEY=...  AZURE_TTS_REGION=eastus
python -m reference.generate --library reference/library.json
```

Without a key it prints what it would generate and exits, so the repo stays
runnable.

---

## Tests

```bash
cd backend && python -m pytest tests/ -q
```

The tests lock in the metric definitions and detector separation the spec's
validation step depends on (nPVI separation, speaker-relative semitone
normalisation, TH and VOT detectors separating good from bad productions).

---

## Validation (before trusting the diagnosis)

Per the spec, thresholds must be tuned against labelled audio before the app is
trusted. False positives are worse than misses — a trainer that flags a correct
production destroys trust. The detector thresholds all live in
`phonetics/error_profile.py` so they can be tuned in one place:

1. Record `TH_VOICELESS` correctly 10× and incorrectly 10×; the detector must
   separate them >85%.
2. Same for `NO_ASPIRATION` (VOT) and `FLAT_PITCH` (F0 range).
3. Run a native GA sample through the pipeline; it should flag near-zero errors.

---

## Design principle

Every error message names a specific sound or syllable and a specific physical
instruction. There is no bare percentage anywhere in the output contract.

## Build status vs spec

Built: steps 1–12 of the spec's build order (backend skeleton through
curriculum + SM-2), plus the signature PitchRibbon and error UI. The heavy ASR/
alignment models are wired as lazy integration points and need the one-time
`pip install -r requirements.txt` plus threshold tuning to leave degraded mode.
Additive extras (shadowing, emotion drills, professional mode, weekly PDF
report, baseline A/B) are scaffolded in the curriculum/API layer and are the
next increment.
