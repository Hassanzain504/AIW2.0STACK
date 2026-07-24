"""API / analysis output schemas.

These mirror the SessionReport contract in the build spec. The frontend depends
on these field names, so keep them stable.
"""

from __future__ import annotations

from pydantic import BaseModel, Field


class PhonemeError(BaseModel):
    rule_id: str
    word: str
    position_in_word: int
    expected_ipa: str
    produced_ipa: str
    start_ms: int
    end_ms: int
    severity: int  # 1-5
    explanation: str
    articulation_cue: str
    minimal_pairs: list[str] = Field(default_factory=list)
    mouth_diagram: str = ""
    acoustic_evidence: dict = Field(default_factory=dict)


class ProsodyError(BaseModel):
    rule_id: str
    measured: float
    target_range: tuple[float, float]
    unit: str
    severity: int
    explanation: str
    drill_suggestion: str
    affected_spans: list[tuple[int, int]] = Field(default_factory=list)


class WordTiming(BaseModel):
    word: str
    start_ms: int
    end_ms: int
    stressed: bool = False
    stress_misplaced: bool = False


class OverallScores(BaseModel):
    intelligibility: int  # 0-100
    prosody: int  # 0-100
    fluency: int  # 0-100


class SessionReport(BaseModel):
    overall: OverallScores
    phoneme_errors: list[PhonemeError] = Field(default_factory=list)
    prosody_errors: list[ProsodyError] = Field(default_factory=list)
    top_three_fixes: list[str] = Field(default_factory=list)
    pitch_contour: list[float] = Field(default_factory=list)  # user, semitones
    reference_contour: list[float] = Field(default_factory=list)
    intensity_contour: list[float] = Field(default_factory=list)
    per_syllable_deviation: list[float] = Field(default_factory=list)
    word_timings: list[WordTiming] = Field(default_factory=list)
    transcript: str = ""
    wer_vs_target: float = 0.0
    analysis_ms: int = 0
    degraded: bool = False  # True when ML stages were unavailable
    notes: list[str] = Field(default_factory=list)
