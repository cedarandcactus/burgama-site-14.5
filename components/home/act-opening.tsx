import styles from './home-page.module.css'

export function ActOpening() {
  return <section className={styles.hero} aria-labelledby="opening-title">
    <h1 id="opening-title" className="font-serif bevel-display"><span>marketing and</span><span>development for all</span></h1>
  </section>
}
