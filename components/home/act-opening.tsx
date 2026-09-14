import { ModularButton } from '@/components/modular-button'
import styles from './home-page.module.css'

export function ActOpening() {
  return (
    <section className={styles.hero} aria-labelledby="opening-title">
      <div className={styles.heroCopy}>
        <p className={styles.eyebrow}>Independent studio · Austin, Texas</p>
        <h1 id="opening-title" className="font-serif text-balance">marketing and development for all</h1>
        <div className={styles.heroStatement}>
          <p>Brand, digital, campaigns, and content for people building something worth noticing.</p>
          <ModularButton href="/work">view selected work</ModularButton>
        </div>
      </div>
      <figure className={styles.heroMedia}>
        <img src="/work/go2bites/a172.jpg" alt="Five Go2Bites flavors photographed as a product range by Burgama." />
        <figcaption><span>Go2Bites</span><span>Photography · Web · Production</span></figcaption>
      </figure>
    </section>
  )
}
