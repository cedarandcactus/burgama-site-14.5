import { ModularButton } from '@/components/modular-button'
import styles from './home-page.module.css'

export function ActOpening() {
  return (
    <section className={styles.hero} aria-labelledby="opening-title">
      <div className={styles.heroCopy}>
        <h1 id="opening-title" className="font-serif text-balance">Ideas into identities.</h1>
        <div className={styles.heroStatement}>
          <p>We build brands, websites, and campaigns for people with something real to say.</p>
          <ModularButton href="/work">View selected work</ModularButton>
        </div>
      </div>
      <figure className={styles.heroMedia}>
        <img src="/work/go2bites/a172.jpg" alt="Five Go2Bites flavors photographed as a product range by Burgama." />
      </figure>
    </section>
  )
}
