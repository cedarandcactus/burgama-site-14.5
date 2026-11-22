import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ModularButton } from '@/components/modular-button'
import { PageHero } from '@/components/page-hero'
import { Reveal } from '@/components/reveal'
import { SiteFooter } from '@/components/site-footer'
import Link from '@/components/transition-link'
import { SectionRise } from '@/components/home/section-rise'
import { getProject, type Project } from '@/lib/projects'
import { getService, services, type ServiceSection, type ServiceSurface } from '@/lib/services'
import { JsonLd, absoluteUrl, breadcrumbJsonLd, defaultSocialImage, siteUrl } from '@/lib/seo'
import styles from '../services.module.css'

const SURFACE_CYCLE: ServiceSurface[] = ['navy', 'blue-slate', 'powder', 'white']

export function generateStaticParams() {
  return services.map(service => ({ slug: service.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const service = getService(slug)
  if (!service) return { title: 'Services' }
  const path = `/services/${service.slug}`
  return {
    title: { absolute: service.title },
    description: service.description,
    alternates: { canonical: path },
    openGraph: { title: service.title, description: service.description, url: path, type: 'website', images: [defaultSocialImage] },
    twitter: { card: 'summary_large_image', title: service.title, description: service.description, images: [defaultSocialImage] },
  }
}

function SectionBody({ section, id }: { section: ServiceSection; id: string }) {
  if (section.kind === 'rows') {
    return (
      <div className="studio-width">
        <Reveal variant="section" className={styles.heading}>
          <h2 id={id} className="font-serif">{section.title}</h2>
          {section.intro && <p>{section.intro}</p>}
        </Reveal>
        <ol className={styles.cards}>
          {section.items.map(([heading, body], index) => (
            <Reveal as="li" className={styles.card} delay={index * 60} key={heading}>
              <h3 className="font-serif">{heading}</h3>
              <p>{body}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    )
  }

  if (section.kind === 'packages') {
    return (
      <div className="studio-width">
        <Reveal variant="section" className={styles.heading}>
          <h2 id={id} className="font-serif">{section.title}</h2>
          {section.intro && <p>{section.intro}</p>}
        </Reveal>
        <div className={styles.packages} data-count={section.items.length}>
          {section.items.map((item, index) => (
            <Reveal className={styles.package} delay={index * 80} key={item.name}>
              <div className={styles.packageHeader}>
                <h3 className="font-serif">{item.name}</h3>
                <p className={styles.price}>
                  <span className={`${styles.priceAmount} font-serif`}>{item.price}</span>
                  <span className={styles.pricePeriod}>{item.period}</span>
                </p>
              </div>
              <p className={styles.packageBody}>{item.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    )
  }

  if (section.kind === 'feature') {
    return (
      <div className={`studio-width ${styles.feature}`} data-solo={!section.points || undefined}>
        <Reveal variant="section" className={styles.featureCopy}>
          <h2 id={id} className="font-serif">{section.title}</h2>
          {section.body.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
        </Reveal>
        {section.points && (
          <Reveal>
            <dl className={styles.points}>
              {section.points.map(([term, detail]) => (
                <div key={term}>
                  <dt>{term}</dt>
                  <dd>{detail}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        )}
      </div>
    )
  }

  return (
    <div className={`studio-width ${styles.split}`}>
      <Reveal variant="section" className={styles.splitColumn}>
        <h2 id={id} className="font-serif">{section.checksTitle}</h2>
        <ul className={styles.checks}>
          {section.checks.map(item => <li key={item}>{item}</li>)}
        </ul>
        {section.note && <p className={styles.note}>{section.note}</p>}
      </Reveal>
      <Reveal variant="section" className={styles.splitColumn}>
        <h2 className="font-serif">{section.stepsTitle}</h2>
        <ol className={styles.steps}>
          {section.steps.map(([heading, body], index) => (
            <li key={heading}>
              <span className={styles.number} aria-hidden="true">{index + 1}</span>
              <div><h3>{heading}</h3><p>{body}</p></div>
            </li>
          ))}
        </ol>
      </Reveal>
    </div>
  )
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const service = getService(slug)
  if (!service) notFound()

  const path = `/services/${service.slug}`
  const url = absoluteUrl(path)
  const work = service.work.map(getProject).filter((project): project is Project => Boolean(project))

  // Order: what you get, then proof, then pricing and process. Bands alternate
  // through the studio surfaces; the FAQ never sits on navy because the closing band does.
  const [first, ...rest] = service.sections
  const bands: (ServiceSection | 'work')[] = [first, 'work', ...rest]
  const surfaces: ServiceSurface[] = Array.from({ length: bands.length + 1 }, (_, index) => SURFACE_CYCLE[index % SURFACE_CYCLE.length])
  if (surfaces[bands.length] === 'navy') surfaces[bands.length] = 'powder'
  const faqSurface = surfaces[bands.length]

  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${url}#service`,
    name: service.name,
    serviceType: service.serviceType,
    description: service.description,
    provider: { '@id': `${siteUrl}/#organization` },
    areaServed: [
      { '@type': 'City', name: 'Austin', containedInPlace: { '@type': 'State', name: 'Texas' } },
      { '@type': 'Country', name: 'United States' },
    ],
    url,
    ...(service.offers && {
      offers: service.offers.map(offer => ({
        '@type': 'Offer',
        name: offer.name,
        price: offer.price,
        priceCurrency: 'USD',
        url,
      })),
    }),
  }
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${url}#faq`,
    mainEntity: service.faq.map(([question, answer]) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  }

  return (
    <div className="studio-page">
      <JsonLd data={serviceJsonLd} />
      <JsonLd data={faqJsonLd} />
      <JsonLd data={breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Services', path: '/services' }, { name: service.name, path }])} />

      <PageHero
        variant="centered"
        wordmark={service.h1}
        titleId="service-title"
        intro={[service.intro]}
        breadcrumb={<Link href="/services">Services</Link>}
        actions={<>
          <ModularButton href="#start-a-project">start a project</ModularButton>
          <ModularButton href="#work">see the work</ModularButton>
        </>}
        nextSurface={surfaces[0]}
      />

      {bands.map((band, index) => {
        const next = surfaces[index + 1]
        const direction = index % 2 === 0 ? 'left' : 'right'
        if (band === 'work') {
          return (
            <section className={`studio-band ${styles.band}`} data-surface={surfaces[index]} id="work" aria-labelledby="work-title" key="work">
              <div className="studio-width">
                <Reveal variant="section" className={styles.heading}>
                  <h2 id="work-title" className="font-serif">{service.workTitle}</h2>
                </Reveal>
                <ul className={styles.work} data-count={work.length}>
                  {work.map((project, workIndex) => (
                    <Reveal as="li" delay={workIndex * 70} key={project.slug}>
                      <Link className={styles.workLink} href={`/work/${project.slug}`}>
                        <div className={styles.workImage}>
                          <img src={project.cardImage} alt={project.cardAlt} loading="lazy" decoding="async" />
                        </div>
                        <h3 className="font-serif">{project.title}</h3>
                        <p className={styles.workSummary}>{project.summary}</p>
                      </Link>
                    </Reveal>
                  ))}
                </ul>
                <div className={styles.workMore}>
                  <nav className="studio-actions" aria-label="More work"><ModularButton href="/work">see all work</ModularButton></nav>
                </div>
              </div>
              <SectionRise surface={next} direction={direction} />
            </section>
          )
        }
        const id = `section-${index + 1}`
        return (
          <section className={`studio-band ${styles.band}`} data-surface={surfaces[index]} aria-labelledby={id} key={id}>
            <SectionBody section={band} id={id} />
            <SectionRise surface={next} direction={direction} />
          </section>
        )
      })}

      <section className={`studio-band ${styles.band}`} data-surface={faqSurface} aria-labelledby="faq-title">
        <div className="studio-width">
          <Reveal variant="section" className={styles.heading}>
            <h2 id="faq-title" className="font-serif">Questions</h2>
          </Reveal>
          <div className={styles.faq}>
            {service.faq.map(([question, answer]) => (
              <details key={question}>
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
        <SectionRise surface="navy" />
      </section>

      <section className={`studio-band ${styles.band}`} data-surface="navy" aria-labelledby="closing-title">
        <div className="studio-width">
          <Reveal variant="section" className={styles.heading}>
            <h2 id="closing-title" className="font-serif">{service.closing.title}</h2>
            <p>{service.closing.body}</p>
          </Reveal>
          <nav className={`studio-actions ${styles.actions}`} aria-label="Next steps">
            <ModularButton href="#start-a-project">start a project</ModularButton>
            {service.closing.link
              ? <ModularButton href={service.closing.link.href}>{service.closing.link.label}</ModularButton>
              : <ModularButton href="/services">all services</ModularButton>}
          </nav>
        </div>
        <SectionRise surface="powder-deep" />
      </section>

      <SiteFooter />
    </div>
  )
}
