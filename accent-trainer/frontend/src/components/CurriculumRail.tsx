import type { Curriculum } from "../lib/types";

interface Props {
  curriculum: Curriculum | null;
  activePhase: number;
  streak: number;
  completedBlocks: number;
}

export function CurriculumRail({
  curriculum,
  activePhase,
  streak,
  completedBlocks,
}: Props) {
  const phase = curriculum?.phases.find((p) => p.index === activePhase);
  const blocks = curriculum?.daily_session ?? [];

  return (
    <aside className="flex h-full flex-col gap-5 border-r border-edge bg-panel p-4">
      <div>
        <div className="font-mono text-[11px] uppercase tracking-wider text-muted">
          Phase {activePhase}
        </div>
        <h2 className="font-display text-lg font-semibold text-bone">
          {phase?.name ?? "…"}
        </h2>
        <div className="font-mono text-[11px] text-muted">Weeks {phase?.weeks}</div>
        <p className="mt-1 text-xs leading-relaxed text-muted">{phase?.focus}</p>
      </div>

      <div>
        <div className="mb-2 font-mono text-[11px] uppercase tracking-wider text-muted">
          Today
        </div>
        <ol className="flex flex-col gap-1.5">
          {blocks.map((b, i) => {
            const done = i < completedBlocks;
            const current = i === completedBlocks;
            return (
              <li
                key={i}
                className={`flex items-center gap-2 rounded px-2 py-1.5 text-sm ${
                  current ? "bg-edge text-bone" : "text-muted"
                }`}
              >
                <span
                  className={`flex h-3.5 w-3.5 items-center justify-center rounded-full text-[9px] ${
                    done
                      ? "bg-clear text-void"
                      : current
                        ? "border border-bone"
                        : "border border-edge"
                  }`}
                >
                  {done ? "✓" : ""}
                </span>
                <span className="flex-1">{b.name}</span>
                <span className="font-mono text-[10px] text-muted">{b.minutes}m</span>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="mt-auto flex items-center justify-between rounded-lg border border-edge bg-void px-3 py-2">
        <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
          Streak
        </span>
        <span className="font-display text-xl font-semibold text-clear">{streak}</span>
      </div>
    </aside>
  );
}
