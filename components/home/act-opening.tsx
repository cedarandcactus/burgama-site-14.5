import { ModularButton } from '@/components/modular-button'
import styles from './home-page.module.css'

export function ActOpening() {
  return (
    <section className={styles.hero} aria-labelledby="opening-title">
      <div className={styles.heroContent}>
        <p className={styles.eyebrow}>Independent creative & marketing studio</p>
        <h1 id="opening-title" className="font-serif text-balance">marketing solutions for founders and startups in austin and beyond.</h1>
        <p className={styles.heroDescription}>We&apos;re a creative and marketing studio working across brand, digital, and campaign work. Thoughtful decisions, a clear direction, and a distinct point of view.</p>
        <div className={styles.heroActions}>
          <ModularButton href="/work">explore the work</ModularButton>
          <ModularButton href="/contact">let&apos;s talk</ModularButton>
        </div>
      </div>
    </section>
  )
}
