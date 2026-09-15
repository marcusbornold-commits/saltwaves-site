import type { Metadata } from 'next';
import Link from 'next/link';
import { getLandingPage, landingPages } from './content';
import styles from './landing.module.css';

const origin = 'https://saltwaves.studio';
export function landingMetadata(slug: string): Metadata {
  const page = getLandingPage(slug);
  return {
    title: page.title, description: page.description,
    alternates: { canonical: `/${page.slug}` },
    openGraph: { title: page.title, description: page.description, url: `/${page.slug}`, type: 'website', siteName: 'Saltwaves Studio' },
    twitter: { card: 'summary', title: page.title, description: page.description },
  };
}

export default function LandingPage({ slug }: { slug: string }) {
  const page = getLandingPage(slug);
  const ctaHref = page.contact
    ? 'mailto:hello@saltwaves.studio?subject=PodMaster%20integration%20enquiry&body=Organisation%3A%0AMonthly%20audio%20volume%3A%0AFile%20formats%20and%20duration%3A%0ADelivery%20target%3A%0AWorkflow%20and%20turnaround%3A%0AData%20requirements%3A'
    : '/podmaster';
  const ctaLabel = page.contact ? 'Discuss your integration' : 'Try PodMaster free';
  const structuredData = {
    '@context': 'https://schema.org', '@graph': [
      { '@type': 'WebPage', '@id': `${origin}/${slug}#page`, url: `${origin}/${slug}`, name: page.title, description: page.description, inLanguage: 'en', breadcrumb: { '@id': `${origin}/${slug}#breadcrumb` } },
      { '@type': 'BreadcrumbList', '@id': `${origin}/${slug}#breadcrumb`, itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Saltwaves Studio', item: origin },
        { '@type': 'ListItem', position: 2, name: page.label, item: `${origin}/${slug}` },
      ] },
      { '@type': 'FAQPage', '@id': `${origin}/${slug}#faq`, mainEntity: page.faqs.map(faq => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })) },
    ],
  };
  return (
    <main className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} />
      <section className={`${styles.hero} band-dark`}>
        <div className="container">
          <nav aria-label="Breadcrumb" className={styles.breadcrumb}><Link href="/">Saltwaves Studio</Link><span aria-hidden="true"> / </span><span>{page.label}</span></nav>
          <p className="kicker">PodMaster · {page.contact ? 'For production teams' : 'Spoken-word audio'}</p>
          <h1>{page.h1}</h1>
          <p className={styles.intro}>{page.intro}</p>
          <div className={styles.actions}>
            <a className="btn btn-primary" href={ctaHref}>{ctaLabel} <span aria-hidden="true">→</span></a>
            <Link className="btn btn-ghost" href={page.contact ? '/podmaster' : '/#demo'}>{page.contact ? 'Try the sound in PodMaster' : 'Hear before and after'}</Link>
          </div>
          <p className={styles.fit}>{page.fit}</p>
        </div>
      </section>
      {page.comparison && <section className={styles.section}>
        <div className="container">
          <h2>Choose by the work you need done.</h2>
          <div className={styles.tableScroll} role="region" aria-label={page.comparison.caption} tabIndex={0}>
            <table><caption>{page.comparison.caption}</caption><thead><tr>{page.comparison.headers.map(header => <th key={header} scope="col">{header}</th>)}</tr></thead>
              <tbody>{page.comparison.rows.map(([label, ...cells]) => <tr key={label}><th scope="row">{label}</th>{cells.map(cell => <td key={cell}>{cell}</td>)}</tr>)}</tbody>
            </table>
          </div>
          <p className={styles.source}>Comparison reviewed 15 September 2026. Source: <a href={page.comparison.source}>{page.comparison.sourceLabel}</a>. Features can change; check the provider before choosing a workflow.</p>
        </div>
      </section>}
      <section className={styles.section}>
        <div className="container">
          <p className="kicker">{page.contact ? 'Scope the integration' : 'From recording to delivery'}</p>
          <div className={styles.grid}>{page.sections.map((section, index) => <section className={styles.card} key={section.title}>
            <span className={styles.number} aria-hidden="true">0{index + 1}</span><h2>{section.title}</h2><p>{section.text}</p>
          </section>)}</div>
          <div className={styles.nextStep}><h2>{page.contact ? 'Need an engineer on the job?' : 'Measure it. Listen. Then publish.'}</h2>
            <p>{page.contact ? 'Discuss editing, repair and delivery with Saltwaves.' : 'Use our browser tool for a level check, or talk to an engineer about recordings that need individual attention.'}</p>
            <div className={styles.actions}><Link href="/podcast-loudness-checker">Open the free Loudness Checker →</Link><Link href="/services">Explore post-production →</Link></div>
          </div>
        </div>
      </section>
      <section className={styles.section} id="questions"><div className="container">
        <p className="kicker">Fair questions</p><h2>What to know before you start.</h2>
        <dl className={styles.faq}>{page.faqs.map(faq => <div key={faq.question}><dt>{faq.question}</dt><dd>{faq.answer}</dd></div>)}</dl>
      </div></section>
      <section className={styles.section}><div className="container"><h2>Go deeper. Or take the next step.</h2>
        <nav aria-label="Related guides" className={styles.related}>{page.articles.map(article => <Link key={article.slug} href={`/blog/${article.slug}`}>{article.label} →</Link>)}</nav>
        <nav aria-label="Related podcast workflows" className={styles.related}>{landingPages.filter(other => other.slug !== slug).map(other => <Link href={`/${other.slug}`} key={other.slug}>{other.label} →</Link>)}</nav>
      </div></section>
      <section className={`${styles.section} band-dark`}><div className="container"><p className="kicker">Your next episode</p><h2>{page.contact ? 'Let’s talk through the handoff.' : 'Your own voice is the best test.'}</h2>
        <p className={styles.intro}>{page.contact ? 'Send your requirements and confirm the scope with Saltwaves.' : 'Upload an original recording. Listen to the master. Decide with your ears.'}</p>
        <div className={styles.actions}><a className="btn btn-primary" href={ctaHref}>{ctaLabel} →</a><Link href="/pricing">View plans and limits →</Link></div>
      </div></section>
    </main>
  );
}
