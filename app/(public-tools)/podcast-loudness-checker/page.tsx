import type { Metadata } from "next";
import Link from "next/link";

import SignupForm from "../components/signup-form";
import LoudnessInspector from "./loudness-inspector";

export const metadata: Metadata = {
  alternates: { canonical: "/podcast-loudness-checker" },
  title: "Podcast Loudness Checker — Free LUFS & True Peak Analysis | Saltwaves",
  description:
    "Measure integrated loudness and true peak against selected podcast and broadcast targets. Free audio analysis in your browser; not a complete delivery compliance check.",
};

const platformTargets = [
  { platform: "Apple Podcasts recommendation", loudness: "−16 LKFS ±1", truePeak: "≤ −1 dBTP" },
  { platform: "Spotify music — Normal playback setting", loudness: "−14 LUFS", truePeak: "Delivery advice: below −1 dBTP; below −2 if louder than −14 LUFS" },
  { platform: "ACX audiobook submission", loudness: "−23 to −18 dB RMS (not LUFS)", truePeak: "Peak level ≤ −3 dBFS (ACX peak requirement)" },
];

const faqItems = [
  {
    question: "What LUFS should my podcast be?",
    answer:
      "For a stereo podcast, −16 LUFS integrated with true peaks no higher than −1 dBTP is a useful reference aligned with Apple's recommendation. Check your destination's delivery requirements; playback behaviour varies by platform and settings.",
  },
  {
    question: "Is −14 LUFS too loud for a podcast?",
    answer:
      "−14 LUFS is louder than Apple's recommended −16 ±1 range. It is not automatically distorted or unsuitable for every destination. Choose the delivery target first and avoid unnecessary compression just to reach a number.",
  },
  {
    question: "What is true peak and why does it matter?",
    answer:
      "True peak measures the reconstructed analog waveform, including peaks that occur between samples. Episodes that exceed −1 dBTP risk audible clipping after the lossy encoding platforms apply.",
  },
  {
    question: "Does this tool upload my audio?",
    answer:
      "No. Analysis runs entirely in your browser. Your file never leaves your machine.",
  },
];

export default function PodcastLoudnessCheckerPage() {
  return (
    <main className="bg-[#1a1a1a] text-[#f1ede8]">
      <section className="px-6 pb-16 pt-24 sm:px-10 sm:pt-28 lg:px-20">
        <div className="mx-auto max-w-5xl">
          <p className="font-[family-name:var(--font-archivo)] text-lg uppercase tracking-[0.04em] text-[#ff6200] sm:text-xl">
            SALTWAVES.STUDIO
          </p>
          <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Podcast Loudness Checker
          </h1>
          <p className="mt-6 max-w-2xl text-xl leading-relaxed text-[#f1ede8]/80 sm:text-2xl">
            Built on 20 years of broadcast audio judgment, not a generic meter.
          </p>
        </div>
      </section>

      <section className="border-t border-white/10 px-6 pb-20 sm:px-10 lg:px-20">
        <div className="mx-auto max-w-5xl">
          <LoudnessInspector />

          <div className="mt-10 border border-[#f1ede8]/12 bg-[#222018] p-8 sm:p-10">
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Get the one-page spec sheet
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#f1ede8]/75">
              Every platform target on a single page, plus a note when the next
              Saltwaves tool goes live. No newsletter, no schedule.
            </p>
            <SignupForm
              submitLabel="Send me the spec sheet"
              submittingLabel="Sending..."
            />
          </div>
        </div>
      </section>

      <section className="px-6 pb-20 sm:px-10 lg:px-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Platform targets
          </h2>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-left text-sm sm:text-base">
              <thead>
                <tr className="bg-[#0a0a0a] text-[#f1ede8]">
                  <th className="border border-[#f1ede8]/15 px-4 py-3 font-semibold uppercase tracking-[0.08em]">
                    Platform
                  </th>
                  <th className="border border-[#f1ede8]/15 px-4 py-3 font-semibold uppercase tracking-[0.08em]">
                    Loudness target
                  </th>
                  <th className="border border-[#f1ede8]/15 px-4 py-3 font-semibold uppercase tracking-[0.08em]">
                    Peak limit / guidance
                  </th>
                </tr>
              </thead>
              <tbody>
                {platformTargets.map((row) => (
                  <tr key={row.platform} className="bg-[#222018]">
                    <td className="border border-[#f1ede8]/10 px-4 py-3">
                      {row.platform}
                    </td>
                    <td className="border border-[#f1ede8]/10 px-4 py-3">
                      {row.loudness}
                    </td>
                    <td className="border border-[#f1ede8]/10 px-4 py-3">
                      {row.truePeak}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-[#f1ede8]/60">
            LUFS and LKFS are the same measurement (ITU-R BS.1770) under two names.
          </p>
          <p className="mt-2 text-sm text-[#f1ede8]/60">
            RMS is a different measurement. The Audiobook catalogue preset
            uses a LUFS target and does not certify ACX compliance. ACX also has
            requirements for noise, encoding and other aspects of the file.
            Sources checked 15 September 2026: {" "}
            <a href="https://podcasters.apple.com/support/893-audio-requirements">Apple Podcasts</a>, {" "}
            <a href="https://support.spotify.com/us/artists/article/loudness-normalization/">Spotify music normalization</a>, {" "}
            <a href="https://help.acx.com/s/article/what-are-the-acx-audio-submission-requirements">ACX submission requirements</a>.
          </p>
        </div>
      </section>

      <section className="px-6 pb-20 sm:px-10 lg:px-20">
        <div className="blog-content mx-auto max-w-3xl">
          <h2>Choose a delivery target before adjusting levels</h2>
          <p>
            Integrated loudness describes the overall programme level. True peak
            estimates peaks in the reconstructed waveform, including peaks between
            samples. Measure both, then listen for uneven speakers, distortion and
            distracting noise. Passing two measurements does not guarantee that a
            recording sounds good or meets every requirement of a distributor.
          </p>
          <h2>A useful podcast reference</h2>
          <p>
            Apple recommends approximately −16 LKFS with a tolerance of ±1 dB and
            true peaks no higher than −1 dBFS. LUFS and LKFS use the same loudness
            scale. Our Podcast preset uses −16 LUFS and a −1 dBTP ceiling.
          </p>
          <p>
            Spotify&apos;s −14 LUFS documentation describes music normalization and
            includes exceptions for players and listening settings. It is not a
            universal podcast submission requirement. Do not assume that every
            platform will raise a quiet episode or turn down a loud one in the same way.
          </p>
          <h2>Need to change what you measured?</h2>
          <p>
            Explore <Link href="/podcast-mastering" className="text-[#ff6200] underline">podcast mastering</Link> for a finished spoken-word file,
            or <Link href="/podcast-audio-cleanup" className="text-[#ff6200] underline">podcast audio cleanup</Link> if noise and room sound are the first problem to solve.
          </p>
          <h2>Use the result as a level check</h2>
          <p>
            Browser measurements help you compare files with the selected target.
            Audiobook catalogue and broadcast presets are reference settings;
            confirm the specification supplied by your distributor. An ACX submission
            needs an RMS check and other checks this tool does not provide.
          </p>
          <p>
            <Link href="/podmaster" className="text-[#ff6200] underline">PodMaster</Link>{" "}
            cleans and masters spoken-word recordings. Listen to the delivered file
            and check its measurements against your destination before publication.
          </p>
          <p>
            For the full walkthrough of targets and how to hit them in your own chain,
            read our guide:{" "}
            <Link
              href="/blog/how-loud-should-a-podcast-be-lufs-guide"
              className="text-[#ff6200] underline decoration-[#ff6200]/40 underline-offset-4 transition-opacity hover:opacity-75"
            >
              How loud should a podcast be?
            </Link>
          </p>
        </div>
      </section>

      <section className="border-t border-white/10 px-6 pb-24 sm:px-10 lg:px-20">
        <div className="mx-auto max-w-3xl pt-16">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">FAQ</h2>
          <dl className="mt-10 space-y-8">
            {faqItems.map((item) => (
              <div key={item.question}>
                <dt className="text-xl font-semibold text-[#f1ede8]">
                  {item.question}
                </dt>
                <dd className="mt-3 text-lg leading-relaxed text-[#f1ede8]/80">
                  {item.answer}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </main>
  );
}
