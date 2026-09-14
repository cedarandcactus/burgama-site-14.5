'use client'

import { useEffect, useRef } from 'react'
import { ModularButton } from '@/components/modular-button'
import styles from './home-page.module.css'

const transformations = [
  { subject: 'ideas', result: 'identities' },
  { subject: 'stories', result: 'motion' },
  { subject: 'strategy', result: 'systems' },
  { subject: 'attention', result: 'action' },
] as const

const reversedTransformations = [...transformations].reverse()
const accessibleHeadline = transformations
  .map(({ subject, result }) => `${subject} into ${result}.`)
  .join(' ')

function getScrollState(progress: number) {
  const lastStep = transformations.length - 1
  if (progress >= 1) return { step: lastStep, activity: 0 }

  const segmentProgress = progress * lastStep
  const segment = Math.min(lastStep - 1, Math.floor(segmentProgress))
  const localProgress = segmentProgress - segment
  const dwell = 0.18
  const transitionProgress = Math.min(1, Math.max(0, (localProgress - dwell) / (1 - dwell * 2)))
  const easedProgress = transitionProgress * transitionProgress * (3 - 2 * transitionProgress)

  return {
    step: segment + easedProgress,
    activity: Math.sin(Math.PI * transitionProgress),
  }
}

export function ActOpening() {
  const heroRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const hero = heroRef.current
    const stage = stageRef.current
    if (!hero || !stage) return

    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0

    const clearMotionProperties = () => {
      hero.style.removeProperty('--hero-subject-shift')
      hero.style.removeProperty('--hero-result-shift')
      hero.style.removeProperty('--hero-scale')
      hero.style.removeProperty('--hero-tracking')
      hero.style.removeProperty('--hero-hinge-scale')
    }

    const update = () => {
      frame = 0
      if (motionPreference.matches) {
        clearMotionProperties()
        return
      }

      const stickyTop = Number.parseFloat(window.getComputedStyle(stage).top) || 0
      const scrollDistance = Math.max(1, hero.offsetHeight - stage.offsetHeight)
      const progress = Math.min(1, Math.max(0, (stickyTop - hero.getBoundingClientRect().top) / scrollDistance))
      const { step, activity } = getScrollState(progress)
      const reelItemShare = 100 / transformations.length

      hero.style.setProperty('--hero-subject-shift', `${(-step * reelItemShare).toFixed(4)}%`)
      hero.style.setProperty('--hero-result-shift', `${(-(transformations.length - 1 - step) * reelItemShare).toFixed(4)}%`)
      hero.style.setProperty('--hero-scale', `${(1 - activity * 0.012).toFixed(4)}`)
      hero.style.setProperty('--hero-tracking', `${(-0.052 + activity * 0.012).toFixed(4)}em`)
      hero.style.setProperty('--hero-hinge-scale', `${(1 + activity * 0.08).toFixed(4)}`)
    }

    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    const resizeObserver = new ResizeObserver(scheduleUpdate)
    resizeObserver.observe(hero)
    resizeObserver.observe(stage)
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)
    motionPreference.addEventListener('change', scheduleUpdate)
    scheduleUpdate()

    return () => {
      resizeObserver.disconnect()
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      motionPreference.removeEventListener('change', scheduleUpdate)
      clearMotionProperties()
    }
  }, [])

  return (
    <section ref={heroRef} className={styles.hero} aria-labelledby="opening-title" data-kinetic-hero="">
      <div ref={stageRef} className={styles.heroStage}>
        <h1 id="opening-title" className="font-serif" aria-label={accessibleHeadline}>
          <span className={styles.kineticHeading} aria-hidden="true">
            <span className={`${styles.heroWordWindow} ${styles.heroSubjectWindow}`}>
              <span className={`${styles.heroReel} ${styles.heroSubjectReel}`}>
                {transformations.map(({ subject }) => (
                  <span className={styles.heroWord} key={subject}>{subject}</span>
                ))}
              </span>
            </span>
            <span className={styles.heroHinge}>into</span>
            <span className={`${styles.heroWordWindow} ${styles.heroResultWindow}`}>
              <span className={`${styles.heroReel} ${styles.heroResultReel}`}>
                {reversedTransformations.map(({ result }) => (
                  <span className={styles.heroWord} key={result}>{result}.</span>
                ))}
              </span>
            </span>
          </span>
          <span className={styles.heroStatic} aria-hidden="true">
            {transformations.map(({ subject, result }) => (
              <span className={styles.heroStaticPhrase} key={subject}>{subject} into {result}.</span>
            ))}
          </span>
        </h1>
        <div className={styles.heroStatement}>
          <p>We build brands, websites, and campaigns for people with something real to say.</p>
          <ModularButton href="/work">view selected work</ModularButton>
        </div>
      </div>
    </section>
  )
}
