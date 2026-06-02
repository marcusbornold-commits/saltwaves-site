import Link from "next/link";

const waveHeights = [
  30, 60, 45, 80, 55, 70, 35, 90, 50, 65, 40, 75, 60, 85, 45, 70, 55, 80, 35,
  65, 50, 90, 40, 70, 60, 85, 45, 75, 55, 80, 35, 65, 50, 90, 40, 70, 60,
];

const problems = [
  {
    icon: "📋",
    title: "Ingen oversikt",
    body: "Projektstatus, scheman och resurser lever i olika system - och ingen har den fullstandiga bilden i realtid.",
  },
  {
    icon: "🔁",
    title: "Repetitiva floden",
    body: "Samma tekniska steg upprepas for varje event eller sandning. Tid som kunde ga till kvalitet gar till administration.",
  },
  {
    icon: "🔌",
    title: "Verktyg som inte pratar",
    body: "vMix, Companion, schemalaggning, fakturering - alla i separata fonster. Data kopieras manuellt fram och tillbaka.",
  },
  {
    icon: "🧩",
    title: "Generiska losningar passar inte",
    body: "Hyllvaran ar byggd for alla - inte for AV-produktionens specifika krav och arbetsfloden.",
  },
];

const services = [
  {
    num: "01",
    title: "Produktionsdashboards",
    body: "Skraddarsydda kontrollpaneler for live-event, streaming och broadcast - allt samlat i ett granssnitt. Rundown, status, tider och resurser i realtid.",
    tag: "Webb / iPad",
  },
  {
    num: "02",
    title: "Automationsfloden",
    body: "Koppla ihop dina befintliga verktyg - Companion, vMix, NDI, schemalaggning - och automatisera det som idag gors manuellt.",
    tag: "Integration",
  },
  {
    num: "03",
    title: "Interna rapporteringsverktyg",
    body: "Tidrapportering, fakturaunderlag och eventoversikter automatiserade fran kalldata - inga manuella sammanstallningar.",
    tag: "Automation",
  },
  {
    num: "04",
    title: "Streaming & sandningsverktyg",
    body: "Anpassade losningar for live-produktion: grafik-triggers, rundown-integration, multiplatform-distribution och teknisk monitoring.",
    tag: "Live / Broadcast",
  },
];

const whyItems = [
  {
    num: "20",
    title: "20 ar i branschen",
    body: "Live-ljud, broadcast, TV-produktion och streaming. Vi vet hur det faktiskt ser ut bakom scenen - inte bara i teorin.",
  },
  {
    num: "✦",
    title: "Skraddarsytt, inte mall",
    body: "Varje losning byggs efter ditt specifika flode. Ingen onodig komplexitet - exakt det du behover.",
  },
  {
    num: "→",
    title: "Snabb leverans",
    body: "Liten firma, direkt kontakt, korta beslutsvagar. Fran brief till fungerande verktyg utan onodig overhead.",
  },
];

export default function ServicesPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#0a0a0a] text-[#f1ede8]">
      <style>{`
        @keyframes servicesPulse {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(0.4); }
        }
        @keyframes servicesFadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 opacity-40"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
        }}
      />

      <nav className="fixed left-0 right-0 top-0 z-[100] flex items-center justify-between bg-gradient-to-b from-[#0a0a0a]/95 to-transparent px-6 py-5 sm:px-12">
        <Link
          href="/"
          className="font-[family-name:var(--font-archivo)] text-[1.1rem] tracking-[0.05em] text-[#f1ede8]"
        >
          SALTWAVES<span className="text-[#ff6200]">.</span>STUDIO
        </Link>
        <a
          href="mailto:hello@saltwaves.studio?subject=Intresseanmälan – Produktionsverktyg"
          className="rounded-[2px] bg-[#ff6200] px-5 py-2.5 font-[family-name:var(--font-archivo)] text-[0.8rem] uppercase tracking-[0.08em] text-[#0a0a0a] transition-colors hover:bg-[#cc4e00]"
        >
          Kontakta oss
        </a>
      </nav>

      <section className="relative flex min-h-screen flex-col justify-center overflow-hidden px-6 pb-20 pt-36 sm:px-12">
        <p
          className="mb-6 font-[family-name:var(--font-space)] text-xs font-semibold uppercase tracking-[0.2em] text-[#ff6200]"
          style={{ animation: "servicesFadeUp 0.6s ease both" }}
        >
          Skraddarsydda produktionsverktyg & automation
        </p>
        <h1
          className="mb-8 max-w-[780px] font-[family-name:var(--font-archivo)] text-[clamp(2.8rem,6vw,5.5rem)] leading-[1.05]"
          style={{ animation: "servicesFadeUp 0.6s 0.1s ease both" }}
        >
          Din produktion.
          <br />
          <span className="text-[#ff6200]">Optimerad.</span>
          <br />
          Automatiserad.
        </h1>
        <p
          className="max-w-[560px] font-[family-name:var(--font-space)] text-[1.1rem] leading-[1.7] text-[#d4cfc9]"
          style={{ animation: "servicesFadeUp 0.6s 0.2s ease both" }}
        >
          Vi bygger interna verktyg, dashboards och arbetsfloden skraddarsydda
          for sma produktionsbolag och eventfirmor - sa du kan fokusera pa det
          kreativa arbetet.
        </p>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 right-0 flex h-[220px] items-end gap-[3px] px-6 opacity-10 sm:px-12"
        >
          {waveHeights.map((height, idx) => (
            <span
              key={`${height}-${idx}`}
              className="flex-1 rounded-t-[2px] bg-[#ff6200]"
              style={{
                height: `${height}px`,
                animation: `servicesPulse ${1.5 + (idx % 4) * 0.35}s ease-in-out ${
                  idx * 0.07
                }s infinite`,
              }}
            />
          ))}
        </div>
      </section>

      <div className="mx-6 h-px bg-gradient-to-r from-transparent via-[#ff6200] to-transparent opacity-30 sm:mx-12" />

      <section className="relative z-[1] bg-[#1a1a1a] px-6 py-24 sm:px-12">
        <p className="mb-4 font-[family-name:var(--font-space)] text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-[#ff6200]">
          Kanner du igen dig?
        </p>
        <h2 className="mb-6 font-[family-name:var(--font-archivo)] text-[clamp(1.8rem,3.5vw,2.8rem)] leading-[1.1]">
          Manuellt arbete som
          <br />
          stal din kreativa tid
        </h2>
        <p className="max-w-[600px] font-[family-name:var(--font-space)] text-[1.05rem] leading-[1.75] text-[#d4cfc9]">
          Produktionsbolag och eventfirmor spenderar for mycket tid pa
          repetitiva tekniska uppgifter istallet for att skapa. Vi loser det.
        </p>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {problems.map((item) => (
            <article
              key={item.title}
              className="relative overflow-hidden rounded border border-[#ff6200]/15 bg-[#222018] p-8 transition-colors hover:border-[#ff6200]/35"
            >
              <div className="absolute left-0 right-0 top-0 h-0.5 origin-left scale-x-0 bg-[#ff6200] transition-transform duration-300 group-hover:scale-x-100" />
              <p className="mb-4 text-3xl">{item.icon}</p>
              <h3 className="mb-2 font-[family-name:var(--font-archivo)] text-base tracking-[0.02em]">
                {item.title}
              </h3>
              <p className="font-[family-name:var(--font-space)] text-[0.9rem] leading-[1.65] text-[#d4cfc9]">
                {item.body}
              </p>
            </article>
          ))}
        </div>
      </section>

      <div className="mx-6 h-px bg-gradient-to-r from-transparent via-[#ff6200] to-transparent opacity-30 sm:mx-12" />

      <section className="relative z-[1] px-6 py-24 sm:px-12">
        <p className="mb-4 font-[family-name:var(--font-space)] text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-[#ff6200]">
          Vad vi bygger
        </p>
        <h2 className="mb-10 font-[family-name:var(--font-archivo)] text-[clamp(1.8rem,3.5vw,2.8rem)] leading-[1.1]">
          Verktyg som faktiskt
          <br />
          passar ditt flode
        </h2>

        <div className="mt-16 flex flex-col gap-0.5">
          {services.map((service) => (
            <article
              key={service.num}
              className="grid cursor-default items-center gap-6 border-b border-[#f1ede8]/10 py-8 transition-all hover:pl-3 md:grid-cols-[60px_1fr_auto] md:gap-8"
            >
              <p className="font-[family-name:var(--font-archivo)] text-[2.5rem] leading-none text-[#ff6200]/25 transition-colors group-hover:text-[#ff6200]">
                {service.num}
              </p>
              <div>
                <h3 className="mb-2 font-[family-name:var(--font-archivo)] text-[1.15rem]">
                  {service.title}
                </h3>
                <p className="max-w-[520px] font-[family-name:var(--font-space)] text-[0.9rem] leading-[1.65] text-[#d4cfc9]">
                  {service.body}
                </p>
              </div>
              <p className="hidden whitespace-nowrap rounded border border-[#ff6200]/20 bg-[#ff6200]/10 px-3.5 py-1.5 font-[family-name:var(--font-space)] text-[0.7rem] uppercase tracking-[0.12em] text-[#ff6200] md:block">
                {service.tag}
              </p>
            </article>
          ))}
        </div>
      </section>

      <div className="mx-6 h-px bg-gradient-to-r from-transparent via-[#ff6200] to-transparent opacity-30 sm:mx-12" />

      <section className="relative z-[1] bg-[#1a1a1a] px-6 py-24 sm:px-12">
        <p className="mb-4 font-[family-name:var(--font-space)] text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-[#ff6200]">
          Varfor Saltwaves
        </p>
        <h2 className="mb-10 font-[family-name:var(--font-archivo)] text-[clamp(1.8rem,3.5vw,2.8rem)] leading-[1.1]">
          Byggt av nagon som
          <br />
          forstar produktionen
        </h2>

        <div className="mt-16 grid overflow-hidden rounded border border-[#f1ede8]/10 md:grid-cols-3">
          {whyItems.map((item) => (
            <article key={item.title} className="relative bg-[#222018] p-8">
              <span className="absolute right-5 top-4 font-[family-name:var(--font-archivo)] text-6xl leading-none text-[#ff6200]/10">
                {item.num}
              </span>
              <h3 className="mb-3 font-[family-name:var(--font-archivo)] text-base text-[#f1ede8]">
                {item.title}
              </h3>
              <p className="font-[family-name:var(--font-space)] text-[0.875rem] leading-[1.65] text-[#d4cfc9]">
                {item.body}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="relative z-[1] border-t border-[#ff6200]/20 bg-[linear-gradient(135deg,#1a1400_0%,#0a0a0a_60%)] px-6 py-24 text-center sm:px-12">
        <p className="mb-4 font-[family-name:var(--font-space)] text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-[#ff6200]">
          Kom igang
        </p>
        <h2 className="mx-auto mb-5 max-w-[600px] font-[family-name:var(--font-archivo)] text-[clamp(1.8rem,3.5vw,2.8rem)] leading-[1.1]">
          Beratta om ditt flode - vi loser resten
        </h2>
        <p className="mb-10 font-[family-name:var(--font-space)] text-[1.05rem] text-[#d4cfc9]">
          Kostnadsfritt samtal. Vi lyssnar, forstar och berattar vad som ar
          mojligt.
        </p>
        <a
          href="mailto:hello@saltwaves.studio?subject=Intresseanmälan – Produktionsverktyg"
          className="inline-block rounded-[2px] bg-[#ff6200] px-12 py-4 font-[family-name:var(--font-archivo)] text-[0.9rem] uppercase tracking-[0.1em] text-[#0a0a0a] transition-all hover:-translate-y-0.5 hover:bg-[#cc4e00]"
        >
          Skicka ett mail
        </a>
        <p className="mt-5 font-[family-name:var(--font-space)] text-[0.85rem] tracking-[0.05em] text-[#f1ede8]/40">
          hello@saltwaves.studio
        </p>
      </section>

      <footer className="flex flex-col items-center justify-between gap-2 border-t border-[#f1ede8]/10 px-6 py-8 text-center font-[family-name:var(--font-space)] text-[0.8rem] text-[#f1ede8]/35 sm:flex-row sm:px-12">
        <span>© 2026 Saltwaves Studio - Enskild firma</span>
        <span>saltwaves.studio</span>
      </footer>
    </main>
  );
}
