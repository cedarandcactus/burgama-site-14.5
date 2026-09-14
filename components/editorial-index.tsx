import { ArrowRight } from 'lucide-react'
import Link from '@/components/transition-link'
import { EditorialArtwork } from '@/components/editorial-artwork'
import { SiteFooter } from '@/components/site-footer'
import { getIdeaReadingTime, ideas } from '@/lib/editorial'
import styles from './editorial.module.css'

const broadSections = [
  'AI & Productivity',
  'Email Marketing',
  'Shopify',
  'Web Development',
  'SEO',
] as const

export function EditorialIndex() {
  return (
    <div className={`${styles.indexRoot} font-sans`}>
      <main className={styles.indexMain}>
        <header className={styles.indexHero}>
          <p className={styles.indexEyebrow}>Burgama field notes</p>
          <div className={styles.indexIntro}>
            <h1 className="font-serif">Ideas about business, design, and growth.</h1>
            <p>
              A collection of observations, guides, and practical notes for small
              businesses building online.
            </p>
          </div>
          <ul className={styles.topicList} aria-label="Ideas topics">
            {broadSections.map((section) => (
              <li key={section}>{section}</li>
            ))}
          </ul>
        </header>

        <section className={styles.publication} aria-labelledby="latest-ideas">
          <div className={styles.publicationHeading}>
            <h2 id="latest-ideas" className="font-serif">
              Five useful notes.
            </h2>
            <p>Short reads for making clearer digital decisions.</p>
          </div>

          <div className={styles.ideaGrid}>
            {ideas.map((idea) => (
              <Link
                href={`/ideas/${idea.slug}`}
                className={styles.ideaCard}
                key={idea.slug}
                aria-label={`Read ${idea.title}`}
              >
                <article>
                  <EditorialArtwork
                    visual={idea.visual}
                    className={styles.cardArtwork}
                  />
                  <div className={styles.cardCopy}>
                    <div className={styles.cardMeta}>
                      <span>Note {idea.number}</span>
                      <span>{getIdeaReadingTime(idea)}</span>
                    </div>
                    <h3 className="font-serif">{idea.title}</h3>
                    <p>{idea.metaDescription}</p>
                    <div className={styles.cardFooter}>
                      <ul className={styles.categoryList} aria-label="Topics">
                        {idea.categories.map((category) => (
                          <li key={category}>{category}</li>
                        ))}
                      </ul>
                      <span className={styles.readAction}>
                        Read note
                        <ArrowRight aria-hidden="true" strokeWidth={1.25} />
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
