import styles from './home-page.module.css'
import { BevelText } from '@/components/bevel-definitions'

export function ActOpening() {
  return <section className={styles.hero} data-scroll-palette="hero" aria-labelledby="opening-title">
    <h1 id="opening-title" className="font-serif"><BevelText text={'marketing and\ndevelopment for all'} /></h1>
  </section>
}
