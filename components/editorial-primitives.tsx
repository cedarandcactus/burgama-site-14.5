import Image from 'next/image'
import { ArrowDownLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import Link from '@/components/transition-link'
import type { ReactNode } from 'react'
import { getIdeaReadingTime, type IdeaPost } from '@/lib/editorial'
import { getEditorialDirection, type EditorialFigure as Figure } from '@/lib/editorial-layouts'
import styles from './editorial.module.css'

export function PublicationShell({ children }: { children: ReactNode }) {
  return <div className={`${styles.publication} font-sans`} data-publication>
    <header className={styles.masthead}>
      <Link href="/research" className={styles.identity} aria-label="Burgama Research home">
        <span className={`${styles.wordmark} font-serif`}>burgama</span>
        <span className={styles.publicationName}>Research</span>
      </Link>
      <span className={styles.mastheadDescriptor}>Design, technology &amp; the decisions between.</span>
      <Link href="/research" className={styles.archiveLink}>All articles <ArrowUpRight className={styles.inlineArrow} aria-hidden="true" /></Link>
    </header>
    {children}
    <footer className={styles.footer}>
      <Link href="/" className={`${styles.footerBrand} font-serif`} aria-label="Burgama studio home">burgama</Link>
      <p>Research &amp; observations by Burgama.</p>
      <nav aria-label="Publication footer"><Link href="/studio">About the studio</Link><Link href="/privacy">Privacy</Link></nav>
    </footer>
  </div>
}

export function ArticleMetadata({ idea }: { idea: IdeaPost }) {
  return <div className={styles.metadata}>
    <span>By Burgama</span><span>{getIdeaReadingTime(idea)} min read</span>
    <a href="#references">{idea.sources.length} references <ArrowDownLeft className={styles.inlineArrow} aria-hidden="true" /></a>
  </div>
}

export function EditorialFigure({ figure }: { figure: Figure }) {
  return <figure className={styles.figure}>
    {figure.kind === 'image' ? <Image src={figure.src} alt={figure.alt} width={figure.width} height={figure.height} sizes="(max-width: 760px) 90vw, 1100px" className={styles.figureImage} /> :
      <ol className={styles.diagram} data-kind={figure.kind}>
        {figure.items.map((item, index) => <li key={item.label}>
          {figure.kind === 'sequence' && <span className={styles.step}>{String(index + 1).padStart(2, '0')} <ArrowRight className={styles.inlineArrow} aria-hidden="true" /></span>}
          <strong>{item.label}</strong><p>{item.text}</p>
        </li>)}
      </ol>}
    <figcaption>{figure.caption}</figcaption>
  </figure>
}

export function ArticleReferences({ idea }: { idea: IdeaPost }) {
  return <section id="references" className={styles.references} aria-labelledby="references-title" tabIndex={-1}>
    <h2 id="references-title" className={styles.smallHeading}>Sources &amp; further reading</h2>
    <ol>{idea.sources.map(source => <li key={source.href}><a href={source.href}>{source.label}<ArrowUpRight className={styles.inlineArrow} aria-hidden="true" /></a></li>)}</ol>
  </section>
}

export function ArticleCard({ idea }: { idea: IdeaPost }) {
  const direction = getEditorialDirection(idea)
  return <article className={styles.articleCard}>
    <p className={styles.eyebrow}>{idea.categories[0]} <span> / {direction.format}</span></p>
    <h3 className="font-serif"><Link href={`/research/${idea.slug}`}>{idea.title}{' '}<ArrowUpRight className={styles.cardArrow} aria-hidden="true" /></Link></h3>
    <p className={styles.cardDeck}>{idea.deck}</p>
    <span className={styles.readingTime}>{getIdeaReadingTime(idea)} min read</span>
  </article>
}
