import { CircularArrowIcon } from '@/components/circular-arrow-icon'
import { DirectionLink } from '@/components/direction-link'
import Link from '@/components/transition-link'
import { PageHero } from '@/components/page-hero'
import { EditorialArtwork } from '@/components/editorial-artwork'
import { SectionRise } from '@/components/home/section-rise'
import { SiteFooter } from '@/components/site-footer'
import { getIdeaReadingTime, ideas, type IdeaPost } from '@/lib/editorial'
import styles from './editorial.module.css'

export function EditorialDetail({ idea }: { idea: IdeaPost }) {
  const currentIndex = ideas.findIndex(entry => entry.slug === idea.slug)
  const previous = currentIndex > 0 ? ideas[currentIndex - 1] : undefined
  const next = currentIndex < ideas.length - 1 ? ideas[currentIndex + 1] : undefined

  return (
    <div className="studio-page">
      <article aria-labelledby="article-title">
        <PageHero wordmark={idea.title} titleId="article-title" compact surface="navy" nextSurface="powder" panel={<EditorialArtwork visual={idea.visual} variant="hero" />} intro={[idea.deck]} breadcrumbLabel="Back to ideas" breadcrumb={<DirectionLink href="/ideas" direction="left" label="ideas" />} metadata={<><p className={styles.categoryPill}>{idea.categories[0]}</p><p>{getIdeaReadingTime(idea)} min read</p></>} />
        <div className="studio-band" data-surface="powder">
          <div className={`studio-reading ${styles.articleBody}`}>
            {idea.body.map((paragraph, index) => <p key={`${idea.slug}-${index}`}>{paragraph}</p>)}
            <div className="studio-actions">
              <Link href={idea.internalLink.href} className={`pill ${styles.internalLink}`}><span>{idea.internalLink.label}</span><CircularArrowIcon className={styles.inlineArrow} /></Link>
            </div>
            <details className={styles.sources}>
              <summary>Sources and further reading</summary>
              <ul>{idea.sources.map(source => <li key={source.href}><a href={source.href} target="_blank" rel="noreferrer">{source.label}</a></li>)}</ul>
            </details>
          </div>
          <SectionRise surface="blue-slate" direction="left" />
        </div>
      </article>
      <section className="studio-band" data-surface="blue-slate" aria-label="More ideas">
        <nav className="studio-width studio-sequence" aria-label="Browse ideas">
          {previous && <DirectionLink href={`/ideas/${previous.slug}`} direction="left" rel="prev" eyebrow="previous" label={previous.title} />}
          <DirectionLink href={next ? `/ideas/${next.slug}` : '/ideas'} rel={next ? 'next' : undefined} eyebrow={next ? 'next' : undefined} label={next?.title ?? 'all ideas'} />
        </nav>
        <SectionRise surface="powder-deep" />
      </section>
      <SiteFooter enquiryHeading="tell us what you’re thinking" />
    </div>
  )
}
