/**
 * Record microphone audio and encode to 16kHz mono 16-bit PCM WAV in the
 * browser. MediaRecorder output format is inconsistent across browsers, so we
 * capture raw samples via an AudioContext + ScriptProcessor-free approach
 * (AudioWorklet-lite: we pull from a MediaStreamSource into an offline buffer)
 * and encode the WAV ourselves. This guarantees the backend always receives the
 * 16kHz mono WAV the pipeline expects.
 */

export class WavRecorder {
  private ctx?: AudioContext;
  private stream?: MediaStream;
  private processor?: ScriptProcessorNode;
  private source?: MediaStreamAudioSourceNode;
  private chunks: Float32Array[] = [];
  private inputSampleRate = 48000;
  recording = false;

  async start(): Promise<void> {
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.ctx = new AudioContext();
    this.inputSampleRate = this.ctx.sampleRate;
    this.source = this.ctx.createMediaStreamSource(this.stream);
    // ScriptProcessor is deprecated but universally available and fine for a
    // local single-user tool. Buffer size 4096.
    this.processor = this.ctx.createScriptProcessor(4096, 1, 1);
    this.chunks = [];
    this.processor.onaudioprocess = (e) => {
      const data = e.inputBuffer.getChannelData(0);
      this.chunks.push(new Float32Array(data));
    };
    this.source.connect(this.processor);
    this.processor.connect(this.ctx.destination);
    this.recording = true;
  }

  async stop(): Promise<Blob> {
    this.recording = false;
    this.processor?.disconnect();
    this.source?.disconnect();
    this.stream?.getTracks().forEach((t) => t.stop());
    await this.ctx?.close();

    const merged = mergeChunks(this.chunks);
    const down = downsample(merged, this.inputSampleRate, 16000);
    return encodeWav(down, 16000);
  }
}

function mergeChunks(chunks: Float32Array[]): Float32Array {
  const len = chunks.reduce((a, c) => a + c.length, 0);
  const out = new Float32Array(len);
  let off = 0;
  for (const c of chunks) {
    out.set(c, off);
    off += c.length;
  }
  return out;
}

function downsample(buf: Float32Array, from: number, to: number): Float32Array {
  if (to >= from) return buf;
  const ratio = from / to;
  const outLen = Math.round(buf.length / ratio);
  const out = new Float32Array(outLen);
  for (let i = 0; i < outLen; i++) {
    const start = Math.floor(i * ratio);
    const end = Math.floor((i + 1) * ratio);
    let sum = 0;
    let count = 0;
    for (let j = start; j < end && j < buf.length; j++) {
      sum += buf[j];
      count++;
    }
    out[i] = count ? sum / count : buf[start] ?? 0;
  }
  return out;
}

function encodeWav(samples: Float32Array, sampleRate: number): Blob {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);
  const writeStr = (off: number, s: string) => {
    for (let i = 0; i < s.length; i++) view.setUint8(off + i, s.charCodeAt(i));
  };
  writeStr(0, "RIFF");
  view.setUint32(4, 36 + samples.length * 2, true);
  writeStr(8, "WAVE");
  writeStr(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeStr(36, "data");
  view.setUint32(40, samples.length * 2, true);
  let off = 44;
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(off, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    off += 2;
  }
  return new Blob([view], { type: "audio/wav" });
}
