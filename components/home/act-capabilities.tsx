'use client'

import { ModularButton } from '@/components/modular-button'
import { Reveal } from '@/components/reveal'
import { SectionRise } from '@/components/home/section-rise'
import styles from './home-page.module.css'

export function ActCapabilities() {
  return (
    <section id="capabilities" className={styles.capabilities} data-nav-surface="ink" aria-labelledby="capabilities-heading">
      <div className={styles.processMedia} aria-hidden="true">
        <video className={styles.processVideo} autoPlay muted loop playsInline preload="metadata" tabIndex={-1}>
          <source src="/videos/bg-2.mp4" type="video/mp4" />
        </video>
        <div className={styles.processVideoShade} />
      </div>
      <div className={styles.processInner}>
        <div className={styles.processContent}>
          <Reveal>
            <h2 id="capabilities-heading" className={styles.processHeading}>how we work</h2>
            <p className={styles.processDescription}>We start by listening, getting to know your business and what makes it different. Together, we shape a clear direction and bring it to life through identity, websites, content, and campaigns. We stay close to the work after launch, learning from what connects and refining what comes next.</p>
          </Reveal>
          <Reveal className={styles.processAction}><ModularButton href="#start-a-project">start a project</ModularButton></Reveal>
        </div>
      </div>
      <SectionRise surface="navy" />
    </section>
  )
}
