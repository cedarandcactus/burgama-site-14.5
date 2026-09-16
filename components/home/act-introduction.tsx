import { ModularButton } from '@/components/modular-button'
import { Reveal } from '@/components/reveal'
import { SectionRise } from '@/components/home/section-rise'
import styles from './home-page.module.css'

export function ActIntroduction() {
  return (
    <section id="studio-introduction" className={styles.introduction} data-nav-surface="frost" aria-labelledby="studio-heading">
      <Reveal className={styles.introductionContent}>
        <h2 id="studio-heading" className="font-serif">From the first conversation to the final detail, you work directly with us.</h2>
        <p>We&apos;re an independent creative and marketing studio in Austin. Strategy, design, and delivery happen together, with a team that stays involved from the initial brief to what comes after launch.</p>
        <ModularButton href="/studio">a little about us</ModularButton>
      </Reveal>
      <SectionRise surface="powder" direction="left" cutout />
    </section>
  )
}
