import styles from './home-page.module.css'

export function ActOpening() {
  return <section className={styles.hero} data-scroll-palette="hero" aria-labelledby="opening-title">
    <h1 id="opening-title" className="font-serif">marketing and<br />development for all</h1>
  </section>
}
