// Mirrors backend/app/schemas.py — keep field names in sync.

export interface PhonemeError {
  rule_id: string;
  word: string;
  position_in_word: number;
  expected_ipa: string;
  produced_ipa: string;
  start_ms: number;
  end_ms: number;
  severity: number;
  explanation: string;
  articulation_cue: string;
  minimal_pairs: string[];
  mouth_diagram: string;
  acoustic_evidence: Record<string, number>;
}

export interface ProsodyError {
  rule_id: string;
  measured: number;
  target_range: [number, number];
  unit: string;
  severity: number;
  explanation: string;
  drill_suggestion: string;
  affected_spans: [number, number][];
}

export interface WordTiming {
  word: string;
  start_ms: number;
  end_ms: number;
  stressed: boolean;
  stress_misplaced: boolean;
}

export interface SessionReport {
  overall: { intelligibility: number; prosody: number; fluency: number };
  phoneme_errors: PhonemeError[];
  prosody_errors: ProsodyError[];
  top_three_fixes: string[];
  pitch_contour: number[];
  reference_contour: number[];
  intensity_contour: number[];
  per_syllable_deviation: number[];
  word_timings: WordTiming[];
  transcript: string;
  wer_vs_target: number;
  analysis_ms: number;
  degraded: boolean;
  notes: string[];
}

export interface AnalyzeResponse {
  recording_id: number;
  session_id: number;
  report: SessionReport;
}

export interface Drill {
  label: string;
  target_rules: string[];
  prompts: string[];
}

export interface Phase {
  index: number;
  weeks: string;
  name: string;
  focus: string;
  drills: Drill[];
}

export interface Curriculum {
  phases: Phase[];
  daily_session: { minutes: number; name: string; content: string }[];
  assessment_passage: string;
}
