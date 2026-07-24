import type { AnalyzeResponse, Curriculum } from "./types";

const BASE = "/api";

export async function getCurriculum(): Promise<Curriculum> {
  const r = await fetch(`${BASE}/curriculum`);
  if (!r.ok) throw new Error("Failed to load curriculum");
  return r.json();
}

export async function analyze(
  blob: Blob,
  targetText: string,
  referenceId = "",
  kind = "drill",
): Promise<AnalyzeResponse> {
  const fd = new FormData();
  fd.append("audio", blob, "recording.wav");
  fd.append("target_text", targetText);
  fd.append("reference_id", referenceId);
  fd.append("kind", kind);
  const r = await fetch(`${BASE}/analyze`, { method: "POST", body: fd });
  if (!r.ok) {
    const detail = await r.json().catch(() => ({}));
    throw new Error(detail.detail ?? "Analysis failed");
  }
  return r.json();
}

export async function getMinimalPairs(ruleId: string): Promise<string[]> {
  const r = await fetch(`${BASE}/minimal-pairs/${ruleId}`);
  if (!r.ok) return [];
  return (await r.json()).pairs;
}

export async function health(): Promise<{
  ok: boolean;
  stages: Record<string, boolean>;
}> {
  const r = await fetch(`${BASE}/health`);
  return r.json();
}
