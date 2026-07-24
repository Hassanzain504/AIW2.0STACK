import { useState } from "react";
import type { PhonemeError, ProsodyError } from "../lib/types";
import { MouthDiagram } from "./MouthDiagram";

/**
 * ErrorCard — one per top fix. Rule name, plain-language explanation,
 * articulation cue, an animated mouth cross-section, a minimal-pair drill
 * button, and a "practice this now" action that injects a targeted micro-drill.
 */

type AnyError = PhonemeError | ProsodyError;

function isPhoneme(e: AnyError): e is PhonemeError {
  return (e as PhonemeError).articulation_cue !== undefined;
}

interface Props {
  error: AnyError;
  rank: number;
  onPractice?: (ruleId: string, prompts: string[]) => void;
}

export function ErrorCard({ error, rank, onPractice }: Props) {
  const [open, setOpen] = useState(false);
  const ruleId = error.rule_id;

  const title = ruleId.replace(/_/g, " ").toLowerCase();
  const cue = isPhoneme(error) ? error.articulation_cue : error.drill_suggestion;
  const explanation = error.explanation;
  const diagram = isPhoneme(error) ? error.mouth_diagram : "SCHWA_NEUTRAL";
  const pairs = isPhoneme(error) ? error.minimal_pairs : [];

  return (
    <div className="rounded-lg border border-edge bg-panel p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-signal/15 font-mono text-sm text-signal">
          {rank}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-display text-base font-semibold capitalize text-bone">
              {title}
            </h3>
            <span className="shrink-0 rounded bg-edge px-1.5 py-0.5 font-mono text-[10px] text-muted">
              sev {error.severity}
            </span>
          </div>

          {isPhoneme(error) && (
            <div className="mt-1 font-mono text-sm">
              <span className="text-signal">{error.produced_ipa}</span>
              <span className="mx-1 text-muted">instead of</span>
              <span className="text-clear">{error.expected_ipa}</span>
              <span className="ml-2 text-muted">in "{error.word}"</span>
            </div>
          )}

          <p className="mt-2 text-sm leading-relaxed text-muted">{explanation}</p>

          <div className="mt-3 flex gap-3">
            <div className="h-16 w-16 shrink-0">
              <MouthDiagram
                variant={diagram}
                className="h-full w-full"
                animated={diagram === "DIPHTHONG_GLIDE"}
              />
            </div>
            <p className="text-sm leading-relaxed text-bone">{cue}</p>
          </div>

          {isPhoneme(error) &&
            Object.keys(error.acoustic_evidence).length > 0 && (
              <button
                className="mt-3 font-mono text-[11px] text-muted underline decoration-dotted"
                onClick={() => setOpen((o) => !o)}
              >
                {open ? "hide" : "show"} acoustic evidence
              </button>
            )}
          {open && isPhoneme(error) && (
            <dl className="mt-2 grid grid-cols-2 gap-1 font-mono text-[11px] text-muted">
              {Object.entries(error.acoustic_evidence).map(([k, v]) => (
                <div key={k} className="flex justify-between rounded bg-void px-2 py-1">
                  <dt>{k}</dt>
                  <dd className="text-bone">{v}</dd>
                </div>
              ))}
            </dl>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {pairs.slice(0, 4).map((p) => (
              <span
                key={p}
                className="rounded bg-void px-2 py-1 font-mono text-[11px] text-bone"
              >
                {p}
              </span>
            ))}
            <button
              className="ml-auto rounded bg-signal px-3 py-1.5 text-xs font-semibold text-void hover:opacity-90"
              onClick={() => onPractice?.(ruleId, pairs)}
            >
              practice this now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
