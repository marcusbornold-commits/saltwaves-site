import type { Metadata } from "next";
import Link from "next/link";

import NotifyForm from "./notify-form";

export const metadata: Metadata = {
  title: "Loudness Inspector — Free Podcast LUFS Checker | Saltwaves Studio",
  description:
    "Free in-browser podcast loudness meter. Check integrated LUFS and True Peak against Spotify, Apple Podcasts and YouTube targets — no install, no signup.",
  openGraph: {
    title: "Loudness Inspector — Free Podcast LUFS Checker",
    description:
      "Drop a file, instantly see integrated LUFS and True Peak against every major platform target. Free podcast loudness checker — launching August 2026.",
    type: "website",
    url: "https://saltwaves.studio/loudness-inspector",
  },
};

const platforms = ["Spotify", "Apple Podcasts", "YouTube"];

export default function LoudnessInspectorPage() {
  return (
    <main className="min-h-screen bg-[#1a1a1a] text-[#f1ede8]">
      <nav className="border-b border-[#f1ede8]/10 px-6 py-5 sm:px-10 lg:px-20">
        <Link
          href="/"
          className="font-[family-name:var(--font-archivo)] text-[1.1rem] tracking-[0.05em] text-[#f1ede8] transition-opacity hover:opacity-80"
        >
          SALTWAVES<span className="text-[#ff6200]">.</span>STUDIO
        </Link>
      </nav>

      <section className="px-6 py-16 sm:px-10 sm:py-24 lg:px-20">
        <div className="mx-auto max-w-2xl">
          <p className="inline-block rounded-[2px] border border-[#ff6200]/40 bg-[#ff6200]/10 px-3 py-1.5 font-[family-name:var(--font-space)] text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#ff6200]">
            Launches August 1, 2026
          </p>

          <h1 className="mt-8 font-[family-name:var(--font-archivo)] text-[clamp(2.5rem,7vw,4rem)] leading-[1.05] tracking-tight text-[#f1ede8]">
            Loudness Inspector
          </h1>

          <p className="mt-6 font-[family-name:var(--font-space)] text-[clamp(1.05rem,2.5vw,1.25rem)] leading-[1.65] text-[#f1ede8]/80">
            A free in-browser tool to check your podcast&apos;s integrated LUFS
            and True Peak against Spotify, Apple Podcasts and YouTube targets.
          </p>

          <p className="mt-6 font-[family-name:var(--font-space)] text-[1rem] leading-[1.75] text-[#f1ede8]/65">
            Drop an audio file and instantly see your integrated LUFS and True
            Peak — with platform targets right there for comparison. No install,
            no signup, nothing to configure. Just a quick read on whether your
            episode is loud enough (or too loud) before you publish.
          </p>

          <ul className="mt-8 flex flex-wrap gap-2">
            {platforms.map((platform) => (
              <li
                key={platform}
                className="rounded-[2px] border border-[#f1ede8]/15 px-3 py-1.5 font-[family-name:var(--font-space)] text-[0.75rem] uppercase tracking-[0.12em] text-[#f1ede8]/55"
              >
                {platform}
              </li>
            ))}
          </ul>

          <NotifyForm />

          <p className="mt-10 font-[family-name:var(--font-space)] text-[0.85rem] leading-relaxed text-[#f1ede8]/45">
            Mentioned in our{" "}
            <Link
              href="/blog/how-loud-should-a-podcast-be-lufs-guide"
              className="text-[#ff6200] underline-offset-2 transition-opacity hover:opacity-80 hover:underline"
            >
              LUFS guide
            </Link>
            . Part of the Saltwaves Studio toolkit for podcasters.
          </p>
        </div>
      </section>
    </main>
  );
}
