import { useRef, useState } from "react";
import { WavRecorder } from "../lib/wav";

interface Props {
  onClip: (blob: Blob) => void;
  busy?: boolean;
}

export function Recorder({ onClip, busy }: Props) {
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const rec = useRef<WavRecorder | null>(null);

  async function toggle() {
    setError(null);
    try {
      if (!recording) {
        rec.current = new WavRecorder();
        await rec.current.start();
        setRecording(true);
      } else {
        setRecording(false);
        const blob = await rec.current!.stop();
        onClip(blob);
      }
    } catch (e) {
      setError((e as Error).message);
      setRecording(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        disabled={busy}
        onClick={toggle}
        className={`flex h-20 w-20 items-center justify-center rounded-full border-2 transition-colors disabled:opacity-40 ${
          recording
            ? "animate-pulse border-signal bg-signal/20"
            : "border-edge bg-panel hover:border-bone"
        }`}
        aria-label={recording ? "Stop recording" : "Start recording"}
      >
        <span
          className={`rounded-full ${
            recording ? "h-6 w-6 rounded bg-signal" : "h-8 w-8 bg-signal"
          }`}
        />
      </button>
      <span className="font-mono text-xs text-muted">
        {busy ? "analysing…" : recording ? "recording — tap to stop" : "tap to record"}
      </span>
      {error && <span className="text-xs text-signal">{error}</span>}
    </div>
  );
}
