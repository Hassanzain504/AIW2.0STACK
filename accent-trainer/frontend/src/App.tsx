import { useEffect, useState } from "react";
import { CurriculumRail } from "./components/CurriculumRail";
import { ErrorCard } from "./components/ErrorCard";
import { LiveAnalysis } from "./components/LiveAnalysis";
import { PhonemeStrip } from "./components/PhonemeStrip";
import { PitchRibbon } from "./components/PitchRibbon";
import { Recorder } from "./components/Recorder";
import { analyze, getCurriculum } from "./lib/api";
import type { Curriculum, SessionReport } from "./lib/types";

const DEFAULT_SENTENCE = "I think that's the third one.";
const DEFAULT_IPA = "aɪ θ ɪ ŋ k ð æ t s ð ə θ ɝ d w ʌ n";

export default function App() {
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null);
  const [report, setReport] = useState<SessionReport | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [sentence] = useState(DEFAULT_SENTENCE);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  useEffect(() => {
    getCurriculum().then(setCurriculum).catch(() => setCurriculum(null));
  }, []);

  async function onClip(blob: Blob) {
    setBusy(true);
    setErr(null);
    setAudioUrl(URL.createObjectURL(blob));
    try {
      const res = await analyze(blob, sentence, "", "drill");
      setReport(res.report);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  function scrub(startMs: number, endMs: number) {
    if (!audioUrl) return;
    const a = new Audio(audioUrl);
    a.currentTime = startMs / 1000;
    a.play();
    setTimeout(() => a.pause(), endMs - startMs + 120);
  }

  const topErrors = report
    ? [...report.phoneme_errors, ...report.prosody_errors]
        .sort((a, b) => b.severity - a.severity)
        .slice(0, 3)
    : [];

  return (
    <div className="grid h-full grid-cols-1 lg:grid-cols-[240px_1fr_300px]">
      <div className="hidden lg:block">
        <CurriculumRail
          curriculum={curriculum}
          activePhase={1}
          streak={12}
          completedBlocks={1}
        />
      </div>

      {/* drill stage */}
      <main className="flex flex-col gap-6 overflow-y-auto p-6">
        <header>
          <div className="font-mono text-[11px] uppercase tracking-wider text-muted">
            Sentence drill
          </div>
          <h1 className="mt-1 font-display text-2xl font-semibold text-bone">
            "{sentence}"
          </h1>
          <div className="mt-2">
            <PhonemeStrip ipa={DEFAULT_IPA} errors={report?.phoneme_errors ?? []} />
          </div>
        </header>

        <section className="rounded-xl border border-edge bg-panel p-4">
          <PitchRibbon
            pitch={report?.pitch_contour ?? []}
            reference={report?.reference_contour ?? []}
            intensity={report?.intensity_contour ?? []}
            perSyllableDeviation={report?.per_syllable_deviation ?? []}
            words={report?.word_timings ?? []}
            onScrub={scrub}
          />
        </section>

        <section className="flex flex-col items-center gap-3">
          <Recorder onClip={onClip} busy={busy} />
          {err && <p className="text-sm text-signal">{err}</p>}
          <div className="flex gap-4 font-mono text-xs text-muted">
            <button className="hover:text-bone">▸ reference</button>
            <button className="hover:text-bone">▸ slow</button>
          </div>
        </section>

        {topErrors.length > 0 && (
          <section className="flex flex-col gap-3">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-muted">
              Fix these first
            </h2>
            {topErrors.map((e, i) => (
              <ErrorCard key={e.rule_id + i} error={e} rank={i + 1} />
            ))}
          </section>
        )}
      </main>

      <div className="hidden lg:block">
        <LiveAnalysis report={report} />
      </div>
    </div>
  );
}
