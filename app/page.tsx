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

      <section className="px-6 pb-28 pt-8 sm:px-10 lg:px-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Why we built this
          </h2>
          <p className="mt-10 text-xl leading-relaxed text-white/85 sm:text-2xl">
            Great audio shouldn&apos;t require a studio. We believe every creator
            deserves broadcast-quality sound - whether you&apos;re recording in a
            bedroom, a church, or a car. Saltwaves builds tools that close the
            gap between where you are and where you want to sound.
          </p>
        </div>
      </section>
    </main>
  );
}
