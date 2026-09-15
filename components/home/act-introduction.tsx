import Image from 'next/image'
import { ModularButton } from '@/components/modular-button'
import { Reveal } from '@/components/reveal'
import styles from './home-page.module.css'

export function ActIntroduction() {
  return (
    <section id="studio-introduction" className={styles.introduction} data-nav-surface="frost" aria-labelledby="studio-heading">
      <Reveal className={styles.introductionContent}>
        <div className={styles.studioPortraits} aria-hidden="true">
          {['deniz', 'amanda', 'josiah'].map((person) => (
            <Image key={person} src={`/team/${person}.jpg`} alt="" width={80} height={80} sizes="80px" />
          ))}
        </div>
        <h2 id="studio-heading" className="font-serif">small team.<br />close to the work.</h2>
        <p>We&apos;re an independent creative and marketing studio in Austin. The people you meet are the people making your work.</p>
        <ModularButton href="/studio">a little about us</ModularButton>
      </Reveal>
    </section>
  )
}
