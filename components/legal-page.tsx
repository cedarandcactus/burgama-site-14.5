import Link from '@/components/transition-link'
import { PageHero } from '@/components/page-hero'
import { SectionRise } from '@/components/home/section-rise'
import { SiteFooter } from '@/components/site-footer'
import styles from './legal-page.module.css'

type Policy = 'cookies' | 'privacy' | 'terms'

type LegalPageProps = {
  title: string
  current: Policy
  introduction: string
  sections: { id: string; title: string; paragraphs: string[] }[]
}

const policies: { id: Policy; label: string; href: string }[] = [
  { id: 'cookies', label: 'Cookies', href: '/cookies' },
  { id: 'privacy', label: 'Privacy', href: '/privacy' },
  { id: 'terms', label: 'Terms', href: '/terms' },
]

const policyNames: Record<Policy, string> = {
  cookies: 'this Cookie Policy or your cookie choices',
  privacy: 'this Privacy Policy or your personal information',
  terms: 'these Terms of Service',
}

export function LegalPage({ title, current, introduction, sections }: LegalPageProps) {
  const relatedPolicies = policies.filter((policy) => policy.id !== current)

  return (
    <div className="studio-page">
      <article aria-labelledby="legal-title">
        <PageHero
          variant="centered"
          wordmark={title}
          titleId="legal-title"
          compact
          surface="navy"
          intro={[introduction]}
          nextSurface="powder"
          breadcrumbLabel="Legal pages"
          breadcrumb={
            <div className={styles.navigation}>
              <Link href="/">Home</Link>
              {policies.map((policy) => (
                <Link key={policy.id} href={policy.href} aria-current={policy.id === current ? 'page' : undefined}>
                  {policy.label}
                </Link>
              ))}
            </div>
          }
        />
        <div className="studio-band" data-surface="powder">
          <div className={`studio-reading ${styles.document}`}>
            <p className={styles.updated}>Last updated <time dateTime="2026-09-15">September 15, 2026</time></p>
            <div className={styles.sections}>
              {sections.map((section) => (
                <section key={section.id} aria-labelledby={section.id}>
                  <h2 id={section.id}>{section.title}</h2>
                  {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </section>
              ))}
              <section aria-labelledby="legal-contact">
                <h2 id="legal-contact">Questions &amp; contact</h2>
                <p>For questions about {policyNames[current]}, contact Burgama:</p>
                <address className={styles.address}>
                  Email: <a href="mailto:legal@burgama.com">legal@burgama.com</a><br />
                  Phone: <a href="tel:+17137243637">713-724-3637</a><br />
                  Burgama<br />701 Tillery St #12, Mailbox #289<br />Austin, TX 78702
                </address>
                <nav className={styles.relatedPolicies} aria-label="Related policies">
                  <span>Related:</span>
                  {relatedPolicies.map((policy) => <Link key={policy.id} href={policy.href}>{policy.label}</Link>)}
                </nav>
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
