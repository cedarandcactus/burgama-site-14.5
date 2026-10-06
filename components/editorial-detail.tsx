import { Fragment } from 'react'
import { ArrowUpRight } from 'lucide-react'
import Link from '@/components/transition-link'
import { PublicationShell, ArticleMetadata, ArticleReferences, ArticleCard, EditorialFigure, EditorialMedia, EditorialEvidence } from '@/components/editorial-primitives'
import { ideas, type IdeaPost } from '@/lib/editorial'
import { getEditorialDirection, getRelatedIdeas } from '@/lib/editorial-layouts'
import styles from './editorial.module.css'

export function EditorialDetail({ idea }: { idea: IdeaPost }) {
  const direction = getEditorialDirection(idea)
  const related = getRelatedIdeas(idea, ideas)

  return <PublicationShell mode={direction.style}>
    <article className={styles.article} data-editorial-style={direction.style} data-opening={direction.opening ?? 'split'} aria-labelledby="article-title">
      <header className={styles.articleHeader}>
        <Link href="/research" className={styles.section}>{idea.categories[0]}</Link>
        <h1 id="article-title" className={`${styles.headline} ${direction.style === 'journal' ? 'font-serif' : 'font-sans'}`}>{idea.title}</h1>
        <p className={styles.deck}>{idea.deck}</p>
        <ArticleMetadata idea={idea} />
      </header>
      {direction.media && <EditorialMedia media={direction.media} />}
      {direction.figure && <EditorialFigure figure={direction.figure} />}
      <div className={styles.readingGrid}>
        {direction.sections.map((section, index) => <Fragment key={section.start}>
          <section id={`section-${index + 1}`} className={styles.storySection} aria-labelledby={`section-heading-${index + 1}`} tabIndex={-1}>
            <h2 id={`section-heading-${index + 1}`} className="font-serif">{section.title}</h2>
            {idea.body.slice(section.start, direction.sections[index + 1]?.start ?? idea.body.length).map((paragraph, paragraphIndex) => <p className="font-serif" key={paragraphIndex}>{paragraph}</p>)}
          </section>
          {index === 0 && direction.pullQuote && <blockquote className={`${styles.pullQuote} font-serif`}><p>“{direction.pullQuote}”</p></blockquote>}
          {index === 1 && direction.evidence && <EditorialEvidence evidence={direction.evidence} />}
        </Fragment>)}
        <ArticleReferences idea={idea} />
        <p className={styles.contextLink}>From the practice: <Link href={idea.internalLink.href}>{idea.internalLink.label.replace(/^Explore /, '')} <ArrowUpRight className={styles.inlineArrow} aria-hidden="true" /></Link></p>
      </div>
    </article>
    <section className={styles.related} aria-labelledby="related-title">
      <div className={styles.sectionBar}><h2 id="related-title">Further reading</h2><Link href="/research">All research <ArrowUpRight className={styles.inlineArrow} aria-hidden="true" /></Link></div>
      <div className={styles.relatedGrid}>{related.map(entry => <ArticleCard key={entry.slug} idea={entry} />)}</div>
    </section>
  </PublicationShell>
}
