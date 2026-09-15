import { CircularArrowIcon } from '@/components/circular-arrow-icon'
import Link from '@/components/transition-link'
import { EditorialArtwork } from '@/components/editorial-artwork'
import { SiteFooter } from '@/components/site-footer'
import { getIdeaReadingTime, ideas } from '@/lib/editorial'
import styles from './editorial.module.css'

const cardLayouts = [
  { size: 'eight', layout: 'wide' },
  { size: 'four', layout: 'tall' },
  { size: 'five', layout: 'tall' },
  { size: 'seven', layout: 'wide' },
  { size: 'four', layout: 'tall' },
  { size: 'eight', layout: 'wide' },
] as const

export function EditorialIndex() {
  return (
    <div className={styles.indexPage}>
      <header className={styles.indexHero} aria-labelledby="ideas-title">
        <div className={styles.heroRail}>
          <span>BURGAMA / IDEAS</span>
          <span>FIELD NOTES 01—06</span>
        </div>
        <div className={styles.heroBody}>
          <h1 id="ideas-title" className="font-serif">Ideas.</h1>
          <p>Practical notes on websites, ecommerce, search, and the systems around them. Written from the work, not around it.</p>
        </div>
      </header>

      <section className={styles.publication} aria-labelledby="publication-title">
        <div className={styles.publicationHeading}>
          <p>Six notes / one useful decision at a time</p>
          <h2 id="publication-title" className="font-serif">What held up when we checked.</h2>
          <p>Comparisons, diagnostics, and working rules for the decisions that tend to slow teams down.</p>
        </div>

        <div className={styles.posterGrid}>
          {ideas.map((idea, index) => {
            const layout = cardLayouts[index]

            return (
              <Link
                href={`/ideas/${idea.slug}`}
                className={styles.posterCard}
                data-size={layout.size}
                key={idea.slug}
              >
                <article className={styles.posterArticle} data-layout={layout.layout} data-theme={idea.theme}>
                  <EditorialArtwork idea={idea} />
                  <div className={styles.posterCopy}>
                    <div className={styles.posterMeta}>
                      <span>NOTE {idea.issue}</span>
                      <span>{getIdeaReadingTime(idea)} MIN READ</span>
                    </div>
                    <h3 className="font-serif">{idea.title}</h3>
                    <p className={styles.posterDeck}>{idea.deck}</p>
                    <div className={styles.posterFooter}>
                      <ul aria-label="Article categories">
                        {idea.categories.map((category) => <li key={category}>{category}</li>)}
                      </ul>
                      <span className={styles.readAction}>
                        <span>Read note</span>
                        <CircularArrowIcon className={styles.cardArrow} />
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            )
          })}
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
