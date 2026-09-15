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
      const timeline = gsap.timeline({ paused: true })

      gsap.set(slides, {
        autoAlpha: 1,
        yPercent: 110,
        force3D: true,
      })
      gsap.set(slides[0], { yPercent: 0 })

      for (let index = 1; index < transformations.length; index += 1) {
        const transitionStart = index - 1
        const previousSlide = slides[index - 1]
        const nextSlide = slides[index]

        timeline
          .to(previousSlide, {
            yPercent: -110,
            duration: 0.72,
            ease: 'power2.inOut',
          }, transitionStart)
          .fromTo(nextSlide, {
            yPercent: 110,
          }, {
            yPercent: 0,
            duration: 0.72,
            ease: 'power2.inOut',
            immediateRender: false,
          }, transitionStart)
      }

      const scrollTrigger = ScrollTrigger.create({
        trigger: hero,
        animation: timeline,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.15,
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
                <p>We shape identity, digital, and campaigns for organizations with something worth saying.</p>
                <ModularButton href="/work">view selected work</ModularButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
