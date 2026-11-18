import type { Metadata } from 'next'
import Image from 'next/image'
import { ModularButton } from '@/components/modular-button'
import { Reveal } from '@/components/reveal'
import { SiteFooter } from '@/components/site-footer'
import { PageHero } from '@/components/page-hero'
import { SectionRise } from '@/components/home/section-rise'
import { bookingUrl } from '@/lib/ai-visibility'
import { JsonLd, absoluteUrl, breadcrumbJsonLd, siteUrl } from '@/lib/seo'
import styles from './tiktok-shop.module.css'

const path = '/tiktok-shop'
const title = 'TikTok Shop Management for Consumer Brands | Burgama'
const description = 'Burgama sets up and runs TikTok Shop for consumer brands: shop setup, creator partnerships, content, ads and reporting, handled by one team.'
const image = `${siteUrl}/images/tiktok-shop-how-it-works.jpg`

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: path },
  openGraph: { title, description, url: path, type: 'website', images: [image] },
  twitter: { card: 'summary_large_image', title, description, images: [image] },
}

const HANDLED = [
  ['Shop setup', 'We open and configure your shop, pick the products that fit the channel, and write listings that are ready to sell.'],
  ['Creator partnerships', 'We find creators who match your brand, send them product, and manage the commissions they earn on every sale.'],
  ['Content', 'We plan, film and edit short videos for your account, and brief creators so their videos sound like them and sell like you.'],
  ['Ads', 'We put paid spend behind the videos that are already selling, and stop spending on the ones that are not.'],
  ['Reporting', 'Each month you see sales, top creators, top videos and what we are changing next, in plain language.'],
]

const STEPS = [
  ['Fit check', 'A free call to look at your products, pricing and margins, and tell you honestly whether TikTok Shop makes sense.'],
  ['Launch', 'We set up the shop, list your first products and send product to the first group of creators.'],
  ['Grow', 'We add creators, back the best videos with ads, and report every month on what sold and why.'],
]

const FIT = [
  'Your product is easy to show in a short video.',
  'It sells for about $10 to $40, or you can bundle to get there.',
  'People buy it more than once.',
  'You have stock on hand to handle a sudden spike in orders.',
]

const FAQ = [
  ['What does it cost?', 'It depends on how many products and creators are involved, so we quote each brand after the fit check. Most engagements combine a setup fee, a monthly fee and a share of the sales we drive.'],
  ['Do we need a TikTok following first?', 'No. Most sales come from creators posting about your product to their own audiences, not from your own account.'],
  ['Who ships the orders?', 'You do, through the shipping options TikTok Shop requires. We set that up with you during launch.'],
  ['Do you only work with consumer products?', 'TikTok Shop is built for physical products, so this service is for brands that sell them. For everything else, see our other work.'],
]

const NUMBERS = [
  ['$11.8B', 'in US TikTok Shop sales in the first half of 2026'],
  ['2x', 'roughly double the same period a year earlier'],
  ['164%', 'sales growth for candy brand Brain Blasterz after a creator-led push'],
]

const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  '@id': `${absoluteUrl(path)}#service`,
  name: 'TikTok Shop management',
  serviceType: 'TikTok Shop management',
  description,
  provider: { '@id': `${siteUrl}/#organization` },
  areaServed: { '@type': 'Country', name: 'United States' },
  url: absoluteUrl(path),
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': `${absoluteUrl(path)}#faq`,
  mainEntity: FAQ.map(([question, answer]) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: { '@type': 'Answer', text: answer },
  })),
}

export default function TikTokShopPage() {
  return (
    <div className="studio-page">
      <JsonLd data={serviceJsonLd} />
      <JsonLd data={faqJsonLd} />
      <JsonLd data={breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'TikTok Shop management', path }])} />

      <PageHero
        variant="centered"
        wordmark="TikTok Shop, run for your brand from setup to sales."
        titleId="tiktok-shop-title"
        intro={['We set up your shop, recruit the creators, make the content and run the ads. You keep making a product people want.']}
        actions={<>
          <a className="pill modular-button" href={bookingUrl} target="_blank" rel="noopener noreferrer">book a free fit check</a>
          <ModularButton href="#how-it-works">see how it works</ModularButton>
        </>}
        nextSurface="navy"
      />

      <section className="studio-band" data-surface="navy" id="how-it-works" aria-labelledby="how-title">
        <div className="studio-width">
          <Reveal variant="section" className={styles.heading}>
            <h2 id="how-title" className="font-serif">People buy without leaving the video.</h2>
            <p>On TikTok Shop, creators show your product and viewers check out in the same app. Brands that do well treat creators as their sales team.</p>
          </Reveal>
          <Reveal as="figure" className={styles.figure}>
            <Image
              src="/images/tiktok-shop-how-it-works.jpg"
              alt="Illustration of a phone showing a creator video with a product and a buy button, with three steps: a creator posts, a viewer taps to buy, the order ships."
              width={1600}
              height={1200}
              sizes="(max-width: 1100px) 100vw, 1000px"
            />
          </Reveal>
          <ul className={styles.numbers} aria-label="TikTok Shop by the numbers">
            {NUMBERS.map(([figure, label], index) => (
              <Reveal as="li" delay={index * 70} key={figure}>
                <p className={`font-serif ${styles.figureNumber}`}>{figure}</p>
                <p>{label}</p>
              </Reveal>
            ))}
          </ul>
          <p className={styles.sources}>
            Market figures are estimates from Momentum Works and Tabcut, <a href="https://www.tubefilter.com/2026/08/06/tiktok-shop-gross-merchandise-value-gmv-50-billion/" target="_blank" rel="noopener noreferrer">reported by Tubefilter</a>. The Brain Blasterz result is <a href="https://ads.tiktok.com/business/en/inspiration/brain-blasterz-tiktok-success-story" target="_blank" rel="noopener noreferrer">published by TikTok</a>. These are not Burgama results.
          </p>
        </div>
        <SectionRise surface="blue-slate" direction="left" />
      </section>

      <section className="studio-band" data-surface="blue-slate" aria-labelledby="handled-title">
        <div className="studio-width">
          <Reveal variant="section" className={styles.heading}>
            <h2 id="handled-title" className="font-serif">What we handle</h2>
          </Reveal>
          <ol className={styles.cards}>
            {HANDLED.map(([heading, body], index) => (
              <Reveal as="li" className={styles.card} delay={index * 70} key={heading}>
                <span className={styles.number} aria-hidden="true">{index + 1}</span>
                <h3 className="font-serif">{heading}</h3>
                <p>{body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
        <SectionRise surface="powder" />
      </section>

      <section className="studio-band" data-surface="powder" aria-labelledby="fit-title">
        <div className={`studio-width ${styles.split}`}>
          <Reveal variant="section" className={styles.splitColumn}>
            <h2 id="fit-title" className="font-serif">Is it right for your brand?</h2>
            <ul className={styles.checks}>
              {FIT.map(item => <li key={item}>{item}</li>)}
            </ul>
            <p className={styles.note}>Not sure? That is what the fit check is for. If TikTok Shop is not a match, we will say so.</p>
          </Reveal>
          <Reveal variant="section" className={styles.splitColumn}>
            <h2 className="font-serif">How we start</h2>
            <ol className={styles.steps}>
              {STEPS.map(([heading, body], index) => (
                <li key={heading}>
                  <span className={styles.number} aria-hidden="true">{index + 1}</span>
                  <div><h3>{heading}</h3><p>{body}</p></div>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
        <SectionRise surface="white" direction="left" />
      </section>

      <section className="studio-band" data-surface="white" aria-labelledby="faq-title">
        <div className="studio-width">
          <Reveal variant="section" className={styles.heading}>
            <h2 id="faq-title" className="font-serif">Questions</h2>
          </Reveal>
          <div className={styles.faq}>
            {FAQ.map(([question, answer]) => (
              <details key={question}>
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
        <SectionRise surface="navy" />
      </section>

      <section className="studio-band" data-surface="navy" aria-labelledby="closing-title">
        <div className="studio-width">
          <Reveal variant="section" className={styles.heading}>
            <h2 id="closing-title" className="font-serif">Find out if TikTok Shop fits your brand.</h2>
            <p>Thirty minutes, free. Bring your products and your questions.</p>
          </Reveal>
          <nav className={`studio-actions ${styles.actions}`} aria-label="Next steps">
            <a className="pill modular-button" href={bookingUrl} target="_blank" rel="noopener noreferrer">book a free fit check</a>
            <ModularButton href="/work">see our work</ModularButton>
          </nav>
        </div>
        <SectionRise surface="powder-deep" />
      </section>

      <SiteFooter />
    </div>
  )
}
