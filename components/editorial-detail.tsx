import { CircularArrowIcon } from '@/components/circular-arrow-icon'
import Link from '@/components/transition-link'
import { EditorialArtwork } from '@/components/editorial-artwork'
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
    <div className={styles.detailPage} data-theme={idea.theme}>
      <header className={styles.articleHero}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/ideas">Ideas</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Note {idea.issue}</span>
        </nav>

        <div className={styles.articleHeading}>
          <div className={styles.articleTitleBlock}>
            <p className={styles.articleLabel}>BURGAMA / IDEAS / {idea.issue}</p>
            <h1 className="font-serif">{idea.title}</h1>
          </div>
          <div className={styles.articleIntroduction}>
            <p>{idea.deck}</p>
            <div className={styles.articleMeta}>
              <span>{getIdeaReadingTime(idea)} min read</span>
              <span>{idea.targetKeyword}</span>
            </div>
          </div>
        </div>
      </header>

      <div className={styles.detailArtwork}>
        <EditorialArtwork idea={idea} />
      </div>

      <section className={styles.readingSection} aria-label="Article">
        <div className={styles.articleGrid}>
          <aside className={styles.articleAside} aria-label="Article categories">
            <p>Filed under</p>
            <ul>
              {idea.categories.map((category) => <li key={category}>{category}</li>)}
            </ul>
          </aside>

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
        </div>
      </section>

      <nav className={styles.articleNavigation} aria-label="More ideas">
        {previous ? (
          <Link href={`/ideas/${previous.slug}`} className={styles.articleNavLink}>
            <span className={styles.articleNavDirection}>
              <CircularArrowIcon className={styles.navArrow} />
              <span>Previous note</span>
            </span>
            <strong className="font-serif">{previous.title}</strong>
          </Link>
        ) : <span aria-hidden="true" />}

        <Link href={next ? `/ideas/${next.slug}` : '/ideas'} className={styles.articleNavLink}>
          <span className={styles.articleNavDirection}>
            <span>{next ? 'Next note' : 'All ideas'}</span>
            <CircularArrowIcon className={styles.navArrow} />
          </span>
          <strong className="font-serif">{next?.title ?? 'Return to the index'}</strong>
        </Link>
      </nav>

      <SiteFooter />
    </div>
  )
}
