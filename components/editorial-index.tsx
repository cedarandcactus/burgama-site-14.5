import Link from '@/components/transition-link'
import { PageHero } from '@/components/page-hero'
import { EditorialArtwork } from '@/components/editorial-artwork'
import { SectionRise } from '@/components/home/section-rise'
import { SiteFooter } from '@/components/site-footer'
import { getIdeaReadingTime, ideas } from '@/lib/editorial'
import styles from './editorial.module.css'

export function EditorialIndex() {
  return (
    <div className="studio-page">
      <PageHero
        variant="centered"
        wordmark="A closer look at the decisions behind better digital work."
        titleId="research-title"
        surface="navy"
        nextSurface="powder"
        intro={['Practical observations and analysis from our work on websites, ecommerce, and search. What we test, what we question, and how it informs the next decision.']}
      />
      <section className="studio-band" data-surface="powder" aria-label="All research articles">
        <ul className={`studio-width ${styles.ideaList}`}>
          {ideas.map(idea => (
            <li key={idea.slug}>
              <Link href={`/research/${idea.slug}`} className={styles.ideaLink} aria-label={idea.title}>
                <EditorialArtwork visual={idea.visual} />
                <article className={styles.ideaEntry}>
                  <p className={styles.categoryPill}>{idea.categories[0]}</p>
                  <h2 className="font-serif">{idea.title}</h2>
                  <p className={styles.ideaDeck}>{idea.deck}</p>
                  <p className={styles.readingTime}>{getIdeaReadingTime(idea)} min read</p>
                </article>
              </Link>
            </li>
          ))}
        </ul>
        <SectionRise surface="powder-deep" direction="left" />
      </section>
      <SiteFooter enquiryHeading="Tell us what you’re thinking" />
    </div>
  )
}
