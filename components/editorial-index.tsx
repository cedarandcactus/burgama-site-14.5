import Link from '@/components/transition-link'
import { SiteFooter } from '@/components/site-footer'
import { ideas } from '@/lib/editorial'
import styles from './editorial.module.css'

export function EditorialIndex() {
  return (
    <div className={styles.indexPage}>
      <header className={styles.indexHero} aria-labelledby="ideas-title">
        <h1 id="ideas-title" className="font-serif">Ideas.</h1>
        <p>Practical notes from the work on websites, ecommerce, search, and the systems around them.</p>
      </header>

      <main className={styles.publication}>
        <h2 className="sr-only">All ideas</h2>
        <ul className={styles.ideaList}>
          {ideas.map((idea) => (
            <li key={idea.slug}>
              <Link href={`/ideas/${idea.slug}`} className={styles.ideaLink}>
                <span className={styles.ideaDot} aria-hidden="true" />
                <article className={styles.ideaEntry}>
                  <p className={styles.categoryPill}>{idea.categories[0]}</p>
                  <h3 className="font-serif">{idea.title}</h3>
                  <p className={styles.ideaDeck}>{idea.deck}</p>
                </article>
              </Link>
            </li>
          ))}
        </ul>
      </main>

      <SiteFooter />
    </div>
  )
}
