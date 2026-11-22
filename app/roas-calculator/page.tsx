import type { Metadata } from 'next'
import { ModularButton } from '@/components/modular-button'
import { PageHero } from '@/components/page-hero'
import { Reveal } from '@/components/reveal'
import { RoasCalculator } from '@/components/roas-calculator'
import { SiteFooter } from '@/components/site-footer'
import { SectionRise } from '@/components/home/section-rise'
import { JsonLd, absoluteUrl, breadcrumbJsonLd, defaultSocialImage, siteUrl } from '@/lib/seo'
import services from '../services/services.module.css'
import styles from './roas-calculator.module.css'

const path = '/roas-calculator'
const title = 'ROAS Calculator: What a 4x Return on Ad Spend Takes | Burgama'
const description = 'A free ROAS calculator for Facebook and Instagram ads. Enter your order value and margin to see what a 4x ROAS lets you pay per purchase, and what a month of spend returns.'

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: path },
  openGraph: { title, description, url: path, type: 'website', images: [defaultSocialImage] },
  twitter: { card: 'summary_large_image', title, description, images: [defaultSocialImage] },
}

const faq: [string, string][] = [
  ['What is ROAS?', 'ROAS is return on ad spend: the revenue you get for every $1 you spend on ads. Spend $1000 and sell $4000, and your ROAS is 4x.'],
  ['How do you calculate ROAS?', 'Divide the revenue from your ads by what you spent on them. ROAS = ad revenue / ad spend.'],
  ['What is a good ROAS?', 'It depends on your margin. A good ROAS is one that sits well above the point where an order pays for its own ad. A brand with a 70% margin makes money at 2x. A brand with a 30% margin needs close to 4x to do the same. The calculator shows the number for your margin.'],
  ['Is 4x a good ROAS?', '4x means $4 of revenue for every $1 of ad spend. For most brands with a gross margin above 40%, 4x is clearly profitable. Enter your own margin to see what you keep per order at 4x.'],
  ['How much do I need to spend for Meta ads to work?', 'Meta says an ad set usually leaves the learning phase after about 50 results in a week. Multiply what you can pay for a purchase by 50, then by 4.33 weeks, to get the monthly spend that gives Meta enough purchases to learn from. The calculator does this for you.'],
  ['Does this work for Google ads too?', 'Yes. ROAS, cost per purchase and the margin math are the same on any ad platform. The learning budget line uses Meta’s guideline.'],
]

const appJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  '@id': `${absoluteUrl(path)}#calculator`,
  name: 'ROAS calculator',
  url: absoluteUrl(path),
  description,
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Any',
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

export default function RoasCalculatorPage() {
  return (
    <div className="studio-page">
      <JsonLd data={appJsonLd} />
      <JsonLd data={faqJsonLd} />
      <JsonLd data={breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'ROAS calculator', path }])} />

      <PageHero
        variant="centered"
        wordmark="ROAS calculator"
        titleId="calculator-title"
        intro={['See what a 4x return on ad spend takes. Enter your order value and margin, and get the most you can pay for a purchase, what a month of spend returns, and what you keep.']}
        actions={<ModularButton href="#calculator">open the calculator</ModularButton>}
        nextSurface="powder"
      />

      <section className={`studio-band ${services.band}`} data-surface="powder" id="calculator" aria-labelledby="calculator-heading">
        <div className="studio-width">
          <Reveal variant="section" className={services.heading}>
            <h2 id="calculator-heading" className="font-serif">Start with 4x. Change anything.</h2>
            <p>The numbers below are examples. Replace them with yours.</p>
          </Reveal>
          <RoasCalculator />
        </div>
        <SectionRise surface="white" />
      </section>

      <section className={`studio-band ${services.band}`} data-surface="white" aria-labelledby="how-title">
        <div className="studio-width">
          <div className={styles.prose}>
            <h2 id="how-title" className="font-serif">How the calculator works</h2>
            <p>Most ROAS calculators divide revenue by spend and stop. That tells you what happened. This one starts from the return you want and works back to what you can afford to pay for each purchase.</p>

            <h3 className="font-serif">What you can pay for a purchase</h3>
            <p className={styles.formula}>Cost per purchase = average order value / target ROAS</p>
            <p>At 4x on a $60 order, you can pay up to $15 to get that order. If your ads bring purchases in for less, you are ahead of target.</p>

            <h3 className="font-serif">What you keep</h3>
            <p className={styles.formula}>Contribution per order = (order value x gross margin) - payment fees</p>
            <p>Contribution is what an order leaves after the product and the fees. Take the cost per purchase off that, and you have what the order keeps after the ad. If customers reorder within 90 days, each one is worth more, so you can afford to pay more for the first purchase.</p>

            <h3 className="font-serif">What Meta needs to learn</h3>
            <p className={styles.formula}>Monthly learning budget = cost per purchase x 50 x 4.33</p>
            <p>Meta says an ad set usually leaves the learning phase after about 50 results in a week. Below that, results are less stable and usually cost more. If the learning budget is more than you can spend, optimize for add to carts first. They happen far more often, so Meta learns on a smaller budget.</p>
            <p>Source: <a href="https://www.facebook.com/business/help/112167992830700" rel="noopener noreferrer" target="_blank">Meta Business Help Center, About the learning phase</a>.</p>

            <h3 className="font-serif">Your floor</h3>
            <p className={styles.formula}>Floor = order value / contribution per order</p>
            <p>This is the ROAS where an order only pays for its own ad. It is not a goal. It is the line your target has to clear, and the gap between the two is your profit.</p>
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
            <h2 id="closing-title" className="font-serif">Know your number. We’ll build the ads to hit it.</h2>
            <p>We plan, make and run Facebook and Instagram ads, with the creative made by the same team. Management starts at $750 a month.</p>
          </Reveal>
          <nav className={`studio-actions ${services.actions}`} aria-label="Next steps">
            <ModularButton href="/services/meta-ads">see Meta ads management</ModularButton>
            <ModularButton href="#start-a-project">start a project</ModularButton>
          </nav>
        </div>
        <SectionRise surface="powder-deep" />
      </section>

      <SiteFooter />
    </div>
  )
}
