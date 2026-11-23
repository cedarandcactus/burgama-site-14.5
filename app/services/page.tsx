import type { Metadata } from 'next'
import { ModularButton } from '@/components/modular-button'
import { PageHero } from '@/components/page-hero'
import { Reveal } from '@/components/reveal'
import { SiteFooter } from '@/components/site-footer'
import Link from '@/components/transition-link'
import { SectionRise } from '@/components/home/section-rise'
import { services } from '@/lib/services'
import { JsonLd, absoluteUrl, breadcrumbJsonLd, defaultSocialImage } from '@/lib/seo'
import styles from './services.module.css'

const path = '/services'
const title = 'Austin Marketing Agency: Services and Pricing | Burgama'
const description = 'Burgama is an Austin marketing agency: SEO, websites, social media, paid ads, email, branding and packaging from one team. See what each service includes and costs.'

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: path },
  openGraph: { title, description, url: path, type: 'website', images: [defaultSocialImage] },
  twitter: { card: 'summary_large_image', title, description, images: [defaultSocialImage] },
}

const listJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  '@id': `${absoluteUrl(path)}#services`,
  name: 'Burgama services',
  itemListElement: services.map((service, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: service.name,
    url: absoluteUrl(`/services/${service.slug}`),
  })),
}

export default function ServicesPage() {
  return (
    <div className="studio-page">
      <JsonLd data={listJsonLd} />
      <JsonLd data={breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Services', path }])} />

      <PageHero
        variant="centered"
        wordmark="Austin marketing agency services, from one team"
        titleId="services-title"
        intro={['Strategy, SEO, websites, social, ads, email and brand work, done by the same people. Each page says what is included and what it costs.']}
        actions={<ModularButton href="#start-a-project">start a project</ModularButton>}
        nextSurface="white"
      />

      <section className={`studio-band ${styles.band}`} data-surface="white" aria-labelledby="services-title">
        <div className="studio-width">
          <ul className={styles.index}>
            {services.map((service, index) => (
              <Reveal as="li" delay={index * 50} key={service.slug}>
                <Link className={styles.indexLink} href={`/services/${service.slug}`}>
                  <h2 className="font-serif">{service.name}</h2>
                  <p>{service.summary}</p>
                  <p className={styles.indexPrice}>{service.priceNote}</p>
                </Link>
              </Reveal>
            ))}
          </ul>
          <div className={styles.also}>
            <p>Also:</p>
            <nav className="studio-actions" aria-label="More services">
              <ModularButton href="/ai-visibility-check">free AI visibility check</ModularButton>
              <ModularButton href="/tiktok-shop">TikTok Shop</ModularButton>
              <ModularButton href="/research/roas-calculator">ROAS calculator</ModularButton>
              <ModularButton href="/faq">FAQ and pricing</ModularButton>
            </nav>
          </div>
        </div>
        <SectionRise surface="navy" />
      </section>

      <section className={`studio-band ${styles.band}`} data-surface="navy" aria-labelledby="closing-title">
        <div className="studio-width">
          <Reveal variant="section" className={styles.heading}>
            <h2 id="closing-title" className="font-serif">Not sure which one you need?</h2>
            <p>Tell us what you’re trying to do. You get a discovery call, then a proposal built for your business.</p>
          </Reveal>
          <nav className={`studio-actions ${styles.actions}`} aria-label="Next steps">
            <ModularButton href="#start-a-project">start a project</ModularButton>
            <ModularButton href="/work">see our work</ModularButton>
          </nav>
        </div>
        <SectionRise surface="powder-deep" />
      </section>

      <SiteFooter />
    </div>
  )
}
