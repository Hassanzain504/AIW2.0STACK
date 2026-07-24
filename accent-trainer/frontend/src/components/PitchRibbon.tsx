import { useEffect, useMemo, useRef, useState } from "react";
import type { WordTiming } from "../lib/types";

/**
 * PitchRibbon — the signature component.
 *
 * X axis = time. Y axis = pitch in semitones relative to the speaker's own
 * median. The user's contour is a *filled ribbon* whose vertical thickness at
 * each point is the normalized intensity (loud = thick, quiet = thin) and whose
 * colour along its length maps to per-syllable deviation from the reference
 * (clear = matched, watch = marginal, signal = wrong). The reference sits
 * underneath as a faint ghost ribbon.
 *
 * The insight: a monotone speaker sees a thin, flat, straight ribbon sitting
 * inside a wide, undulating ghost. Progress = the ribbon growing to fill it.
 */

interface Props {
  pitch: number[]; // user, semitones (0 where unvoiced)
  reference: number[]; // reference, semitones
  intensity: number[]; // dB or arbitrary, per frame
  perSyllableDeviation: number[]; // one per syllable span
  words: WordTiming[];
  hopMs?: number;
  onScrub?: (startMs: number, endMs: number) => void;
}

const W = 720;
const H = 240;
const PAD = { top: 20, bottom: 40, left: 36, right: 12 };

function color(dev: number): string {
  // deviation in semitones -> traffic colour
  if (dev < 1.0) return "#39D98A"; // clear
  if (dev < 2.5) return "#F5B342"; // watch
  return "#F0552B"; // signal
}

export function PitchRibbon({
  pitch,
  reference,
  intensity,
  perSyllableDeviation,
  words,
  hopMs = 10,
  onScrub,
}: Props) {
  const [progress, setProgress] = useState(0);
  const raf = useRef<number>();

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce || pitch.length === 0) {
      setProgress(1);
      return;
    }
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 800);
      setProgress(p);
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [pitch]);

  const geom = useMemo(
    () => buildGeometry(pitch, reference, intensity),
    [pitch, reference, intensity],
  );

  const plotW = W - PAD.left - PAD.right;
  const totalMs = pitch.length * hopMs;

  if (pitch.length === 0) {
    return (
      <div className="flex h-[240px] items-center justify-center rounded-lg border border-edge bg-panel text-sm text-muted">
        No pitch data. Record a clip to see your ribbon.
      </div>
    );
  }

  const clipW = PAD.left + plotW * progress;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full select-none"
      role="img"
      aria-label="Pitch ribbon comparing your intonation to the reference"
    >
      <defs>
        <clipPath id="reveal">
          <rect x="0" y="0" width={clipW} height={H} />
        </clipPath>
        <linearGradient id="ribbonGrad" x1="0" x2="1" y1="0" y2="0">
          {geom.gradientStops.map((s, i) => (
            <stop key={i} offset={`${s.offset}%`} stopColor={s.color} />
          ))}
        </linearGradient>
      </defs>

      {/* zero line (speaker median) */}
      <line
        x1={PAD.left}
        x2={W - PAD.right}
        y1={geom.yZero}
        y2={geom.yZero}
        stroke="#232830"
        strokeDasharray="3 4"
      />
      <text x={4} y={geom.yZero + 4} fill="#7A8290" fontSize="10" className="font-mono">
        0st
      </text>

      {/* reference ghost ribbon */}
      {geom.refPath && (
        <path d={geom.refPath} fill="#3A424D" opacity={0.35} />
      )}

      {/* user ribbon, colour-graded, revealed left to right */}
      <g clipPath="url(#reveal)">
        <path d={geom.userPath} fill="url(#ribbonGrad)" />
      </g>

      {/* stress ticks */}
      {geom.stressTicks.map((t, i) => (
        <line
          key={i}
          x1={t.x}
          x2={t.x}
          y1={PAD.top - 6}
          y2={PAD.top + 2}
          stroke={t.misplaced ? "#F0552B" : "#E8E3D9"}
          strokeWidth={2}
        />
      ))}

      {/* word labels, clickable to scrub */}
      {words.map((w, i) => {
        const x = PAD.left + (w.start_ms / (totalMs || 1)) * plotW;
        const wWidth = ((w.end_ms - w.start_ms) / (totalMs || 1)) * plotW;
        return (
          <g key={i} className="cursor-pointer" onClick={() => onScrub?.(w.start_ms, w.end_ms)}>
            <rect
              x={x}
              y={H - PAD.bottom + 6}
              width={Math.max(2, wWidth)}
              height={18}
              fill="transparent"
            />
            <text
              x={x + wWidth / 2}
              y={H - PAD.bottom + 20}
              fill="#7A8290"
              fontSize="11"
              textAnchor="middle"
              className="font-mono hover:fill-bone"
            >
              {w.word}
            </text>
          </g>
        );
      })}

      {/* deviation legend swatches, kept tiny */}
      <g transform={`translate(${W - PAD.right - 150}, 8)`}>
        {[
          ["#39D98A", "matched"],
          ["#F5B342", "close"],
          ["#F0552B", "off"],
        ].map(([c, label], i) => (
          <g key={i} transform={`translate(${i * 52}, 0)`}>
            <rect width={8} height={8} rx={2} fill={c} />
            <text x={12} y={8} fill="#7A8290" fontSize="9" className="font-mono">
              {label}
            </text>
          </g>
        ))}
      </g>

      {/* per-syllable deviation strip: one cell per analysed syllable */}
      {perSyllableDeviation.length > 0 && (
        <g transform={`translate(${PAD.left}, ${PAD.top - 14})`}>
          {perSyllableDeviation.map((dev, i) => {
            const cw = plotW / perSyllableDeviation.length;
            return (
              <rect
                key={i}
                x={i * cw}
                y={0}
                width={Math.max(1, cw - 1)}
                height={4}
                rx={1}
                fill={color(dev)}
                opacity={0.85}
              />
            );
          })}
        </g>
      )}
    </svg>
  );
}

interface Geometry {
  userPath: string;
  refPath: string | null;
  yZero: number;
  gradientStops: { offset: number; color: string }[];
  stressTicks: { x: number; misplaced: boolean }[];
}

function buildGeometry(
  pitch: number[],
  reference: number[],
  intensity: number[],
): Geometry {
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;

  const voiced = pitch.filter((p) => p !== 0);
  const allVals = voiced.concat(reference.filter((p) => p !== 0));
  const maxAbs = Math.max(6, ...allVals.map(Math.abs));
  const yZero = PAD.top + plotH / 2;
  const yScale = (st: number) => yZero - (st / maxAbs) * (plotH / 2);
  const xAt = (i: number, n: number) => PAD.left + (i / Math.max(1, n - 1)) * plotW;

  // normalize intensity to a thickness in px
  const iMax = Math.max(1, ...intensity.map((v) => (isFinite(v) ? v : 0)));
  const iMin = Math.min(...intensity.filter((v) => isFinite(v)), 0);
  const thick = (i: number) => {
    const v = intensity[i] ?? iMin;
    const norm = (v - iMin) / (iMax - iMin || 1);
    return 2 + norm * 20; // 2..22 px half-thickness
  };

  const userPath = ribbonPath(pitch, xAt, yScale, thick);

  const refThick = () => 6;
  const refPath =
    reference.length > 0
      ? ribbonPath(reference, (i) => xAt(i, reference.length), yScale, refThick)
      : null;

  // gradient stops from a coarse resampling of deviation-by-position. Without a
  // syllable map we approximate deviation as |user - ref| smoothed.
  const stops: { offset: number; color: string }[] = [];
  const N = 24;
  for (let k = 0; k < N; k++) {
    const idx = Math.floor((k / (N - 1)) * (pitch.length - 1));
    const u = pitch[idx] ?? 0;
    const r = reference[idx] ?? u;
    const dev = u === 0 ? 0 : Math.abs(u - r);
    stops.push({ offset: (k / (N - 1)) * 100, color: color(dev) });
  }

  return {
    userPath,
    refPath,
    yZero,
    gradientStops: stops,
    stressTicks: [],
  };
}

function ribbonPath(
  vals: number[],
  xAt: (i: number, n: number) => number,
  yScale: (st: number) => number,
  thick: (i: number) => number,
): string {
  const n = vals.length;
  const top: string[] = [];
  const bottom: string[] = [];
  let started = false;
  for (let i = 0; i < n; i++) {
    if (vals[i] === 0) continue; // skip unvoiced gaps
    const x = xAt(i, n);
    const yc = yScale(vals[i]);
    const t = thick(i);
    top.push(`${started ? "L" : "M"}${x.toFixed(1)},${(yc - t).toFixed(1)}`);
    bottom.push(`L${x.toFixed(1)},${(yc + t).toFixed(1)}`);
    started = true;
  }
  if (!started) return "";
  return `${top.join(" ")} ${bottom.reverse().join(" ")} Z`;
}
