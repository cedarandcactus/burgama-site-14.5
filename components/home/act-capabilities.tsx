'use client'

import { ModularButton } from '@/components/modular-button'
import { Reveal } from '@/components/reveal'
import { SectionRise } from '@/components/home/section-rise'
import styles from './home-page.module.css'

const fallbackPath = Array.from({ length: 96 }, (_, index) => {
  const angle = index / 96 * Math.PI * 2
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  const x = Math.sign(cos) * Math.abs(cos) ** .58 * 453
  const y = Math.sign(sin) * Math.abs(sin) ** .58 * 281.45 - x * .04875
  return `${index ? 'L' : 'M'}${(500 + x).toFixed(2)} ${(325 - y).toFixed(2)}`
}).join(' ') + ' Z'

export function ActCapabilities() {
  return (
    <section id="capabilities" className={styles.capabilities} data-nav-surface="frost" aria-labelledby="capabilities-heading">
      <div className={styles.processInner}>
        <div className={styles.processOrbit} aria-hidden="true">
          <div className={styles.processFallback}>
            <svg viewBox="0 0 1000 650" preserveAspectRatio="none" fill="none" focusable="false">
              <path d={fallbackPath} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
            </svg>
            <span className={styles.processFallbackMarker} />
          </div>
        </div>
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
