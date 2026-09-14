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

const accessibleHeadline = transformations
  .map(({ subject, result }) => `${subject} into ${result}.`)
  .join(' ')

export function ActOpening() {
  const heroRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const slideStackRef = useRef<HTMLSpanElement>(null)
  const progressFillRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const hero = heroRef.current
    const stage = stageRef.current
    const slideStack = slideStackRef.current
    const progressFill = progressFillRef.current
    if (!hero || !stage || !slideStack || !progressFill) return

    const slides = gsap.utils.toArray<HTMLElement>('[data-hero-slide]', slideStack)
    if (slides.length !== transformations.length) return

    const media = gsap.matchMedia()

    media.add('(prefers-reduced-motion: no-preference)', () => {
      const linesBySlide = slides.map(slide => gsap.utils.toArray<HTMLElement>('[data-hero-line]', slide))
      const timeline = gsap.timeline({ paused: true })

      gsap.set(slides, { autoAlpha: 0 })
      gsap.set(slides[0], { autoAlpha: 1 })
      gsap.set(progressFill, { scaleX: 0, transformOrigin: 'left center' })
      linesBySlide.forEach((lines, index) => gsap.set(lines, { yPercent: index === 0 ? 0 : 115 }))

      timeline.to(progressFill, {
        scaleX: 1,
        duration: transformations.length,
        ease: 'none',
      }, 0)

      for (let index = 1; index < transformations.length; index += 1) {
        const transitionStart = index - 0.6
        const handoff = index - 0.3
        const previousSlide = slides[index - 1]
        const nextSlide = slides[index]
        const previousLines = linesBySlide[index - 1]
        const nextLines = linesBySlide[index]

        timeline
          .to(previousLines, {
            yPercent: -115,
            duration: 0.24,
            stagger: 0.04,
            ease: 'power2.in',
          }, transitionStart)
          .set(previousSlide, { autoAlpha: 0 }, handoff)
          .set(nextSlide, { autoAlpha: 1 }, handoff)
          .to(nextLines, {
            yPercent: 0,
            duration: 0.36,
            stagger: 0.07,
            ease: 'power3.out',
          }, handoff)
      }

      const scrollTrigger = ScrollTrigger.create({
        trigger: hero,
        animation: timeline,
        start: () => {
          const stickyTop = Number.parseFloat(window.getComputedStyle(stage).top) || 0
          return `top top+=${stickyTop}`
        },
        end: 'bottom bottom',
        scrub: 0.5,
        invalidateOnRefresh: true,
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
          <span ref={slideStackRef} className={styles.kineticHeading} aria-hidden="true">
            {transformations.map(({ subject, result }) => (
              <span className={styles.heroSlide} data-hero-slide="" key={subject}>
                <span className={`${styles.heroPhraseLine} ${styles.heroSubjectLine}`}>
                  <span className={styles.heroWordMask}>
                    <span className={styles.heroAnimatedWord} data-hero-line="">{subject}</span>
                  </span>
                </span>
                <span className={`${styles.heroPhraseLine} ${styles.heroConnectorLine}`}>
                  <span className={styles.heroWordMask}>
                    <span className={styles.heroAnimatedWord} data-hero-line="">into</span>
                  </span>
                </span>
                <span className={`${styles.heroPhraseLine} ${styles.heroResultLine}`}>
                  <span className={styles.heroWordMask}>
                    <span className={styles.heroAnimatedWord} data-hero-line="">{result}.</span>
                  </span>
                </span>
              </span>
            ))}
          </span>
          <span className={styles.heroStatic} aria-hidden="true">
            {transformations.map(({ subject, result }) => (
              <span className={styles.heroStaticPhrase} key={subject}>
                <span className={`${styles.heroStaticWord} ${styles.heroStaticSubject}`}>{subject}</span>
                <span className={`${styles.heroStaticWord} ${styles.heroStaticConnector}`}>into</span>
                <span className={`${styles.heroStaticWord} ${styles.heroStaticResult}`}>{result}.</span>
              </span>
            ))}
          </span>
        </h1>
        <div className={styles.heroLower}>
          <div className={styles.heroProgress} aria-hidden="true">
            <span className={styles.heroProgressRail}>
              <span ref={progressFillRef} className={styles.heroProgressFill} />
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
