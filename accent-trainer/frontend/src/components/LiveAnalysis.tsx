import type { SessionReport } from "../lib/types";

interface Props {
  report: SessionReport | null;
}

function Metric({
  label,
  value,
  unit,
  bad,
}: {
  label: string;
  value: string;
  unit?: string;
  bad?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between border-b border-edge py-2">
      <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
        {label}
      </span>
      <span className={`font-mono text-sm ${bad ? "text-signal" : "text-bone"}`}>
        {value}
        {unit && <span className="ml-0.5 text-muted">{unit}</span>}
      </span>
    </div>
  );
}

export function LiveAnalysis({ report }: Props) {
  const npvi = report?.prosody_errors.find((e) => e.rule_id === "SYLLABLE_TIMED");
  const flat = report?.prosody_errors.find((e) => e.rule_id === "FLAT_PITCH");
  const rate = report?.prosody_errors.find((e) => e.rule_id === "SPEECH_RATE");

  return (
    <aside className="flex h-full flex-col gap-4 border-l border-edge bg-panel p-4">
      <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-muted">
        Live Analysis
      </h2>

      {report ? (
        <>
          <div className="grid grid-cols-3 gap-2">
            {[
              ["intel", report.overall.intelligibility],
              ["prosody", report.overall.prosody],
              ["fluency", report.overall.fluency],
            ].map(([k, v]) => (
              <div key={k} className="rounded-lg border border-edge bg-void p-2 text-center">
                <div className="font-display text-2xl font-semibold text-bone">{v}</div>
                <div className="font-mono text-[9px] uppercase text-muted">{k}</div>
              </div>
            ))}
          </div>

          <div>
            <Metric
              label="nPVI"
              value={npvi ? npvi.measured.toFixed(1) : "—"}
              bad={!!npvi}
            />
            <Metric
              label="Range"
              value={flat ? flat.measured.toFixed(1) : "—"}
              unit="st"
              bad={!!flat}
            />
            <Metric
              label="Rate"
              value={rate ? rate.measured.toFixed(1) : "—"}
              unit="/s"
              bad={!!rate}
            />
            <Metric label="WER" value={report.wer_vs_target.toFixed(2)} />
          </div>

          <div>
            <div className="mb-2 font-mono text-[11px] uppercase tracking-wider text-muted">
              Top fixes
            </div>
            <ol className="flex flex-col gap-2">
              {report.top_three_fixes.map((f, i) => (
                <li key={i} className="flex gap-2 text-xs leading-relaxed text-bone">
                  <span className="font-mono text-signal">{i + 1}.</span>
                  <span>{f}</span>
                </li>
              ))}
              {report.top_three_fixes.length === 0 && (
                <li className="text-xs text-clear">
                  No errors detected. Clean production.
                </li>
              )}
            </ol>
          </div>

          {report.degraded && (
            <div className="mt-auto rounded border border-watch/40 bg-watch/10 p-2 text-[11px] leading-relaxed text-watch">
              Running in degraded mode. Some analysis stages are unavailable:
              <ul className="mt-1 list-inside list-disc">
                {report.notes.map((n, i) => (
                  <li key={i}>{n}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : (
        <p className="text-sm text-muted">
          Record the drill sentence to see your pitch ribbon and ranked fixes.
        </p>
      )}
    </aside>
  );
}
