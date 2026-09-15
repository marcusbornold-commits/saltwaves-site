// app/podcast-loudness-checker/diagnosis.ts
// The judgment layer. Numbers come from the measurement engine; this file
// decides what they mean and what to change. Max three diagnoses, ranked by
// what actually costs the listener the most.

import type { AnalysisResult } from "@/lib/inspector-audio-analysis";

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
    id: "podcast",
    label: "Podcast",
    lufs: "−16 LUFS",
    dbtp: "−1 dBTP",
    target: -16,
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
    id: "broadcast_eu",
    label: "Broadcast playout (EU)",
    lufs: "−23 LUFS",
    dbtp: "−1 dBTP",
    target: -23,
    ceiling: -1,
    tolerance: 1,
  },
  {
    id: "broadcast_us",
    label: "Broadcast playout (US)",
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
  if (!isFinite(r.integratedLufs)) {
    return {
      pass: false,
      headline: "No measurable audio in this file.",
      detail:
        "Every part of the file sits below the gate the standard uses, so " +
        "there is nothing to measure. That usually means silence, a muted " +
        "track, or an export that did not capture the audio.",
    };
  }
  const delta = r.integratedLufs - p.target;
  const loudOk = Math.abs(delta) <= p.tolerance;
  const peakOk = r.truePeakDb <= p.ceiling;

  if (loudOk && peakOk) {
    return {
      pass: true,
      headline: "Within the selected level targets.",
      detail:
        `Integrated loudness sits within ${p.tolerance.toFixed(0)} LU of the ` +
        `target and true peaks do not exceed the ceiling. This is a level check, ` +
        `not a full delivery-specification or listening check.`,
    };
  }

  if (!peakOk && !loudOk) {
    return {
      pass: false,
      headline: "Not ready to publish.",
      detail:
        `This is ${Math.abs(delta).toFixed(1)} LU too ${delta > 0 ? "loud" : "quiet"}, and true peaks reach ` +
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
        ? `Too loud by ${Math.abs(delta).toFixed(1)} LU.`
        : `Too quiet by ${Math.abs(delta).toFixed(1)} LU.`,
    detail:
      delta > 0
        ? `This exceeds the selected loudness target. Reduce the output level ` +
          `and listen for distortion or excessive compression before exporting again.`
        : `Listeners will reach for the volume, and everything under your ` +
          `voice comes up with it — room tone, breaths, preamp hiss.`,
  };
}

export function buildDiagnoses(r: AnalysisResult, p: Platform): Diagnosis[] {
  if (!isFinite(r.integratedLufs)) {
    return [
      {
        id: "silent",
        title: "The file is silent, or close enough to it",
        body:
          "Loudness, loudness range and peak to loudness all need audible " +
          "material to mean anything, so they are left blank rather than " +
          "shown as zero.",
        fix: "Check that the right track was exported and that nothing was muted or soloed at the time.",
        weight: 200,
      },
    ];
  }
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
        `player reconstructs the waveform. It can cause distortion ` +
        `in some later conversions or encodings. Check the exported format ` +
        `and listen for clipping as well as measuring it.`,
      fix: `Set your limiter to true peak mode with a ceiling at ${p.ceiling.toFixed(1)} dBTP or lower, then re-export. Reducing gain can fix an excessive level; it cannot repair distortion already present in the source.`,
      weight: 100,
    });
  }

  if (delta > p.tolerance) {
    out.push({
      id: "hot",
      title: `Running ${delta.toFixed(1)} LU hot for ${p.label}`,
      body:
        `The selected ${p.label} reference is ${p.target} LUFS. This file exceeds ` +
        `that target. Playback normalization varies by destination; use the ` +
        `delivery specification and listen for excessive compression.`,
      fix: `Back off the output stage by ${delta.toFixed(1)} dB rather than compressing less mid-chain, then re-check. Aim for the target, not above it.`,
      weight: 80,
    });
  }

  if (delta < -p.tolerance) {
    out.push({
      id: "quiet",
      title: `This is ${Math.abs(delta).toFixed(1)} LU too quiet`,
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

  if (r.lra > 8) {
    out.push({
      id: "wide",
      title: `Loudness range is ${r.lra.toFixed(1)} LU — wide for spoken word`,
      body:
        `Around 5 LU is the comfortable target for a podcast. Above that, the ` +
        `usual cause is two voices sitting at different levels rather than ` +
        `deliberate dynamics, and the result is an episode that works at a ` +
        `desk and falls apart in a car.`,
      fix: `Match the voices to each other before the limiter rather than compressing the mix harder afterwards.`,
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
