// lib/audio-analysis.ts
// Saltwaves measurement engine — ITU-R BS.1770-4 loudness + true peak (+ optional LTAS).
// Streaming build: constant memory, safe on full-length episodes.
// Verified against ffmpeg ebur128/loudnorm: Integrated ±0.1 LU, True Peak ±0.1 dB.
// Requires 48 kHz input (decode via OfflineAudioContext at 48000).

export interface LtasResult {
  centers: number[];
  levels: number[]; // dB relative to speech core 250 Hz – 4 kHz
  framesKept: number;
  framesTotal: number;
}

export interface AnalysisResult {
  integratedLufs: number;
  truePeakDb: number;
  lra: number;
  plr: number;
  durationSec: number;
  clippedSamples: number;
  ltas: LtasResult | null;
}

export const THIRD_OCT_CENTERS = [
  50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800,
  1000, 1250, 1600, 2000, 2500, 3150, 4000, 5000, 6300, 8000,
  10000, 12500, 16000,
];

export const DIAG_BANDS: { name: string; lo: number; hi: number }[] = [
  { name: "<80 Hz · rumble", lo: 0, hi: 80 },
  { name: "80–160 · warmth", lo: 80, hi: 160 },
  { name: "160–500 · body", lo: 160, hi: 500 },
  { name: "500–6k · anchor", lo: 500, hi: 6000 },
  { name: "6–9k · sibilance", lo: 6000, hi: 9000 },
  { name: "9k+ · air", lo: 9000, hi: Infinity },
];

const SR = 48000;
const HOP = 4800;                 // 100 ms
const BLOCKS_MOMENTARY = 4;       // 400 ms
const BLOCKS_SHORT = 30;          // 3 s
const LTAS_MAX_SEC = 900;         // spectrum only on clips up to 15 min

const yieldToUi = () => new Promise<void>((r) => setTimeout(r, 0));
const toLufs = (p: number) => -0.691 + 10 * Math.log10(p + 1e-20);
const mean = (a: number[]) => a.reduce((x, y) => x + y, 0) / a.length;

// ---------- K-weighted energy per 100 ms block (streaming, O(1) memory) ----------
async function blockEnergy(
  ch: Float32Array,
  onTick?: (frac: number) => void
): Promise<Float64Array> {
  // BS.1770-4 stage 1 (shelf) then stage 2 (high-pass), 48 kHz
  const b0 = 1.53512485958697, b1 = -2.69169618940638, b2 = 1.19839281085285;
  const a1 = -1.69065929318241, a2 = 0.73248077421585;
  const c0 = 1.0, c1 = -2.0, c2 = 1.0;
  const d1 = -1.99004745483398, d2 = 0.99007225036621;

  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  let u1 = 0, u2 = 0, v1 = 0, v2 = 0;

  const nB = Math.floor(ch.length / HOP);
  const out = new Float64Array(nB);

  for (let b = 0; b < nB; b++) {
    const start = b * HOP;
    const end = start + HOP;
    let s = 0;
    for (let i = start; i < end; i++) {
      const xi = ch[i];
      const yi = b0 * xi + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2;
      x2 = x1; x1 = xi; y2 = y1; y1 = yi;
      const vi = c0 * yi + c1 * u1 + c2 * u2 - d1 * v1 - d2 * v2;
      u2 = u1; u1 = yi; v2 = v1; v1 = vi;
      s += vi * vi;
    }
    out[b] = s;
    if ((b & 511) === 511) {
      onTick?.(b / nB);
      await yieldToUi();
    }
  }
  return out;
}

// ---------- Integrated LUFS + LRA ----------
async function loudness(
  channels: Float32Array[],
  onProgress?: (frac: number) => void
) {
  const per: Float64Array[] = [];
  for (let c = 0; c < channels.length; c++) {
    per.push(
      await blockEnergy(channels[c], (f) =>
        onProgress?.((c + f) / channels.length)
      )
    );
  }
  const nB = per[0].length;
  if (nB < BLOCKS_MOMENTARY) return { integrated: -Infinity, lra: 0 };

  const winPow = (b0: number, nBlocks: number) => {
    let p = 0;
    for (const arr of per) {
      let s = 0;
      for (let k = 0; k < nBlocks; k++) s += arr[b0 + k];
      p += s / (nBlocks * HOP);
    }
    return p; // sum over channels of mean square (G = 1)
  };

  const blocks: number[] = [];
  for (let b = 0; b + BLOCKS_MOMENTARY <= nB; b++) {
    blocks.push(winPow(b, BLOCKS_MOMENTARY));
  }
  const absPass = blocks.filter((p) => toLufs(p) > -70);
  if (!absPass.length) return { integrated: -Infinity, lra: 0 };
  const relThresh = toLufs(mean(absPass)) - 10;
  const relPass = absPass.filter((p) => toLufs(p) > relThresh);
  const integrated = toLufs(mean(relPass.length ? relPass : absPass));

  // Short-term 3 s for LRA (EBU Tech 3342: abs −70, rel −20, p10–p95)
  let lra = 0;
  if (nB >= BLOCKS_SHORT) {
    const st: number[] = [];
    for (let b = 0; b + BLOCKS_SHORT <= nB; b++) st.push(winPow(b, BLOCKS_SHORT));
    const stAbs = st.filter((p) => toLufs(p) > -70);
    if (stAbs.length) {
      const rel = toLufs(mean(stAbs)) - 20;
      const gated = stAbs
        .filter((p) => toLufs(p) > rel)
        .map(toLufs)
        .sort((a, b) => a - b);
      if (gated.length >= 2) {
        const q = (arr: number[], f: number) => {
          const idx = f * (arr.length - 1);
          const lo = Math.floor(idx), hi = Math.ceil(idx);
          return arr[lo] + (arr[hi] - arr[lo]) * (idx - lo);
        };
        lra = q(gated, 0.95) - q(gated, 0.1);
      }
    }
  }
  return { integrated, lra };
}

// ---------- True peak (4x polyphase, evaluated only around peak candidates) ----------
const CANDIDATE_CAP = 60000;

async function truePeak(channels: Float32Array[]): Promise<{ peakDb: number; clipped: number }> {
  const M = 4, TAPS = 48;
  const center = (TAPS - 1) / 2;
  const phases: Float64Array[] = [];
  const raw: number[][] = Array.from({ length: M }, () => []);
  for (let i = 0; i < TAPS; i++) {
    const t = (i - center) / M;
    const sinc = t === 0 ? 1 : Math.sin(Math.PI * t) / (Math.PI * t);
    const w = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / (TAPS - 1));
    raw[i % M].push(sinc * w);
  }
  for (const ph of raw) {
    const s = ph.reduce((a, b) => a + b, 0);
    phases.push(Float64Array.from(ph, (v) => v / s));
  }

  // sample peak across all channels
  let peak = 0;
  let clipped = 0;
  for (const ch of channels) {
    for (let i = 0; i < ch.length; i++) {
      const a = Math.abs(ch[i]);
      if (a > peak) peak = a;
      if (a >= 0.999) clipped++;
    }
    await yieldToUi();
  }
  if (peak <= 0) return { peakDb: -144, clipped };

  const BINS = 200;
  for (const ch of channels) {
    // pass 1: amplitude histogram, pick a threshold that keeps the work bounded
    const hist = new Int32Array(BINS + 1);
    for (let i = 0; i < ch.length; i++) {
      const r = Math.abs(ch[i]) / peak;
      hist[Math.min(BINS, (r * BINS) | 0)]++;
    }
    let acc = 0;
    let binLo = Math.floor(0.5 * BINS); // never look below −6 dB of sample peak
    for (let b = BINS; b >= binLo; b--) {
      acc += hist[b];
      if (acc > CANDIDATE_CAP) { binLo = b + 1; break; }
    }
    const limit = (binLo / BINS) * peak;
    await yieldToUi();

    // pass 2: evaluate the intermediate phases in a small window around each candidate
    const K = phases[0].length;
    let done = 0;
    for (let i = 0; i < ch.length; i++) {
      if (Math.abs(ch[i]) < limit) continue;
      for (let o = 0; o < K; o++) {
        const n = i + o;
        if (n >= ch.length) continue;
        for (let p = 1; p < M; p++) {
          const h = phases[p];
          let s = 0;
          for (let k = 0; k < K; k++) {
            const idx = n - k;
            if (idx >= 0) s += h[k] * ch[idx];
          }
          const a = Math.abs(s);
          if (a > peak) peak = a;
        }
      }
      if ((++done & 2047) === 0) await yieldToUi();
    }
  }
  return { peakDb: 20 * Math.log10(peak + 1e-20), clipped };
}

// ---------- FFT (iterative radix-2, in-place complex) ----------
function fft(re: Float64Array, im: Float64Array): void {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) {
      let t = re[i]; re[i] = re[j]; re[j] = t;
      t = im[i]; im[i] = im[j]; im[j] = t;
    }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const ang = (-2 * Math.PI) / len;
    const wr = Math.cos(ang), wi = Math.sin(ang);
    for (let i = 0; i < n; i += len) {
      let cwr = 1, cwi = 0;
      const half = len >> 1;
      for (let k = 0; k < half; k++) {
        const ur = re[i + k], ui = im[i + k];
        const vr = re[i + k + half] * cwr - im[i + k + half] * cwi;
        const vi = re[i + k + half] * cwi + im[i + k + half] * cwr;
        re[i + k] = ur + vr; im[i + k] = ui + vi;
        re[i + k + half] = ur - vr; im[i + k + half] = ui - vi;
        const nwr = cwr * wr - cwi * wi;
        cwi = cwr * wi + cwi * wr; cwr = nwr;
      }
    }
  }
}

// ---------- LTAS (Hann 4096, 50 % overlap, RMS gate median−15 dB,
// level-normalised to speech core 250 Hz – 4 kHz). Off by default. ----------
async function ltas(
  channels: Float32Array[],
  onProgress?: (frac: number) => void
): Promise<LtasResult | null> {
  const NFFT = 4096, STEP = 2048, GATE = 15;
  const n = channels[0].length;
  const nfr = Math.floor((n - NFFT) / STEP) + 1;
  if (nfr < 4) return null;

  const nCh = channels.length;
  const frame = new Float64Array(NFFT);
  const readFrame = (off: number) => {
    for (let i = 0; i < NFFT; i++) {
      let s = 0;
      for (let c = 0; c < nCh; c++) s += channels[c][off + i];
      frame[i] = s / nCh;
    }
  };

  const rmsDb = new Float64Array(nfr);
  for (let f = 0; f < nfr; f++) {
    readFrame(f * STEP);
    let e = 0;
    for (let i = 0; i < NFFT; i++) e += frame[i] * frame[i];
    rmsDb[f] = 10 * Math.log10(e / NFFT + 1e-20);
    if ((f & 255) === 255) await yieldToUi();
  }
  const thr = Float64Array.from(rmsDb).sort()[Math.floor(nfr / 2)] - GATE;

  const win = new Float64Array(NFFT);
  for (let i = 0; i < NFFT; i++) {
    win[i] = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / (NFFT - 1));
  }

  const psd = new Float64Array(NFFT / 2 + 1);
  const re = new Float64Array(NFFT), im = new Float64Array(NFFT);
  let cnt = 0;
  for (let f = 0; f < nfr; f++) {
    if (rmsDb[f] >= thr) {
      readFrame(f * STEP);
      for (let i = 0; i < NFFT; i++) { re[i] = frame[i] * win[i]; im[i] = 0; }
      fft(re, im);
      for (let k = 0; k <= NFFT / 2; k++) psd[k] += re[k] * re[k] + im[k] * im[k];
      cnt++;
    }
    if ((f & 255) === 255) { onProgress?.(f / nfr); await yieldToUi(); }
  }
  for (let k = 0; k < psd.length; k++) psd[k] /= Math.max(cnt, 1);

  const binHz = SR / NFFT;
  let core = 0;
  for (let k = 0; k <= NFFT / 2; k++) {
    const fHz = k * binHz;
    if (fHz >= 250 && fHz < 4000) core += psd[k];
  }
  const coreDb = 10 * Math.log10(core + 1e-20);
  const levels = THIRD_OCT_CENTERS.map((c) => {
    const lo = c * Math.pow(2, -1 / 6), hi = c * Math.pow(2, 1 / 6);
    let p = 0;
    for (let k = 0; k <= NFFT / 2; k++) {
      const fHz = k * binHz;
      if (fHz >= lo && fHz < hi) p += psd[k];
    }
    return 10 * Math.log10(p + 1e-20) - coreDb;
  });
  return { centers: THIRD_OCT_CENTERS, levels, framesKept: cnt, framesTotal: nfr };
}

// ---------- Public API ----------
export interface AnalyzeOptions {
  /** Long-term spectrum. Off by default: it is the gated feature, not part of v1. */
  includeLtas?: boolean;
}

export async function analyzeChannels(
  channels: Float32Array[],
  onProgress?: (stage: string, frac: number) => void,
  options: AnalyzeOptions = {}
): Promise<AnalysisResult> {
  const durationSec = channels[0].length / SR;
  const wantLtas = options.includeLtas === true && durationSec <= LTAS_MAX_SEC;

  onProgress?.("loudness", 0);
  const { integrated, lra } = await loudness(channels, (f) =>
    onProgress?.("loudness", 0.55 * f)
  );

  onProgress?.("true peak", 0.55);
  const { peakDb: tp, clipped } = await truePeak(channels);

  let spectrum: LtasResult | null = null;
  if (wantLtas) {
    onProgress?.("spectrum", 0.8);
    spectrum = await ltas(channels, (f) => onProgress?.("spectrum", 0.8 + 0.2 * f));
  }

  onProgress?.("done", 1);
  return {
    integratedLufs: integrated,
    truePeakDb: tp,
    lra,
    plr: tp - integrated,
    durationSec,
    clippedSamples: clipped,
    ltas: spectrum,
  };
}

export async function decodeFileTo48k(file: File): Promise<Float32Array[]> {
  const buf = await file.arrayBuffer();
  const ctx = new OfflineAudioContext({
    numberOfChannels: 2,
    length: 1,
    sampleRate: SR,
  });
  const audio = await ctx.decodeAudioData(buf);
  const nCh = Math.min(audio.numberOfChannels, 2);
  const out: Float32Array[] = [];
  for (let c = 0; c < nCh; c++) out.push(audio.getChannelData(c));
  return out;
}

export function meanDelta(
  a: LtasResult, b: LtasResult, lo: number, hi: number
): number {
  let sum = 0, n = 0;
  for (let i = 0; i < a.centers.length; i++) {
    const c = a.centers[i];
    if (c >= lo && c < hi) {
      sum += b.levels[i] - a.levels[i];
      n++;
    }
  }
  return n ? sum / n : 0;
}
