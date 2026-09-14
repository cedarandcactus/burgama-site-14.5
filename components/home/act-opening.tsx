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

  useEffect(() => {
    const hero = heroRef.current
    const stage = stageRef.current
    const slideStack = slideStackRef.current
    if (!hero || !stage || !slideStack) return

    const slides = gsap.utils.toArray<HTMLElement>('[data-hero-slide]', slideStack)
    if (slides.length !== transformations.length) return

    const media = gsap.matchMedia()

    media.add('(prefers-reduced-motion: no-preference)', () => {
      const timelineClock = { progress: 0 }
      const timeline = gsap.timeline({ paused: true })

      gsap.set(slides, {
        autoAlpha: 0,
        y: 20,
        scale: 0.985,
        transformOrigin: 'center center',
      })
      gsap.set(slides[0], { autoAlpha: 1, y: 0, scale: 1 })

      timeline.to(timelineClock, {
        progress: 1,
        duration: transformations.length,
        ease: 'none',
      }, 0)

      for (let index = 1; index < transformations.length; index += 1) {
        const transitionStart = index - 0.62
        const revealStart = index - 0.38
        const previousSlide = slides[index - 1]
        const nextSlide = slides[index]

        timeline
          .to(previousSlide, {
            autoAlpha: 0,
            y: -16,
            scale: 0.99,
            duration: 0.28,
            ease: 'power2.in',
          }, transitionStart)
          .fromTo(nextSlide, {
            autoAlpha: 0,
            y: 20,
            scale: 0.985,
          }, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.42,
            ease: 'power3.out',
            immediateRender: false,
          }, revealStart)
      }

      const scrollTrigger = ScrollTrigger.create({
        trigger: hero,
        animation: timeline,
        start: () => {
          const stickyTop = Number.parseFloat(window.getComputedStyle(stage).top) || 0
          return `top top+=${stickyTop}`
        },
        end: 'bottom bottom',
        scrub: true,
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
        <div className={styles.heroFrame}>
          <div className={styles.heroFrameContent}>
            <h1 id="opening-title" className="font-serif" aria-label={accessibleHeadline}>
              <span ref={slideStackRef} className={styles.kineticHeading} aria-hidden="true">
                {transformations.map(({ subject, result }) => (
                  <span className={styles.heroSlide} data-hero-slide="" key={subject}>
                    <span className={`${styles.heroPhraseLine} ${styles.heroSubjectLine}`}>{subject}</span>
                    <span className={`${styles.heroPhraseLine} ${styles.heroConnectorLine}`}>into</span>
                    <span className={`${styles.heroPhraseLine} ${styles.heroResultLine}`}>{result}.</span>
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
              <div className={styles.heroStatement}>
                <p>We build brands, websites, and campaigns for people with something real to say.</p>
                <ModularButton href="/contact">contact us</ModularButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
