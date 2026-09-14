import { ArrowLeft, ArrowRight } from 'lucide-react'
import Link from '@/components/transition-link'
import { EditorialArtwork } from '@/components/editorial-artwork'
import { SiteFooter } from '@/components/site-footer'
import { getIdeaReadingTime, ideas, type IdeaPost } from '@/lib/editorial'
import styles from './editorial.module.css'

export function EditorialArticle({ idea }: { idea: IdeaPost }) {
  const ideaIndex = ideas.findIndex((entry) => entry.slug === idea.slug)
  const previousIdea = ideaIndex > 0 ? ideas[ideaIndex - 1] : undefined
  const nextIdea = ideaIndex < ideas.length - 1 ? ideas[ideaIndex + 1] : undefined

  return (
    <div className={`${styles.detailRoot} font-sans`}>
      <main>
        <header className={styles.detailHeader} data-theme={idea.theme}>
          <div className={styles.detailHeaderInner}>
            <Link href="/ideas" className={styles.breadcrumb}>
              <ArrowLeft aria-hidden="true" strokeWidth={1.25} />
              All ideas
            </Link>

            <div className={styles.detailTitleGrid}>
              <div>
                <div className={styles.detailMeta}>
                  <span>Field note {idea.number}</span>
                  <span>{getIdeaReadingTime(idea)}</span>
                </div>
                <h1 className="font-serif">{idea.title}</h1>
              </div>
              <div className={styles.detailIntroduction}>
                <p>{idea.metaDescription}</p>
                <ul className={styles.detailCategories} aria-label="Topics">
                  {idea.categories.map((category) => (
                    <li key={category}>{category}</li>
                  ))}
                </ul>
              </div>
            </div>

            <EditorialArtwork
              visual={idea.visual}
              className={styles.detailArtwork}
            />
          </div>
        </header>

        <div className={styles.articleShell}>
          <aside className={styles.articleRail} aria-label="Article details">
            <div>
              <span>Topic</span>
              <strong>{idea.categories.join(' · ')}</strong>
            </div>
            <div>
              <span>Reading time</span>
              <strong>{getIdeaReadingTime(idea)}</strong>
            </div>
          </aside>

          <article className={styles.articleProse}>
            {idea.body.map((paragraph, index) => (
              <p className={index === 0 ? styles.articleLead : undefined} key={paragraph}>
                {paragraph}
              </p>
            ))}

            <section className={styles.sourceBlock} aria-labelledby="sources-title">
              <h2 id="sources-title" className="font-serif">
                Sources and references.
              </h2>
              <ul>
                {idea.sources.map((source) => (
                  <li key={source.href}>
                    <a href={source.href} target="_blank" rel="noreferrer">
                      {source.label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>

            <Link href={idea.internalLink.href} className={styles.internalLink}>
              {idea.internalLink.label}
              <ArrowRight aria-hidden="true" strokeWidth={1.25} />
            </Link>
          </article>
        </div>

        <nav className={styles.articleNavigation} aria-label="More ideas">
          {previousIdea ? (
            <Link href={`/ideas/${previousIdea.slug}`} className={styles.articleNavLink}>
              <span className={styles.articleNavDirection}>
                <ArrowLeft aria-hidden="true" strokeWidth={1.25} />
                Previous note
              </span>
              <strong className="font-serif">{previousIdea.title}</strong>
            </Link>
          ) : (
            <span aria-hidden="true" />
          )}
          {nextIdea ? (
            <Link href={`/ideas/${nextIdea.slug}`} className={styles.articleNavLink}>
              <span className={styles.articleNavDirection}>
                Next note
                <ArrowRight aria-hidden="true" strokeWidth={1.25} />
              </span>
              <strong className="font-serif">{nextIdea.title}</strong>
            </Link>
          ) : (
            <span aria-hidden="true" />
          )}
        </nav>
      </main>
      <SiteFooter />
    </div>
  )
}
