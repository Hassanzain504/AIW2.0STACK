import { useMemo, useState } from "react";
import type { PhonemeError } from "../lib/types";

/**
 * PhonemeStrip — the target sentence rendered in IPA, monospace, each phoneme a
 * clickable chip coloured green/amber/red by result. Clicking opens a popover
 * with expected vs produced IPA, the articulation cue and minimal pairs.
 *
 * We render the target IPA supplied by the backend g2p step. Errors are matched
 * to chips by word so the offending phoneme lights up.
 */

interface Props {
  ipa: string; // whitespace-separated target IPA tokens
  errors: PhonemeError[];
}

export function PhonemeStrip({ ipa, errors }: Props) {
  const [active, setActive] = useState<number | null>(null);
  const tokens = useMemo(() => ipa.split(/\s+/).filter(Boolean), [ipa]);

  const errByIpa = useMemo(() => {
    const m = new Map<string, PhonemeError>();
    for (const e of errors) m.set(e.expected_ipa, e);
    return m;
  }, [errors]);

  if (tokens.length === 0) {
    return (
      <div className="font-mono text-sm text-muted">
        IPA appears here once g2p is available.
      </div>
    );
  }

  return (
    <div className="relative flex flex-wrap gap-1">
      {tokens.map((tok, i) => {
        const err = errByIpa.get(tok);
        const state = err ? (err.severity >= 4 ? "signal" : "watch") : "clear";
        const cls =
          state === "signal"
            ? "bg-signal/15 text-signal border-signal/40"
            : state === "watch"
              ? "bg-watch/15 text-watch border-watch/40"
              : "bg-clear/10 text-clear border-clear/30";
        return (
          <button
            key={i}
            className={`rounded border px-2 py-1 font-mono text-sm ${cls}`}
            onClick={() => setActive(active === i ? null : i)}
          >
            {tok}
          </button>
        );
      })}

      {active !== null && errByIpa.get(tokens[active]) && (
        <Popover error={errByIpa.get(tokens[active])!} onClose={() => setActive(null)} />
      )}
    </div>
  );
}

function Popover({ error, onClose }: { error: PhonemeError; onClose: () => void }) {
  return (
    <div className="absolute left-0 top-full z-10 mt-2 w-72 rounded-lg border border-edge bg-panel p-3 shadow-xl">
      <div className="flex items-center justify-between">
        <span className="font-mono text-sm">
          <span className="text-signal">{error.produced_ipa}</span>
          <span className="mx-1 text-muted">→</span>
          <span className="text-clear">{error.expected_ipa}</span>
        </span>
        <button className="text-muted hover:text-bone" onClick={onClose}>
          ✕
        </button>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-bone">{error.articulation_cue}</p>
      {error.minimal_pairs.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {error.minimal_pairs.map((p) => (
            <span key={p} className="rounded bg-void px-1.5 py-0.5 font-mono text-[10px]">
              {p}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
