'use client'

import { useEffect, useRef } from 'react'
import { ModularButton } from '@/components/modular-button'
import { gsap, ScrollTrigger } from '@/lib/motion'
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

export function ActOpening() {
  const heroRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const subjectReelRef = useRef<HTMLSpanElement>(null)
  const resultReelRef = useRef<HTMLSpanElement>(null)
  const progressFillRef = useRef<HTMLSpanElement>(null)
  const progressCountRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const hero = heroRef.current
    const stage = stageRef.current
    const subjectReel = subjectReelRef.current
    const resultReel = resultReelRef.current
    const progressFill = progressFillRef.current
    const progressCount = progressCountRef.current
    if (!hero || !stage || !subjectReel || !resultReel || !progressFill || !progressCount) return

    const media = gsap.matchMedia()

    media.add('(prefers-reduced-motion: no-preference)', () => {
      const reelStep = 100 / transformations.length
      const hold = { value: 0 }
      const timeline = gsap.timeline({ paused: true })

      gsap.set(subjectReel, { y: 0, yPercent: 0 })
      gsap.set(resultReel, { y: 0, yPercent: -(transformations.length - 1) * reelStep })
      gsap.set(progressFill, { scaleX: 0, transformOrigin: 'left center' })

      timeline.to(hold, { value: 1, duration: 0.38, ease: 'none' })
      for (let index = 1; index < transformations.length; index += 1) {
        timeline
          .to(subjectReel, { yPercent: -index * reelStep, duration: 0.62, ease: 'power2.inOut' })
          .to(resultReel, { yPercent: -(transformations.length - 1 - index) * reelStep, duration: 0.62, ease: 'power2.inOut' }, '<')
          .to(hold, { value: index + 1, duration: 0.38, ease: 'none' })
      }

      const updateProgress = (progress: number) => {
        const currentStep = Math.min(
          transformations.length,
          Math.max(1, Math.round(progress * (transformations.length - 1)) + 1),
        )
        progressCount.textContent = `${String(currentStep).padStart(2, '0')} / ${String(transformations.length).padStart(2, '0')}`
        gsap.set(progressFill, { scaleX: progress })
      }

      const scrollTrigger = ScrollTrigger.create({
        trigger: hero,
        animation: timeline,
        start: () => {
          const stickyTop = Number.parseFloat(window.getComputedStyle(stage).top) || 0
          return `top top+=${stickyTop}`
        },
        end: 'bottom bottom',
        scrub: 0.55,
        invalidateOnRefresh: true,
        onRefresh: self => updateProgress(self.progress),
        onUpdate: self => updateProgress(self.progress),
      })

      let orientationTimer: number | undefined
      const refreshAfterOrientation = () => {
        window.clearTimeout(orientationTimer)
        orientationTimer = window.setTimeout(() => ScrollTrigger.refresh(), 180)
      }
      window.addEventListener('orientationchange', refreshAfterOrientation)

      return () => {
        window.removeEventListener('orientationchange', refreshAfterOrientation)
        window.clearTimeout(orientationTimer)
        scrollTrigger.kill()
        timeline.kill()
      }
    })

    return () => media.revert()
  }, [])

  return (
    <section ref={heroRef} className={styles.hero} aria-labelledby="opening-title" data-kinetic-hero="">
      <div ref={stageRef} className={styles.heroStage}>
        <h1 id="opening-title" className="font-serif" aria-label={accessibleHeadline}>
          <span className={styles.kineticHeading} aria-hidden="true">
            <span className={`${styles.heroWordWindow} ${styles.heroSubjectWindow}`}>
              <span ref={subjectReelRef} className={`${styles.heroReel} ${styles.heroSubjectReel}`}>
                {transformations.map(({ subject }) => (
                  <span className={styles.heroWord} key={subject}>{subject}</span>
                ))}
              </span>
            </span>
            <span className={styles.heroHinge}>into</span>
            <span className={`${styles.heroWordWindow} ${styles.heroResultWindow}`}>
              <span ref={resultReelRef} className={`${styles.heroReel} ${styles.heroResultReel}`}>
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
        <div className={styles.heroLower}>
          <div className={styles.heroProgress} aria-hidden="true">
            <span ref={progressCountRef} className={styles.heroProgressCount}>01 / 04</span>
            <span className={styles.heroProgressRail}>
              <span ref={progressFillRef} className={styles.heroProgressFill} />
              {transformations.map(({ subject }) => <span className={styles.heroProgressTick} key={subject} />)}
            </span>
          </div>
          <div className={styles.heroStatement}>
            <p>We build brands, websites, and campaigns for people with something real to say.</p>
            <ModularButton href="/work">view selected work</ModularButton>
          </div>
        </div>
      </div>
    </section>
  )
}
