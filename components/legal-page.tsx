import Link from '@/components/transition-link'
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
        <PageHero wordmark={title} titleId="legal-title" compact surface="navy" intro={[introduction]} nextSurface="powder" breadcrumbLabel="Legal pages" breadcrumb={<div className={styles.navigation}><Link href="/privacy" aria-current={current === 'privacy' ? 'page' : undefined}>privacy</Link><Link href="/terms" aria-current={current === 'terms' ? 'page' : undefined}>terms</Link></div>} />
        <div className="studio-band" data-surface="powder">
          <div className={`studio-reading ${styles.document}`}>
            <aside className={styles.notice} aria-label="Draft notice">
              <p className={styles.noticeLabel}>draft for review</p>
              <p>This is proposed wording, not a final legal document. It has not taken effect. Confirm the details and obtain legal review before publishing it as an adopted policy.</p>
            </aside>
            <div className={styles.sections}>
              {sections.map(section => <section key={section.id} aria-labelledby={section.id}><h2 id={section.id}>{section.title}</h2>{section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</section>)}
              <section aria-labelledby="legal-contact">
                <h2 id="legal-contact">questions &amp; contact</h2>
                <p>For questions about this draft, contact <a href="mailto:hello@burgama.com">hello@burgama.com</a> or write to:</p>
                <address className={styles.address}>Burgama<br />701 Tillery St #12, Mailbox #289<br />Austin, TX 78702</address>
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
