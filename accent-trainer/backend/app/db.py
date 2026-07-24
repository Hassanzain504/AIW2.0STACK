"""SQLite persistence via SQLModel.

Tables:
- Recording:   one row per uploaded clip (path, target text, transcript).
- Session:     a training session, the JSON SessionReport, and scores.
- RuleProgress: SM-2 state per error rule (see curriculum.scheduler).
- PerceptionResult: gate data for perception-before-production.
"""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from sqlmodel import Field, Session, SQLModel, create_engine

from app.config import settings

engine = create_engine(settings.db_url, echo=False,
                       connect_args={"check_same_thread": False})


class Recording(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    path: str
    target_text: str
    reference_id: Optional[str] = None
    transcript: str = ""
    duration_ms: int = 0
    kind: str = "drill"  # drill | free | baseline | assessment | shadow


class TrainingSession(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    recording_id: Optional[int] = Field(default=None, foreign_key="recording.id")
    phase: int = 1
    week: int = 1
    intelligibility: int = 0
    prosody: int = 0
    fluency: int = 0
    npvi: float = 0.0
    f0_range_st: float = 0.0
    report_json: str = ""  # serialized SessionReport
    self_notice: str = ""  # metacognitive log (Extra feature 7)


class RuleProgress(SQLModel, table=True):
    rule_id: str = Field(primary_key=True)
    ease: float = 2.5
    interval_days: float = 1.0
    consecutive_correct: int = 0
    total_attempts: int = 0
    total_errors: int = 0
    last_seen: datetime = Field(default_factory=datetime.utcnow)
    next_due: datetime = Field(default_factory=datetime.utcnow)
    status: str = "new"  # new | learning | review | mastered


class PerceptionResult(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    rule_id: str
    accuracy: float  # 0-1 over the trial block
    passed: bool  # accuracy >= 0.8 gate


def init_db() -> None:
    settings.ensure_dirs()
    SQLModel.metadata.create_all(engine)


def get_session() -> Session:
    return Session(engine)
