import { DirectionLink } from '@/components/direction-link'
import { PageHero } from '@/components/page-hero'
import { SectionRise } from '@/components/home/section-rise'
import { SiteFooter } from '@/components/site-footer'
import styles from './legal-page.module.css'

type LegalPageProps = {
  title: string
  current: 'privacy' | 'terms'
  introduction: string
  sections: { id: string; title: string; paragraphs: string[] }[]
}

export function LegalPage({ title, current, introduction, sections }: LegalPageProps) {
  return (
    <div className="studio-page">
      <article aria-labelledby="legal-title">
        <PageHero wordmark={title} titleId="legal-title" compact surface="navy" intro={[introduction]} nextSurface="powder" breadcrumbLabel="Legal pages" breadcrumb={<div className={styles.navigation}><DirectionLink href="/" direction="left" label="home" /><span className="sr-only" aria-current="page">{current}</span><DirectionLink href={current === 'privacy' ? '/terms' : '/privacy'} label={current === 'privacy' ? 'terms' : 'privacy'} /></div>} />
        <div className="studio-band" data-surface="powder">
          <div className={`studio-reading ${styles.document}`}>
            <p className={styles.updated}>Last updated: <time dateTime="2026-09-15">September 15, 2026</time></p>
            <div className={styles.sections}>
              {sections.map(section => <section key={section.id} aria-labelledby={section.id}><h2 id={section.id}>{section.title}</h2>{section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</section>)}
              <section aria-labelledby="legal-contact">
                <h2 id="legal-contact">Questions &amp; contact</h2>
                <p>For questions about {current === 'privacy' ? 'this Privacy Policy or your personal information' : 'these Terms of Service'}, contact Burgama:</p>
                <address className={styles.address}>
                  Email: <a href="mailto:legal@burgama.com">legal@burgama.com</a><br />
                  Phone: <a href="tel:+17137243637">713-724-3637</a><br />
                  Burgama<br />701 Tillery St #12, Mailbox #289<br />Austin, TX 78702
                </address>
                <p>Read our <a href={current === 'privacy' ? '/terms' : '/privacy'}>{current === 'privacy' ? 'Terms of Service' : 'Privacy Policy'}</a> for related information.</p>
              </section>
            </div>
          </div>
          <SectionRise surface="powder-deep" direction="left" />
        </div>
      </article>
      <SiteFooter />
    </div>
  )
}
