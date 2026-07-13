import type { Metadata } from "next";
import Link from "next/link";

import SignupForm from "../components/signup-form";

export const metadata: Metadata = {
  title: "Podcast Loudness Checker — Free LUFS & True Peak Analysis | Saltwaves",
  description:
    "Check your podcast's loudness against Apple, Spotify and YouTube specs. Built on 20 years of broadcast audio judgment — diagnosis, not just numbers. Free, runs in your browser.",
};

const platformTargets = [
  {
    platform: "Apple Podcasts",
    loudness: "−16 LUFS",
    truePeak: "−1 dBTP",
  },
  {
    platform: "Spotify",
    loudness: "−14 LUFS",
    truePeak: "−1 dBTP (−2 dBTP if loud)",
  },
  {
    platform: "YouTube",
    loudness: "−14 LUFS",
    truePeak: "−1 dBTP",
  },
  {
    platform: "Broadcast TV (ATSC A/85)",
    loudness: "−24 LKFS",
    truePeak: "−2 dBTP",
  },
];

const faqItems = [
  {
    question: "What LUFS should my podcast be?",
    answer:
      "−16 LUFS integrated for stereo spoken word, with true peaks no higher than −1 dBTP. This satisfies Apple's guideline directly, and Spotify and YouTube normalize it cleanly toward their −14 targets.",
  },
  {
    question: "Is −14 LUFS too loud for a podcast?",
    answer:
      "For music, no. For speech, usually — holding speech at −14 LUFS requires compression that most voices don't wear well. −16 LUFS is the spoken-word standard for a reason.",
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
          <div className="border border-[#ff6200]/25 bg-[#222018] p-8 sm:p-10">
            <h2 className="text-2xl font-semibold tracking-tight text-[#ff6200] sm:text-3xl">
              The analyzer launches in August.
            </h2>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-[#f1ede8]/85">
              Drop in your episode and get Integrated LUFS, True Peak, and dynamic
              range — measured locally in your browser, nothing uploaded. But numbers
              alone don&apos;t tell you what&apos;s wrong. This tool reads them the way a
              broadcast engineer would: what the problem is, why it matters, and what
              it sounds like to your listeners.
            </p>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-[#f1ede8]/75">
              Get the one-page podcast loudness spec sheet — every platform target on
              a single page, plus a note when the analyzer goes live.
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
                    True peak ceiling
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
        </div>
      </section>

      <section className="px-6 pb-20 sm:px-10 lg:px-20">
        <div className="blog-content mx-auto max-w-3xl">
          <h2>Why podcast loudness matters more than you think</h2>
          <p>
            Every major platform measures the loudness of your episode and normalizes
            playback toward its own target. If your episode comes in hot, it gets
            turned down — and any limiting you used to get there stays baked in as
            distortion, now without the loudness payoff. If it comes in low, listeners
            reach for the volume knob, and everything you didn&apos;t want them to hear —
            room tone, breaths, preamp hiss — comes up with your voice.
          </p>
          <p>
            The result is the same in both directions: your episode sounds different
            from the one that played before it, and different from the one that plays
            after. Listeners don&apos;t diagnose that as a loudness problem. They just
            register it as &quot;this show sounds off.&quot;
          </p>

          <h2>Why −16 LUFS, not −14</h2>
          <p>
            Spotify and YouTube both normalize toward −14 LUFS, so −14 looks like the
            obvious target. It isn&apos;t — and the reason is spoken word.
          </p>
          <p>
            The widely cited Apple Podcasts guideline is −16 LUFS for stereo.
            That&apos;s not Apple being conservative; it reflects how speech behaves. Music
            at −14 LUFS is dense — the energy fills the spectrum continuously. Speech
            at −14 LUFS has to be compressed noticeably harder to hold that level
            through pauses and phrasing, and that&apos;s exactly when voices start sounding
            pinched and fatiguing on earbuds.
          </p>
          <p>
            Master spoken word at −16 LUFS and every platform handles it gracefully:
            Apple plays it as intended, and Spotify&apos;s normalization brings quieter
            content up toward −14 on platforms that want it louder. You lose nothing
            and keep the natural dynamics that make a voice pleasant for forty minutes,
            not just forty seconds.
          </p>

          <h2>True peak: the −1 dBTP rule</h2>
          <p>
            Your DAW&apos;s peak meter reads the samples. Your listener&apos;s phone plays a
            reconstructed waveform — and between two samples, that waveform can swing
            higher than either of them. These inter-sample peaks are invisible on a
            sample-peak meter and become real, audible clipping after the AAC or MP3
            encode every platform applies.
          </p>
          <p>
            That&apos;s why the spec is −1 dBTP (decibels True Peak), not −1 dBFS. A
            limiter with true-peak detection set to −1.0 or lower leaves the codec
            room to work. If your episode measures above −1 dBTP, it may sound clean
            on your machine and crackle on your audience&apos;s.
          </p>

          <h2>Loudness range: dynamics are a delivery decision</h2>
          <p>
            Integrated LUFS tells you how loud the episode is overall. LRA (loudness
            range) tells you how much it moves. For spoken word, roughly 5–11 LU is
            the comfortable zone: enough movement that a voice sounds like a person,
            not so much that a listener in a car keeps riding the volume.
          </p>
          <p>
            Below that range, the audio has usually been compressed hard enough that
            breaths and room pumping become part of the sound. Above it, the quiet
            passages disappear under road noise and the loud ones startle. Neither
            shows up on a level meter — both show up in whether people finish the
            episode.
          </p>

          <h2>A number is not a diagnosis</h2>
          <p>
            Any free LUFS meter can tell you your episode is −12.3 LUFS. What it
            can&apos;t tell you is what that means: that you&apos;re 3.7 LU hot for Apple,
            that the platform will turn you down, that the limiting used to get there
            is now pure cost, and what specifically to change in your chain before the
            next episode.
          </p>
          <p>
            That&apos;s the difference this tool is built around. The measurements follow
            ITU-R BS.1770-4 — the same standard broadcast delivery is checked against —
            and the interpretation comes from twenty years of mixing for broadcast,
            where a delivery that misses spec gets sent back.
          </p>
          <p>
            If you&apos;d rather not manage any of this per episode:{" "}
            <Link
              href="/"
              className="text-[#ff6200] underline decoration-[#ff6200]/40 underline-offset-4 transition-opacity hover:opacity-75"
            >
              PodMaster
            </Link>{" "}
            is our mastering pipeline built on the same broadcast targets — it lands
            every episode at spec, consistently, so the checker becomes a confirmation
            instead of a to-do list.
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
