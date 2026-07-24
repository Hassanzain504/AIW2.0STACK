"""SM-2 spaced repetition over error rules (not over flashcards).

Each error `rule_id` carries its own interval and ease factor. After every
session the scheduler updates the rules that were practised, then picks the
rules currently due, weighted by severity, to build the next session's drills.

Graduation: a rule is "mastered" once produced correctly in 5 consecutive
sessions with confidence > 0.8.
"""

from __future__ import annotations

from datetime import datetime, timedelta

from sqlmodel import Session, select

from app.db import RuleProgress
from phonetics import error_profile as ep

CONFIDENCE_GATE = 0.8
GRADUATION_STREAK = 5


def _severity(rule_id: str) -> int:
    r = ep.phone_rule(rule_id) or ep.prosody_rule(rule_id)
    return r.severity if r else 3


def ensure_rule(session: Session, rule_id: str) -> RuleProgress:
    rp = session.get(RuleProgress, rule_id)
    if rp is None:
        rp = RuleProgress(rule_id=rule_id, next_due=datetime.utcnow())
        session.add(rp)
        session.commit()
        session.refresh(rp)
    return rp


def record_attempt(
    session: Session, rule_id: str, correct: bool, confidence: float
) -> RuleProgress:
    """Update SM-2 state for one rule after a graded attempt.

    `correct` means the target was produced acceptably this session;
    `confidence` is the detector/aligner confidence for that judgement.
    """
    rp = ensure_rule(session, rule_id)
    rp.total_attempts += 1
    rp.last_seen = datetime.utcnow()

    quality = _quality(correct, confidence)  # SM-2 grade 0..5

    if quality < 3:  # lapse
        rp.total_errors += 1
        rp.consecutive_correct = 0
        rp.interval_days = 1.0
        rp.status = "learning"
    else:
        if correct and confidence > CONFIDENCE_GATE:
            rp.consecutive_correct += 1
        else:
            rp.consecutive_correct = 0
        # SM-2 ease update
        rp.ease = max(1.3, rp.ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)))
        if rp.consecutive_correct <= 1:
            rp.interval_days = 1.0
        elif rp.consecutive_correct == 2:
            rp.interval_days = 6.0
        else:
            rp.interval_days = round(rp.interval_days * rp.ease, 1)
        rp.status = "review"

    if rp.consecutive_correct >= GRADUATION_STREAK:
        rp.status = "mastered"
        rp.interval_days = max(rp.interval_days, 21.0)

    rp.next_due = datetime.utcnow() + timedelta(days=rp.interval_days)
    session.add(rp)
    session.commit()
    session.refresh(rp)
    return rp


def _quality(correct: bool, confidence: float) -> int:
    if not correct:
        return 1 if confidence > 0.5 else 2  # wrong; hesitation vs clear miss
    if confidence >= 0.95:
        return 5
    if confidence >= CONFIDENCE_GATE:
        return 4
    return 3


def due_rules(session: Session, limit: int = 6) -> list[str]:
    """Return rule ids due now, ranked by severity then overdue-ness.

    New rules that have never been seen are surfaced first (highest severity)
    so the learner is introduced to their worst problems early.
    """
    now = datetime.utcnow()
    rows = session.exec(select(RuleProgress)).all()
    due = [r for r in rows if r.status != "mastered" and r.next_due <= now]

    def sort_key(r: RuleProgress):
        overdue = (now - r.next_due).total_seconds()
        new_bonus = 1 if r.status == "new" else 0
        return (new_bonus, _severity(r.rule_id), overdue)

    due.sort(key=sort_key, reverse=True)
    return [r.rule_id for r in due[:limit]]


def seed_from_report(session: Session, phoneme_error_ids: list[str],
                     prosody_error_ids: list[str], all_target_ids: list[str]) -> None:
    """After a session: fired rules count as attempts (incorrect); target rules
    that did NOT fire count as correct attempts.
    """
    fired = set(phoneme_error_ids) | set(prosody_error_ids)
    for rid in all_target_ids:
        record_attempt(session, rid, correct=(rid not in fired),
                       confidence=0.85 if rid not in fired else 0.6)
