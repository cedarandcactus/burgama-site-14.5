import { Fragment } from 'react'
import { ArrowUpRight } from 'lucide-react'
import Link from '@/components/transition-link'
import { PublicationShell, ArticleMetadata, ArticleReferences, ArticleCard, EditorialFigure } from '@/components/editorial-primitives'
import { ideas, type IdeaPost } from '@/lib/editorial'
import { getEditorialDirection, getRelatedIdeas } from '@/lib/editorial-layouts'
import styles from './editorial.module.css'

export function EditorialDetail({ idea }: { idea: IdeaPost }) {
  const direction = getEditorialDirection(idea)
  const related = getRelatedIdeas(idea, ideas)

  return <PublicationShell>
    <article className={styles.article} data-editorial-style={direction.style} aria-labelledby="article-title">
      <header className={styles.articleHeader}>
        <p className={styles.eyebrow}>{idea.categories[0]} <span> / {direction.format}</span></p>
        <h1 id="article-title" className={`${styles.headline} font-serif`}>{idea.title}</h1>
        <p className={styles.deck}>{idea.deck}</p>
        <ArticleMetadata idea={idea} />
      </header>
      {direction.figure && <EditorialFigure figure={direction.figure} />}
      <div className={styles.readingGrid}>
        <aside className={styles.contents} aria-label="Article contents">
          <nav aria-label="In this article">
            <p className={styles.smallHeading}>In this article</p>
            <ol>{direction.sections.map((section, index) => <li key={section.start}><a href={`#section-${index + 1}`}><span>{String(index + 1).padStart(2, '0')}</span>{section.title}</a></li>)}</ol>
          </nav>
          <p className={styles.topics}>{idea.categories.join(' / ')}</p>
        </aside>
        <div className={styles.story}>
          {direction.sections.map((section, index) => <Fragment key={section.start}>
            <section id={`section-${index + 1}`} className={styles.storySection} aria-labelledby={`section-heading-${index + 1}`} tabIndex={-1}>
              <h2 id={`section-heading-${index + 1}`} className="font-serif"><span className={styles.sectionNumber} aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>{section.title}</h2>
              {idea.body.slice(section.start, direction.sections[index + 1]?.start ?? idea.body.length).map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}
              {section.note && <aside className={styles.sideNote}><span className={styles.smallHeading}>Reading note</span><p>{section.note}</p></aside>}
            </section>
            {index === 0 && direction.pullQuote && <blockquote className={`${styles.pullQuote} font-serif`}><p>“{direction.pullQuote}”</p></blockquote>}
          </Fragment>)}
          <ArticleReferences idea={idea} />
          <p className={styles.contextLink}>From the practice: <Link href={idea.internalLink.href}>{idea.internalLink.label.replace(/^Explore /, '')} <ArrowUpRight className={styles.inlineArrow} aria-hidden="true" /></Link></p>
        </div>
      </div>
    </article>
    <section className={styles.related} aria-labelledby="related-title">
      <div className={styles.sectionBar}><h2 id="related-title" className="font-serif">Continue reading</h2><Link href="/research">All articles <ArrowUpRight className={styles.inlineArrow} aria-hidden="true" /></Link></div>
      <div className={styles.relatedGrid}>{related.map(entry => <ArticleCard key={entry.slug} idea={entry} />)}</div>
    </section>
  </PublicationShell>
}
