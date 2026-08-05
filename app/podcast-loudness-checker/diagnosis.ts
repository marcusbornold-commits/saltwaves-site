// app/podcast-loudness-checker/diagnosis.ts
// The judgment layer. Numbers come from the measurement engine; this file
// decides what they mean and what to change. Max three diagnoses, ranked by
// what actually costs the listener the most.

import type { AnalysisResult } from "@/lib/audio-analysis";

export interface Platform {
  id: string;
  label: string;
  lufs: string;
  dbtp: string;
  target: number;
  ceiling: number;
  tolerance: number;
}

export const PLATFORMS: Platform[] = [
  {
    id: "apple",
    label: "Apple Podcasts",
    lufs: "−16 LUFS",
    dbtp: "−1 dBTP",
    target: -16,
    ceiling: -1,
    tolerance: 1,
  },
  {
    id: "spotify",
    label: "Spotify",
    lufs: "−14 LUFS",
    dbtp: "−1 dBTP",
    target: -14,
    ceiling: -1,
    tolerance: 1,
  },
  {
    id: "youtube",
    label: "YouTube",
    lufs: "−14 LUFS",
    dbtp: "−1 dBTP",
    target: -14,
    ceiling: -1,
    tolerance: 1,
  },
  {
    id: "audiobook",
    label: "Audiobook catalogue",
    lufs: "−18 LUFS",
    dbtp: "−3 dBTP",
    target: -18,
    ceiling: -3,
    tolerance: 1,
  },
  {
    id: "broadcast",
    label: "Broadcast (ATSC A/85)",
    lufs: "−24 LKFS",
    dbtp: "−2 dBTP",
    target: -24,
    ceiling: -2,
    tolerance: 2,
  },
];

export interface Verdict {
  pass: boolean;
  headline: string;
  detail: string;
}

export interface Diagnosis {
  id: string;
  title: string;
  body: string;
  fix: string;
  weight: number;
}

export function verdictFor(r: AnalysisResult, p: Platform): Verdict {
  const delta = r.integratedLufs - p.target;
  const loudOk = Math.abs(delta) <= p.tolerance;
  const peakOk = r.truePeakDb <= p.ceiling;

  if (loudOk && peakOk) {
    return {
      pass: true,
      headline: `Ready for ${p.label}.`,
      detail:
        `Integrated loudness sits within ${p.tolerance.toFixed(0)} LU of the ` +
        `target and true peaks stay under the ceiling. Nothing here needs ` +
        `fixing before you publish.`,
    };
  }

  if (!peakOk && !loudOk) {
    return {
      pass: false,
      headline: `Not ready for ${p.label}.`,
      detail:
        `Loudness sits ${Math.abs(delta).toFixed(1)} LU ` +
        `${delta > 0 ? "above" : "below"} target and true peaks reach ` +
        `${r.truePeakDb.toFixed(1)} dBTP against a ` +
        `${p.ceiling.toFixed(1)} dBTP ceiling. Fix the peaks first — level ` +
        `is a knob, clipping is damage.`,
    };
  }

  if (!peakOk) {
    return {
      pass: false,
      headline: "Loudness is fine. Peaks are not.",
      detail:
        `True peak measures ${r.truePeakDb.toFixed(1)} dBTP against a ` +
        `${p.ceiling.toFixed(1)} dBTP ceiling. The level is right, so this is ` +
        `a limiter setting, not a mix problem.`,
    };
  }

  return {
    pass: false,
    headline:
      delta > 0
        ? `Too loud for ${p.label} by ${Math.abs(delta).toFixed(1)} LU.`
        : `Too quiet for ${p.label} by ${Math.abs(delta).toFixed(1)} LU.`,
    detail:
      delta > 0
        ? `The platform will turn this down on playback. Whatever compression ` +
          `got you here stays audible; the loudness it bought you does not.`
        : `Listeners will reach for the volume, and everything under your ` +
          `voice comes up with it — room tone, breaths, preamp hiss.`,
  };
}

export function buildDiagnoses(r: AnalysisResult, p: Platform): Diagnosis[] {
  const out: Diagnosis[] = [];
  const delta = r.integratedLufs - p.target;
  const overPeak = r.truePeakDb - p.ceiling;

  if (r.clippedSamples > 20) {
    out.push({
      id: "clipped",
      title: `${r.clippedSamples.toLocaleString()} samples are sitting at full scale`,
      body:
        `The waveform is flat-topped, which means the file was already ` +
        `pushed past the ceiling before it got here. Browsers cut ` +
        `compressed audio off at zero when decoding, so the real peak may ` +
        `be higher than the number above — the level that would tell you ` +
        `how much higher is already gone from the file.`,
      fix: `Go back to the source and re-export with the limiter ceiling at ${p.ceiling.toFixed(1)} dBTP. Turning the finished file down will not undo this; the flattened peaks stay flattened.`,
      weight: 120,
    });
  }

  if (overPeak > 0) {
    out.push({
      id: "truepeak",
      title: `True peak is ${overPeak.toFixed(1)} dB over the ceiling`,
      body:
        `Your file measures ${r.truePeakDb.toFixed(1)} dBTP. Sample peak meters ` +
        `do not show this — the extra level appears between samples, when the ` +
        `player reconstructs the waveform. It becomes real, audible distortion ` +
        `after the platform encodes to AAC or MP3, so it can sound clean on ` +
        `your machine and crackle on a phone.`,
      fix: `Set your limiter to true peak mode with a ceiling at ${p.ceiling.toFixed(1)} dBTP or lower, then re-export. Do not simply turn the file down — that leaves the clipping in place.`,
      weight: 100,
    });
  }

  if (delta > p.tolerance) {
    out.push({
      id: "hot",
      title: `Running ${delta.toFixed(1)} LU hot for ${p.label}`,
      body:
        `${p.label} normalizes playback toward ${p.target} LUFS, so this ` +
        `episode gets turned down on the way to the listener. The compression ` +
        `and limiting used to reach this level stay in the audio; only the ` +
        `loudness disappears. You paid for it twice and kept neither half.`,
      fix: `Back off the output stage by ${delta.toFixed(1)} dB rather than compressing less mid-chain, then re-check. Aim for the target, not above it.`,
      weight: 80,
    });
  }

  if (delta < -p.tolerance) {
    out.push({
      id: "quiet",
      title: `Sitting ${Math.abs(delta).toFixed(1)} LU under target`,
      body:
        `Quiet is not automatically safe. Listeners compensate with the volume ` +
        `control, which lifts the noise floor, breaths and room tone along with ` +
        `the voice. On earbuds in traffic that is the difference between an ` +
        `episode people finish and one they abandon.`,
      fix: `Raise the integrated level toward ${p.target} LUFS with a gain stage before the limiter, and confirm true peak still lands under ${p.ceiling.toFixed(1)} dBTP.`,
      weight: 75,
    });
  }

  if (r.lra > 0 && r.lra < 4) {
    out.push({
      id: "flat",
      title: `Loudness range is ${r.lra.toFixed(1)} LU — very compressed`,
      body:
        `Spoken word usually lives around 5 to 11 LU. Below four, the dynamics ` +
        `have been squeezed hard enough that the quiet things stop being quiet: ` +
        `breaths, mouth noise and room tone rise to sit level with the words. ` +
        `It reads as fatigue over forty minutes rather than as a fault.`,
      fix: `Reduce compression ratio or raise the threshold before adding makeup gain. If a noise gate is doing the cleanup, that work belongs upstream of the compressor.`,
      weight: 60,
    });
  }

  if (r.lra > 14) {
    out.push({
      id: "wide",
      title: `Loudness range is ${r.lra.toFixed(1)} LU — very wide`,
      body:
        `That much movement suits film, not headphones on a commute. The quiet ` +
        `passages fall under road noise and the loud ones startle, which sends ` +
        `the listener to the volume control repeatedly. Wide range is a mixing ` +
        `virtue and a delivery liability.`,
      fix: `Gentle levelling before the limiter — slow compression at a low ratio, or clip gain on the loudest passages — usually brings this into range without flattening the voice.`,
      weight: 55,
    });
  }

  if (r.plr < 6 && overPeak <= 0) {
    out.push({
      id: "plr",
      title: `Only ${r.plr.toFixed(1)} dB between average and peak`,
      body:
        `Peak to loudness ratio this low means the limiter is doing continuous ` +
        `work rather than catching occasional transients. Consonants lose their ` +
        `edge and the voice starts sounding pinched, which is the sound people ` +
        `describe as "processed" without being able to name it.`,
      fix: `Lower the input into the limiter until gain reduction is intermittent, then make up the level after it rather than before.`,
      weight: 50,
    });
  }

  if (r.durationSec < 30) {
    out.push({
      id: "short",
      title: "Short file — read the numbers with care",
      body:
        `Under thirty seconds there is not enough material for the gating in ` +
        `the standard to settle, and loudness range in particular becomes ` +
        `unreliable. The measurements are correct for what was measured; they ` +
        `just may not represent a full episode.`,
      fix: `Run a full episode, or at minimum a few minutes of continuous speech, before acting on these numbers.`,
      weight: 40,
    });
  }

  return out.sort((a, b) => b.weight - a.weight).slice(0, 3);
}
