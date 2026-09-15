import { ModularButton } from '@/components/modular-button'
import { Reveal } from '@/components/reveal'
import { SectionRise } from '@/components/home/section-rise'
import styles from './home-page.module.css'

export function ActIntroduction() {
  return (
    <section id="studio-introduction" className={styles.introduction} data-nav-surface="frost" aria-labelledby="studio-heading">
      <Reveal className={styles.introductionContent}>
        <h2 id="studio-heading" className="font-serif">small team.<br />close to the work.</h2>
        <p>We&apos;re an independent creative and marketing studio in Austin. The people you meet are the people making your work.</p>
        <ModularButton href="/studio">a little about us</ModularButton>
      </Reveal>
      <SectionRise surface="powder-deep" direction="left" />
    </section>
  )
}
