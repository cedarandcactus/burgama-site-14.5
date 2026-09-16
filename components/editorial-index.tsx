import Link from '@/components/transition-link'
import { PageHero } from '@/components/page-hero'
import { SectionRise } from '@/components/home/section-rise'
import { SiteFooter } from '@/components/site-footer'
import { ideas } from '@/lib/editorial'
import styles from './editorial.module.css'

export function EditorialIndex() {
  return (
    <div className="studio-page">
      <PageHero wordmark="ideas." titleId="ideas-title" surface="navy" nextSurface="powder" intro={['Practical notes from the work on websites, ecommerce, search, and the systems around them.']} />
      <section className="studio-band" data-surface="powder" aria-label="All ideas">
        <ul className={`studio-width ${styles.ideaList}`}>
          {ideas.map(idea => <li key={idea.slug}>
            <Link href={`/ideas/${idea.slug}`} className={styles.ideaLink}>
              <span className={styles.ideaDot} aria-hidden="true" />
              <article className={styles.ideaEntry}>
                <p className={styles.categoryPill}>{idea.categories[0]}</p>
                <h2>{idea.title}</h2>
                <p className={styles.ideaDeck}>{idea.deck}</p>
              </article>
            </Link>
          </li>)}
        </ul>
        <SectionRise surface="powder-deep" direction="left" />
      </section>
      <SiteFooter enquiryHeading="tell us what you’re thinking" />
    </div>
  )
}
