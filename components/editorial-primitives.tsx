import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import Link from '@/components/transition-link'
import type { ReactNode } from 'react'
import { getIdeaReadingTime, type IdeaPost } from '@/lib/editorial'
import type { EditorialDirection, EditorialFigure as Figure } from '@/lib/editorial-layouts'
import styles from './editorial.module.css'

export function PublicationShell({ children, mode }: { children: ReactNode; mode: EditorialDirection['style'] }) {
  return <div className={`${styles.publication} font-sans`} data-publication={mode}>
    <header className={styles.masthead}>
      <Link href="/research" className={styles.identity} aria-label="Burgama Research home">
        <span className={`${styles.wordmark} ${mode === 'journal' ? 'font-serif' : 'font-sans'}`}>Burgama</span>
        <span className={styles.publicationName}>Research</span>
      </Link>
    </header>
    {children}
    <footer className={styles.footer}>
      <Link href="/research" className={`${styles.footerBrand} font-serif`}>Burgama<span>Research</span></Link>
      <nav aria-label="Publication footer"><Link href="/studio">About Burgama</Link><Link href="/research">All research</Link><Link href="/privacy">Privacy</Link></nav>
    </footer>
  </div>
}

export function ArticleMetadata({ idea }: { idea: IdeaPost }) {
  return <div className={styles.metadata}>
    <span>By <Link href="/studio">Burgama</Link></span><span>{getIdeaReadingTime(idea)} min read</span>
  </div>
}

export function EditorialMedia({ media }: { media: NonNullable<EditorialDirection['media']> }) {
  return <figure className={styles.featureMedia}>
    <Image src={media.src} alt={media.alt} width={media.width} height={media.height} sizes="(max-width: 700px) 100vw, (max-width: 1500px) 92vw, 1360px" className={styles.featureImage} />
    <figcaption><span>{media.caption}</span>{media.credit && <span>{media.credit}</span>}</figcaption>
  </figure>
}

export function EditorialEvidence({ evidence }: { evidence: NonNullable<EditorialDirection['evidence']> }) {
  return <figure className={styles.evidence}>
    <h3 className="font-serif">{evidence.heading}</h3>
    <table><thead><tr>{evidence.columns.map(column => <th scope="col" key={column}>{column}</th>)}</tr></thead>
      <tbody>{evidence.rows.map(([claim, observation]) => <tr key={claim}><th scope="row">{claim}</th><td>{observation}</td></tr>)}</tbody>
    </table>
    <figcaption>{evidence.caption}</figcaption>
  </figure>
}

export function EditorialFigure({ figure }: { figure: Figure }) {
  return <figure className={styles.figure}>
    {figure.kind === 'image' ? <Image src={figure.src} alt={figure.alt} width={figure.width} height={figure.height} sizes="(max-width: 760px) 100vw, 1200px" className={styles.figureImage} /> :
      <ol className={styles.diagram} data-kind={figure.kind}>
        {figure.items.map(item => <li key={item.label}>
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
  return <article className={styles.articleCard}>
    <h3 className="font-serif"><Link href={`/research/${idea.slug}`}>{idea.title}</Link></h3>
    <p className={styles.cardDeck}>{idea.deck}</p>
  </article>
}
