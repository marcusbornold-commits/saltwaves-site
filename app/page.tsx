import Link from "next/link";
import SignupForm from "./components/signup-form";

export default function Home() {
  return (
    <main className="bg-[#1a1a1a] text-white">
      <section className="relative isolate overflow-hidden px-6 pb-20 pt-24 sm:px-10 sm:pt-28 lg:px-20">
        <div className="mx-auto max-w-5xl">
          <p className="font-[family-name:var(--font-archivo)] text-lg uppercase tracking-[0.04em] text-[#ff6200] sm:text-xl">
            SALTWAVES.STUDIO
          </p>
          <h1 className="mt-6 max-w-2xl text-4xl font-semibold leading-tight tracking-tight text-[#f1ede8] sm:text-5xl lg:text-6xl">
            Professional audio tools for creators
          </h1>
          <SignupForm />
        </div>
      </section>

      <section className="px-6 pb-36 pt-16 sm:px-10 sm:pt-20 lg:px-20 lg:pb-40">
        <div className="mx-auto max-w-5xl space-y-10 text-[1.45rem] leading-[1.95] text-[#f1ede8]/92 sm:text-[1.75rem]">
          <p>
            I&apos;ve worked in broadcast audio for over 20 years. FOH, TV
            production, studio. During that time I&apos;ve come home from
            recordings with a feeling I know all too well — how am I going to
            get rid of this echo?
          </p>
          <p>
            It was at one of those moments, about five years ago, that I came
            across De-Verberate 3. I had a recording made in a church entrance
            with a shotgun mic out of frame. The echo was total. The room
            dominated everything. Then I ran De-Verberate. My jaw dropped. It
            wasn&apos;t that the echo was reduced, or that things got a little
            better. It was that there was simply a perfectly isolated voice
            left. The room was gone. It was one of those moments when you
            understand that something has changed.
          </p>
          <p>
            My colleagues who are TV producers will sometimes say to me:
            &quot;this sounds rough — what&apos;s wrong with it?&quot; And I can tell
            them: you&apos;re compressing too hard. Or: you&apos;ve boosted 10 dB at
            2.5 kHz. They hear that something is wrong. I hear exactly what it
            is. Not because I&apos;m smarter. Because I&apos;ve been listening to it for
            20 years. That&apos;s the ear PodMaster is trained on.
          </p>
          <p>
            The problem with podcasting isn&apos;t that people don&apos;t care how it
            sounds. The problem is that the tools either require you to
            understand what 2.5 kHz means — or they fix it in a way that sounds
            even stranger than the original. I&apos;ve listened to too many episodes
            where an interesting guest is being interviewed over Zoom, on a
            laptop&apos;s built-in microphone, in an echoey room. The topic is
            fascinating. The audio makes it impossible to listen to the end.
          </p>
          <p>PodMaster is built to solve it.</p>
          <p className="pt-4 text-[#ff6200]">— Marcus, Saltwaves Studio</p>
        </div>
      </section>

      <section className="px-6 pb-20 sm:px-10 lg:px-20">
        <div className="mx-auto max-w-5xl border-t border-white/10 pt-8">
          <Link
            href="/blog"
            className="inline-block text-sm uppercase tracking-[0.14em] text-white/75 transition-opacity hover:opacity-70"
          >
            Visit the blog
          </Link>
        </div>
      </section>
    </main>
  );
}
