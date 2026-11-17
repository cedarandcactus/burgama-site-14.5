import { CardSection } from '@/components/card-section'
import { CircularArrowIcon } from '@/components/circular-arrow-icon'
import { DirectionLink } from '@/components/direction-link'
import Link from '@/components/transition-link'
import { PageHero } from '@/components/page-hero'
import { EditorialArtwork } from '@/components/research-article-artwork'
import { SiteFooter } from '@/components/site-footer'
import { getIdeaReadingTime, ideas, type IdeaPost } from '@/lib/editorial'
import styles from './research-article.module.css'

export function ResearchArticle({ idea }: { idea: IdeaPost }) {
  const currentIndex = ideas.findIndex(entry => entry.slug === idea.slug)
  const related = Array.from({ length: Math.min(3, ideas.length - 1) }, (_, offset) => ideas[(currentIndex + offset + 1) % ideas.length])

  return (
    <div className="studio-page">
      <article aria-labelledby="article-title">
        <PageHero variant="centered" wordmark={idea.title} titleId="article-title" compact backgroundMedia surface="navy" nextSurface="powder" panel={<EditorialArtwork visual={idea.visual} variant="background" />} intro={[idea.deck]} breadcrumbLabel="Back to Research" breadcrumb={<DirectionLink href="/research" direction="left" label="Research" />} metadata={<><p className={styles.categoryPill}>{idea.categories[0]}</p><p>{getIdeaReadingTime(idea)} min read</p></>} />
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
        </div>
      </article>
      <CardSection heading="More research." items={related.map(entry => ({ title: entry.title, href: `/research/${entry.slug}`, image: `/research/cards/${entry.slug}.webp`, alt: `${entry.title}, a Burgama Research article cover.` }))} cta={{ label: 'all research', href: '/research' }} />
      <SiteFooter enquiryHeading="Tell us what you’re thinking" />
    </div>
  )
}
