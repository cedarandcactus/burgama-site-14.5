import type { ReactNode } from 'react'
import Link from '@/components/transition-link'
import { ModularButton } from '@/components/modular-button'
import { PageHero } from '@/components/page-hero'
import { Reveal } from '@/components/reveal'
import { SiteFooter } from '@/components/site-footer'
import { SectionRise } from '@/components/home/section-rise'
import { calculatorPath, calculators } from '@/lib/calculators'
import { JsonLd, absoluteUrl, breadcrumbJsonLd, siteUrl } from '@/lib/seo'
import services from '@/app/services/services.module.css'
import styles from './calculator.module.css'

type CalculatorPageProps = {
  slug: string
  name: string
  description: string
  wordmark: string
  intro: string
  calculator: ReactNode
  howTitle: string
  how: ReactNode
  faq: [string, string][]
  closing: { title: string; body: string }
}

// Shared shell for the free calculators in /research: hero, the calculator,
// how it works, questions (with FAQ schema) and a closing band.
export function CalculatorPage({ slug, name, description, wordmark, intro, calculator, howTitle, how, faq, closing }: CalculatorPageProps) {
  const path = calculatorPath(slug)
  const others = calculators.filter(entry => entry.slug !== slug)

  const appJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    '@id': `${absoluteUrl(path)}#calculator`,
    name,
    url: absoluteUrl(path),
    description,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Any',
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    provider: { '@id': `${siteUrl}/#organization` },
  }

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${absoluteUrl(path)}#faq`,
    mainEntity: faq.map(([question, answer]) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  }

  return (
    <div className={`studio-page ${styles.page}`}>
      <JsonLd data={appJsonLd} />
      <JsonLd data={faqJsonLd} />
      <JsonLd data={breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Research', path: '/research' }, { name, path }])} />

      <PageHero variant="centered" wordmark={wordmark} titleId="calculator-title" intro={[intro]} nextSurface="powder" />

      <section className={`studio-band ${services.band} ${styles.calculatorBand}`} data-surface="powder" id="calculator" aria-label={name}>
        <div className="studio-width">{calculator}</div>
        <SectionRise surface="white" />
      </section>

      <section className={`studio-band ${services.band}`} data-surface="white" aria-labelledby="how-title">
        <div className="studio-width">
          <div className={styles.prose}>
            <h2 id="how-title" className="font-serif">{howTitle}</h2>
            {how}
          </div>
        </div>
        <SectionRise surface="blue-slate" />
      </section>

      <section className={`studio-band ${services.band}`} data-surface="blue-slate" aria-labelledby="faq-title">
        <div className="studio-width">
          <Reveal variant="section" className={services.heading}>
            <h2 id="faq-title" className="font-serif">Questions</h2>
          </Reveal>
          <div className={services.faq}>
            {faq.map(([question, answer]) => (
              <details key={question}>
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
        <SectionRise surface="navy" />
      </section>

      <section className={`studio-band ${services.band}`} data-surface="navy" aria-labelledby="closing-title">
        <div className="studio-width">
          <Reveal variant="section" className={services.heading}>
            <h2 id="closing-title" className="font-serif">{closing.title}</h2>
            <p>{closing.body}</p>
          </Reveal>
          <nav className={`studio-actions ${services.actions}`} aria-label="Next steps">
            <ModularButton href="/services/meta-ads">see Meta ads management</ModularButton>
            <ModularButton href="#start-a-project">start a project</ModularButton>
          </nav>
          <nav className={styles.moreTools} aria-label="More calculators">
            <p>More free calculators</p>
            <ul>
              {others.map(entry => (
                <li key={entry.slug}><Link href={calculatorPath(entry.slug)}>{entry.name}</Link></li>
              ))}
            </ul>
          </nav>
        </div>
        <SectionRise surface="powder-deep" />
      </section>

      <SiteFooter />
    </div>
  )
}
