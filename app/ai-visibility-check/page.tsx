import type { Metadata } from 'next'
import { SiteFooter } from '@/components/site-footer'
import { checkFaq, checkPath, reportContents, results, steps, turnaround } from '@/lib/ai-visibility'
import { JsonLd, absoluteUrl, breadcrumbJsonLd, defaultSocialImage, siteUrl } from '@/lib/seo'
import { CheckForm } from './check-form'
import styles from './page.module.css'

const title = 'Free AI Visibility Check: Does ChatGPT Recommend Your Business? | Burgama'
const description = `See whether ChatGPT and Google recommend your business, who they suggest instead, and three fixes. Free, in ${turnaround}. From Burgama, an Austin marketing studio.`

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: checkPath },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  openGraph: { title, description, url: checkPath, type: 'website', images: [defaultSocialImage] },
  twitter: { card: 'summary_large_image', title, description, images: [defaultSocialImage] },
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': `${absoluteUrl(checkPath)}#faq`,
  mainEntity: checkFaq.map(entry => ({
    '@type': 'Question',
    name: entry.question,
    acceptedAnswer: { '@type': 'Answer', text: entry.answer },
  })),
}

const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  '@id': `${absoluteUrl(checkPath)}#service`,
  name: 'Free AI visibility check',
  serviceType: 'AI search optimization audit',
  description: `A free report on whether ChatGPT and Google recommend your business, which competitors they suggest instead, and three prioritized fixes. Delivered by email within ${turnaround}.`,
  provider: { '@id': `${siteUrl}/#organization` },
  areaServed: { '@type': 'Country', name: 'United States' },
  url: absoluteUrl(checkPath),
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
}

export default function AiVisibilityCheckPage() {
  return (
    <div className={`studio-page ${styles.page} font-sans`} data-nav-surface="ink">
      <JsonLd data={serviceJsonLd} />
      <JsonLd data={faqJsonLd} />
      <JsonLd data={breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Free AI visibility check', path: checkPath }])} />

      <section className={styles.hero} aria-labelledby="check-title">
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>Free AI visibility check</p>
          <h1 id="check-title" className="font-serif">Does ChatGPT recommend your business?</h1>
          <p className={styles.lede}>
            <span className={styles.ledeLong}>We ask ChatGPT and Google what your customers ask, then send you who they recommend, what they say about you, and three fixes. Free, in {turnaround}.</span>
            <span className={styles.ledeShort}>See who AI recommends instead of you, plus three fixes. Free, in {turnaround}.</span>
          </p>
        </div>
        <CheckForm />
      </section>

      <section className={styles.band} aria-labelledby="report-title">
        <h2 id="report-title" className="font-serif">What’s in your report</h2>
        <ol className={styles.cards}>
          {reportContents.map(([heading, body]) => (
            <li key={heading}><h3>{heading}</h3><p>{body}</p></li>
          ))}
        </ol>
      </section>

      <section className={styles.band} aria-labelledby="steps-title">
        <h2 id="steps-title" className="font-serif">How it works</h2>
        <ol className={styles.steps}>
          {steps.map(([heading, body], index) => (
            <li key={heading}><span className={styles.stepNumber} aria-hidden="true">{index + 1}</span><div><h3>{heading}</h3><p>{body}</p></div></li>
          ))}
        </ol>
      </section>

      <section className={styles.band} aria-labelledby="results-title">
        <h2 id="results-title" className="font-serif">Recent results</h2>
        <ul className={styles.results}>
          {results.map(result => (
            <li key={result.label}>
              <p className={`${styles.figure} font-serif`}>{result.figure}</p>
              <p className={styles.figureLabel}>{result.label}</p>
              <p className={styles.figureDetail}>{result.detail}</p>
            </li>
          ))}
        </ul>
        <p className={styles.note}>Search figures are from Google Search Console and site analytics; ad figures are from Meta Ads Manager. Rankings and impressions are not revenue.</p>
      </section>

      <section className={styles.band} aria-labelledby="faq-title">
        <h2 id="faq-title" className="font-serif">Questions</h2>
        <div className={styles.faq}>
          {checkFaq.map(entry => (
            <details key={entry.id} id={entry.id}>
              <summary>{entry.question}</summary>
              <p>{entry.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className={`${styles.band} ${styles.closing}`} aria-labelledby="closing-title">
        <h2 id="closing-title" className="font-serif">Find out where you stand.</h2>
        <p>It takes about a minute. If you want help with the fixes afterward, see our <a href="/faq#service-seo">Local SEO and AI Visibility Foundation</a>.</p>
        <a href="#check" className={`pill ${styles.closingCta}`}>get my free check</a>
      </section>

      <SiteFooter />
    </div>
  )
}
