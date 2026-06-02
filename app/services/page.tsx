import Link from "next/link";

const waveHeights = [
  30, 60, 45, 80, 55, 70, 35, 90, 50, 65, 40, 75, 60, 85, 45, 70, 55, 80, 35,
  65, 50, 90, 40, 70, 60, 85, 45, 75, 55, 80, 35, 65, 50, 90, 40, 70, 60,
];

const problems = [
  {
    icon: "📋",
    title: "Ingen samlad bild",
    body: "Du vet vad som ska hända — men inte var informationen finns. Status, schema och resurser lever i separata system som aldrig pratar med varandra.",
  },
  {
    icon: "🔁",
    title: "Manuella moment som inte borde existera",
    body: "Varje event börjar med att du kopierar samma information till tre olika ställen. Det är inte ett workflow-problem. Det är ett verktyg-problem.",
  },
  {
    icon: "🔌",
    title: "Companion, vMix och resten pratar inte med varandra",
    body: "Du har bra verktyg. De är bara inte byggda för att jobba ihop. Bryggan däremellan är fortfarande du.",
  },
  {
    icon: "🧩",
    title: "Hyllvaran är inte byggd för dig",
    body: "Generiska projektverktyg förstår inte vad en produktionsledare faktiskt behöver kl 06:00 på eventdagen.",
  },
];

const services = [
  {
    num: "01",
    title: "Produktionsdashboards",
    body: "Allt på ett ställe: rundown, schema, teknikstatus och resurser i realtid. Byggt för hur du faktiskt jobbar — inte hur ett konsultbolag tror att du jobbar.",
    tag: "Webb / iPad",
  },
  {
    num: "02",
    title: "Automationsflöden",
    body: "Companion triggar något i vMix. vMix skickar status till din rundown. Rundown uppdaterar schemat. Det som idag kräver tre manuella steg händer automatiskt.",
    tag: "Integration",
  },
  {
    num: "03",
    title: "Interna rapporteringsverktyg",
    body: "Tidrapportering, fakturaunderlag och eventöversikter genereras direkt från källdata. Du avslutar eventet — rapporten är redan klar.",
    tag: "Automation",
  },
  {
    num: "04",
    title: "Streaming & sändningsverktyg",
    body: "Grafik-triggers, rundown-integration, multiplatform-distribution och teknisk monitoring. Byggt av någon som vet vad som händer när något går fel live.",
    tag: "Live / Broadcast",
  },
];

const whyItems = [
  {
    num: "20",
    title: "Vi har stått där du står",
    body: "20 år inom live-ljud, broadcast, TV och streaming. Vi bygger inte verktyg baserat på vad vi tror att du behöver — utan på vad vi själva saknade.",
  },
  {
    num: "✦",
    title: "Skräddarsytt, inte konfigurerat",
    body: "Du får inte en mall du ska anpassa dig till. Du beskriver hur du jobbar — vi bygger något som passar det flödet exakt.",
  },
  {
    num: "→",
    title: "Direkt kontakt, ingen overhead",
    body: "Liten firma. Du pratar med den som bygger. Inga mellanhänder, inga projektledare, inga möten om möten.",
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
          Skräddarsydda produktionsverktyg & automation
        </p>
        <h1
          className="mb-8 max-w-[780px] font-[family-name:var(--font-archivo)] text-[clamp(2.8rem,6vw,5.5rem)] leading-[1.05]"
          style={{ animation: "servicesFadeUp 0.6s 0.1s ease both" }}
        >
          Du kan produktionen.
          <br />
          <span className="text-[#ff6200]">Vi bygger verktygen</span>
          <br />
          som får den att flyta.
        </h1>
        <p
          className="max-w-[560px] font-[family-name:var(--font-space)] text-[1.1rem] leading-[1.7] text-[#d4cfc9]"
          style={{ animation: "servicesFadeUp 0.6s 0.2s ease both" }}
        >
          Vi bygger interna verktyg och automationer för produktionsbolag och
          eventfirmor som vet exakt vad de behöver — men inte har tid att bygga
          det själva.
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
          KÄNNER DU IGEN DIG?
        </p>
        <h2 className="mb-6 font-[family-name:var(--font-archivo)] text-[clamp(1.8rem,3.5vw,2.8rem)] leading-[1.1]">
          Verktygen håller inte takten med produktionen
        </h2>
        <p className="max-w-[600px] font-[family-name:var(--font-space)] text-[1.05rem] leading-[1.75] text-[#d4cfc9]">
          Din rundown lever i Excel. Schemat i WhatsApp. Tekniklistan i
          huvudet. Och någonstans mitt i det ska du leverera ett felfritt
          event.
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
          VAD VI BYGGER
        </p>
        <h2 className="mb-10 font-[family-name:var(--font-archivo)] text-[clamp(1.8rem,3.5vw,2.8rem)] leading-[1.1]">
          Verktyg som passar hur du faktiskt jobbar
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
          VARFÖR SALTWAVES
        </p>
        <h2 className="mb-10 font-[family-name:var(--font-archivo)] text-[clamp(1.8rem,3.5vw,2.8rem)] leading-[1.1]">
          Byggt av någon som har stått där du står
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
          Kom igång
        </p>
        <h2 className="mx-auto mb-5 max-w-[600px] font-[family-name:var(--font-archivo)] text-[clamp(1.8rem,3.5vw,2.8rem)] leading-[1.1]">
          Berätta hur det ser ut idag — vi berättar vad som är möjligt.
        </h2>
        <p className="mb-10 font-[family-name:var(--font-space)] text-[1.05rem] text-[#d4cfc9]">
          Inget sälj. Inget åtagande. Bara ett samtal mellan folk som förstår
          produktionen.
        </p>
        <a
          href="mailto:hello@saltwaves.studio?subject=Intresseanmälan – Produktionsverktyg"
          className="inline-block rounded-[2px] bg-[#ff6200] px-12 py-4 font-[family-name:var(--font-archivo)] text-[0.9rem] uppercase tracking-[0.1em] text-[#0a0a0a] transition-all hover:-translate-y-0.5 hover:bg-[#cc4e00]"
        >
          Skicka ett mail →
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
