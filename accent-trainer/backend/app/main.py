"""FastAPI application: upload, analyze, curriculum, progress, perception gate."""

from __future__ import annotations

import json
import uuid
from datetime import datetime
from pathlib import Path

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlmodel import select

from analysis import pipeline
from app.config import RECORDINGS_DIR, REFERENCE_DIR, settings
from app.db import (
    PerceptionResult,
    Recording,
    RuleProgress,
    TrainingSession,
    get_session,
    init_db,
)
from app.schemas import SessionReport
from curriculum import minimal_pairs
from curriculum.phases import ASSESSMENT_PASSAGE, DAILY_SESSION, PHASES
from curriculum.scheduler import due_rules, seed_from_report

app = FastAPI(title="Accent & Prosody Trainer", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # local-first, single user
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def _startup() -> None:
    init_db()


@app.get("/api/health")
def health() -> dict:
    from analysis import acoustics, align, asr, g2p

    return {
        "ok": True,
        "stages": {
            "asr": asr.available(),
            "align": align.available(),
            "g2p": g2p.available(),
            "prosody": acoustics.available(),
        },
    }


@app.get("/api/curriculum")
def curriculum() -> dict:
    return {
        "phases": [
            {
                "index": p.index, "weeks": p.weeks, "name": p.name,
                "focus": p.focus,
                "drills": [
                    {"label": d.label, "target_rules": d.target_rules,
                     "prompts": d.prompts}
                    for d in p.drills
                ],
            }
            for p in PHASES
        ],
        "daily_session": [
            {"minutes": b.minutes, "name": b.name, "content": b.content}
            for b in DAILY_SESSION
        ],
        "assessment_passage": ASSESSMENT_PASSAGE,
    }


@app.get("/api/session/next")
def next_session() -> dict:
    """The rules due today, plus the drills that target them."""
    with get_session() as s:
        rule_ids = due_rules(s, limit=6)
    drills = []
    for p in PHASES:
        for d in p.drills:
            if any(r in rule_ids for r in d.target_rules):
                drills.append({"label": d.label, "target_rules": d.target_rules,
                               "prompts": d.prompts, "phase": p.index})
    return {"due_rules": rule_ids, "drills": drills}


@app.get("/api/minimal-pairs/{rule_id}")
def get_minimal_pairs(rule_id: str) -> dict:
    return {"rule_id": rule_id, "pairs": minimal_pairs.pairs_for_rule(rule_id)}


class AnalyzeResponse(BaseModel):
    recording_id: int
    session_id: int
    report: SessionReport


@app.post("/api/analyze", response_model=AnalyzeResponse)
async def analyze(
    audio: UploadFile = File(...),
    target_text: str = Form(...),
    reference_id: str = Form(default=""),
    kind: str = Form(default="drill"),
) -> AnalyzeResponse:
    settings.ensure_dirs()
    day = datetime.utcnow().strftime("%Y-%m-%d")
    day_dir = RECORDINGS_DIR / day
    day_dir.mkdir(parents=True, exist_ok=True)
    fname = f"{uuid.uuid4().hex}.wav"
    dest = day_dir / fname
    dest.write_bytes(await audio.read())

    reference = _load_reference(reference_id) if reference_id else None

    try:
        report = pipeline.analyze(str(dest), target_text, reference)
    except Exception as e:  # never 500 on a bad clip; surface a clear message
        raise HTTPException(status_code=422, detail=f"Analysis failed: {e}")

    with get_session() as s:
        rec = Recording(path=str(dest), target_text=target_text,
                        reference_id=reference_id or None,
                        transcript=report.transcript, kind=kind,
                        duration_ms=_last_ms(report))
        s.add(rec)
        s.commit()
        s.refresh(rec)
        recording_id = rec.id

        sess = TrainingSession(
            recording_id=recording_id,
            intelligibility=report.overall.intelligibility,
            prosody=report.overall.prosody,
            fluency=report.overall.fluency,
            report_json=report.model_dump_json(),
        )
        s.add(sess)
        s.commit()
        s.refresh(sess)
        session_id = sess.id

        # advance SM-2 over the rules this drill targeted
        target_ids = _target_ids_for_text()
        seed_from_report(
            s,
            [e.rule_id for e in report.phoneme_errors],
            [e.rule_id for e in report.prosody_errors],
            target_ids,
        )

    return AnalyzeResponse(recording_id=recording_id, session_id=session_id,
                           report=report)


class PerceptionSubmit(BaseModel):
    rule_id: str
    correct: int
    total: int


@app.post("/api/perception")
def perception(sub: PerceptionSubmit) -> dict:
    """Perception gate: must hit >=80% before production drills unlock."""
    acc = sub.correct / sub.total if sub.total else 0.0
    passed = acc >= 0.8
    with get_session() as s:
        s.add(PerceptionResult(rule_id=sub.rule_id, accuracy=acc, passed=passed))
        s.commit()
    return {"rule_id": sub.rule_id, "accuracy": round(acc, 3), "passed": passed,
            "message": ("Production unlocked." if passed else
                        "Keep training your ear. You cannot self-correct a "
                        "contrast you cannot hear yet.")}


@app.get("/api/progress")
def progress() -> dict:
    with get_session() as s:
        rules = s.exec(select(RuleProgress)).all()
        sessions = s.exec(select(TrainingSession)).all()
    return {
        "rules": [
            {"rule_id": r.rule_id, "status": r.status,
             "consecutive_correct": r.consecutive_correct,
             "total_attempts": r.total_attempts, "total_errors": r.total_errors,
             "next_due": r.next_due.isoformat()}
            for r in rules
        ],
        "sessions": [
            {"id": ss.id, "created_at": ss.created_at.isoformat(),
             "intelligibility": ss.intelligibility, "prosody": ss.prosody,
             "fluency": ss.fluency, "npvi": ss.npvi,
             "f0_range_st": ss.f0_range_st}
            for ss in sessions
        ],
    }


@app.get("/api/report/{session_id}", response_model=SessionReport)
def get_report(session_id: int) -> SessionReport:
    with get_session() as s:
        sess = s.get(TrainingSession, session_id)
        if not sess:
            raise HTTPException(status_code=404, detail="Session not found")
        return SessionReport.model_validate_json(sess.report_json)


# --------------------------------------------------------------------------- #

def _load_reference(reference_id: str) -> pipeline.ReferenceData | None:
    meta = REFERENCE_DIR / f"{reference_id}.json"
    if not meta.exists():
        return None
    data = json.loads(meta.read_text())
    return pipeline.ReferenceData(
        f0_hz=data.get("f0_hz", []),
        intensity_db=data.get("intensity_db", []),
        hop_ms=data.get("hop_ms", 10.0),
    )


def _last_ms(report: SessionReport) -> int:
    if report.word_timings:
        return report.word_timings[-1].end_ms
    return 0


def _target_ids_for_text() -> list[str]:
    # A production build derives target rules from the drill definition; for the
    # generic analyze endpoint we advance the full taxonomy conservatively.
    return []
