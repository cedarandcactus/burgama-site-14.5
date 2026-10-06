import Link from '@/components/transition-link'
import { ArrowUpRight } from 'lucide-react'
import { PublicationShell, ArticleCard } from '@/components/editorial-primitives'
import { getIdeaReadingTime, ideas } from '@/lib/editorial'
import styles from './editorial.module.css'

export function EditorialIndex() {
  const featured = ideas.find(idea => idea.slug === 'ai-website-audits') ?? ideas[0]
  return <PublicationShell>
    <header className={styles.archiveHeader}>
      <p className={styles.eyebrow}>Research &amp; observations</p>
      <h1 className="font-serif">The decisions<br />behind digital work.</h1>
      <p>Practical observations and analysis from our work on websites, ecommerce, and search. What we test, what we question, and how it informs the next decision.</p>
    </header>
    <section className={styles.featured} aria-labelledby="featured-title">
      <div><p className={styles.eyebrow}>Field notes / SEO</p><h2 id="featured-title" className="font-serif"><Link href={`/research/${featured.slug}`}>{featured.title} <ArrowUpRight className={styles.cardArrow} aria-hidden="true" /></Link></h2></div>
      <div><p>{featured.deck}</p><span className={styles.readingTime}>By Burgama / {getIdeaReadingTime(featured)} min read</span></div>
    </section>
    <section className={styles.archive} aria-labelledby="archive-title">
      <div className={styles.sectionBar}><h2 id="archive-title" className="font-serif">All articles</h2><span>{ideas.length} articles</span></div>
      <div className={styles.archiveGrid}>{ideas.map(idea => <ArticleCard key={idea.slug} idea={idea} />)}</div>
    </section>
  </PublicationShell>
}
