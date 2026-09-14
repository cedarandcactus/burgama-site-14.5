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
  const progressRailRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const hero = heroRef.current
    const stage = stageRef.current
    const slideStack = slideStackRef.current
    const progressRail = progressRailRef.current
    if (!hero || !stage || !slideStack || !progressRail) return

    const slides = gsap.utils.toArray<HTMLElement>('[data-hero-slide]', slideStack)
    const indicators = gsap.utils.toArray<HTMLElement>('[data-hero-indicator]', progressRail)
    if (slides.length !== transformations.length || indicators.length !== transformations.length) return

    const media = gsap.matchMedia()

    media.add('(prefers-reduced-motion: no-preference)', () => {
      const wordsBySlide = slides.map(slide => gsap.utils.toArray<HTMLElement>('[data-hero-word]', slide))
      const playhead = { value: 0 }
      const timeline = gsap.timeline({ paused: true })

      gsap.set(slides, { autoAlpha: 0 })
      gsap.set(slides[0], { autoAlpha: 1 })
      wordsBySlide.forEach((words, index) => gsap.set(words, { yPercent: index === 0 ? 0 : 115 }))

      timeline.to(playhead, {
        value: transformations.length,
        duration: transformations.length,
        ease: 'none',
      }, 0)

      for (let index = 1; index < transformations.length; index += 1) {
        const transitionStart = index - 0.6
        const handoff = index - 0.3
        const previousSlide = slides[index - 1]
        const nextSlide = slides[index]
        const previousWords = wordsBySlide[index - 1]
        const nextWords = wordsBySlide[index]

        timeline
          .to(previousWords, {
            yPercent: -115,
            duration: 0.24,
            stagger: 0.03,
            ease: 'power2.in',
          }, transitionStart)
          .set(previousSlide, { autoAlpha: 0 }, handoff)
          .set(nextSlide, { autoAlpha: 1 }, handoff)
          .to(nextWords, {
            yPercent: 0,
            duration: 0.36,
            stagger: 0.07,
            ease: 'power3.out',
          }, handoff)
      }

      const updateIndicator = (progress: number) => {
        const activeIndex = Math.min(
          transformations.length - 1,
          Math.max(0, Math.floor(progress * transformations.length + 0.3)),
        )

        indicators.forEach((indicator, index) => {
          indicator.dataset.active = String(index === activeIndex)
        })
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
        onRefresh: self => updateIndicator(self.progress),
        onUpdate: self => updateIndicator(self.progress),
      })

      updateIndicator(0)

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
                    <span className={styles.heroAnimatedWord} data-hero-word="">{subject}</span>
                  </span>
                </span>
                <span className={`${styles.heroPhraseLine} ${styles.heroResultLine}`}>
                  <span className={`${styles.heroWordMask} ${styles.heroConnectorMask}`}>
                    <span className={styles.heroConnector} data-hero-word="">into</span>
                  </span>
                  <span className={styles.heroWordMask}>
                    <span className={styles.heroAnimatedWord} data-hero-word="">{result}.</span>
                  </span>
                </span>
              </span>
            ))}
          </span>
          <span className={styles.heroStatic} aria-hidden="true">
            {transformations.map(({ subject, result }) => (
              <span className={styles.heroStaticPhrase} key={subject}>{subject} into {result}.</span>
            ))}
          </span>
        </h1>
        <div className={styles.heroLower}>
          <div className={styles.heroProgress} aria-hidden="true">
            <span ref={progressRailRef} className={styles.heroProgressRail}>
              {transformations.map(({ subject }, index) => (
                <span
                  className={styles.heroProgressTick}
                  data-active={String(index === 0)}
                  data-hero-indicator=""
                  key={subject}
                />
              ))}
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
