import { CircularArrowIcon } from '@/components/circular-arrow-icon'
import Link from '@/components/transition-link'
import { SiteFooter } from '@/components/site-footer'
import {
  getIdeaReadingTime,
  ideas,
  type IdeaPost,
} from '@/lib/editorial'
import styles from './editorial.module.css'

export function EditorialDetail({ idea }: { idea: IdeaPost }) {
  const currentIndex = ideas.findIndex((entry) => entry.slug === idea.slug)
  const previous = currentIndex > 0 ? ideas[currentIndex - 1] : undefined
  const next = currentIndex < ideas.length - 1 ? ideas[currentIndex + 1] : undefined

  return (
    <div className={styles.detailPage}>
      <header className={styles.articleHero}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/ideas">back to ideas</Link>
        </nav>

        <div className={styles.articleHeading}>
          <p className={styles.categoryPill}>{idea.categories[0]}</p>
          <h1 className="font-serif">{idea.title}</h1>
          <p className={styles.articleDeck}>{idea.deck}</p>
          <p className={styles.readingTime}>{getIdeaReadingTime(idea)} min read</p>
        </div>
      </header>

      <main className={styles.readingSection}>
        <article className={styles.articleBody}>
          {idea.body.map((paragraph, index) => <p key={`${idea.slug}-${index}`}>{paragraph}</p>)}

          <Link href={idea.internalLink.href} className={styles.internalLink}>
            <span>{idea.internalLink.label}</span>
            <CircularArrowIcon className={styles.inlineArrow} />
          </Link>

          <details className={styles.sources}>
            <summary>Sources and further reading</summary>
            <ul>
              {idea.sources.map((source) => (
                <li key={source.href}>
                  <a href={source.href} target="_blank" rel="noreferrer">{source.label}</a>
                </li>
              ))}
            </ul>
          </details>
        </article>
      </main>

      <nav className={styles.articleNavigation} aria-label="More ideas">
        {previous ? (
          <Link href={`/ideas/${previous.slug}`} className={styles.articleNavLink}>
            <span className={styles.navDot} aria-hidden="true" />
            <span>
              <small>Previous</small>
              <strong className="font-serif">{previous.title}</strong>
            </span>
          </Link>
        ) : <span aria-hidden="true" />}

        <Link href={next ? `/ideas/${next.slug}` : '/ideas'} className={styles.articleNavLink}>
          <span className={styles.navDot} aria-hidden="true" />
          <span>
            <small>{next ? 'Next' : 'All ideas'}</small>
            <strong className="font-serif">{next?.title ?? 'Return to the index'}</strong>
          </span>
        </Link>
      </nav>

      <SiteFooter />
    </div>
  )
}
