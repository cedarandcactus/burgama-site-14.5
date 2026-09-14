import Link from '@/components/transition-link'
import { EditorialArtwork } from '@/components/editorial-artwork'
import { SiteFooter } from '@/components/site-footer'
import { getAdjacentIdeas, type Idea } from '@/lib/editorial'
import styles from './editorial.module.css'

export function EditorialDetail({ idea }: { idea: Idea }) {
  const { previous, next } = getAdjacentIdeas(idea.slug)

  return (
    <div className={styles.detailRoot}>
      <main>
        <header className={styles.detailHeader} data-theme={idea.theme}>
          <div className={styles.detailHeaderInner}>
            <nav className={styles.breadcrumb} aria-label="Breadcrumb">
              <Link href="/ideas">ideas</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{idea.category}</span>
            </nav>
            <div className={styles.detailMeta}><span>{idea.category}</span><span>{idea.meta}</span></div>
            <h1 className="font-serif text-balance">{idea.title}</h1>
            <p className={styles.detailDek}>{idea.dek}</p>
            <EditorialArtwork visual={idea.visual} className={styles.detailArtwork} />
          </div>
        </header>

        <article className={styles.articleBody}>
          <p className={styles.articleLead}>{idea.thesis}</p>
          {idea.sections.map(section => (
            <section key={section.heading} className={styles.articleSection}>
              <h2 className="font-serif text-balance">{section.heading}</h2>
              <div className={styles.articleProse}>
                {section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
              </div>
              {section.pullQuote && <blockquote><p className="font-serif text-balance">{section.pullQuote}</p></blockquote>}
            </section>
          ))}
          <p className={styles.articleClosing}>{idea.closing}</p>
        </article>

        <nav className={styles.articleNavigation} aria-label="More ideas">
          {previous ? <Link href={`/ideas/${previous.slug}`} className={styles.previousIdea}><span>Previous idea</span><strong className="font-serif">{previous.title}</strong></Link> : <span />}
          {next ? <Link href={`/ideas/${next.slug}`} className={styles.nextIdea}><span>Next idea</span><strong className="font-serif">{next.title}</strong></Link> : <Link href="/ideas" className={styles.nextIdea}><span>Continue</span><strong className="font-serif">All ideas</strong></Link>}
        </nav>
      </main>
      <SiteFooter />
    </div>
  )
}
