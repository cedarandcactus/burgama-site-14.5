'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { ModularButton } from '@/components/modular-button'
import { HeroFilm } from '@/components/home/hero-film'
import { gsap, ScrollTrigger } from '@/lib/motion'
import styles from './home-page.module.css'

const headlineLines = [
  'we turn what makes you',
  'different into brands',
  'the right people remember.',
]

export function ActOpening({ children }: { children: ReactNode }) {
  const heroRef = useRef<HTMLElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const frostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const hero = heroRef.current
    const film = mediaRef.current
    const content = contentRef.current
    const frost = frostRef.current
    if (!hero || !film || !content || !frost) return

    const media = gsap.matchMedia(hero)
    let disposed = false

    media.add({
      motion: '(prefers-reduced-motion: no-preference)',
      desktop: '(min-width: 700px)',
    }, (context) => {
      if (!context.conditions?.motion) return
      const desktop = context.conditions.desktop
      const words = hero.querySelectorAll('[data-hero-word]')

      gsap.from(words, {
        yPercent: 28,
        opacity: 0,
        filter: `blur(${desktop ? 9 : 6}px)`,
        duration: 1.05,
        stagger: 0.028,
        ease: 'power3.out',
        clearProps: 'transform,opacity,filter',
      })

      gsap.timeline({
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.85,
          invalidateOnRefresh: true,
        },
      })
        .to(film, { y: desktop ? 96 : 40, ease: 'none', duration: 1 }, 0)
        .to(content, { y: desktop ? -48 : -18, ease: 'none', duration: 1 }, 0)
        .to(frost, { opacity: 1, ease: 'none', duration: 0.7 }, 0)
    })

    document.fonts.ready.then(() => {
      if (!disposed) ScrollTrigger.refresh()
    })

    return () => {
      disposed = true
      media.revert()
    }
  }, [])

  return (
    <section ref={heroRef} className={styles.hero} aria-labelledby="opening-title" data-cinematic-hero="">
      <div ref={mediaRef} className={styles.heroMedia}>
        <HeroFilm />
      </div>
      <div ref={frostRef} className={styles.heroFrost} aria-hidden="true" />
      <div className={styles.heroFrame}>
        <div ref={contentRef} className={styles.heroFrameContent}>
          <h1 id="opening-title" className="font-serif" aria-label={headlineLines.join(' ')}>
            {headlineLines.map((line, index) => (
              <span key={line} className={styles.heroHeadlineLine} aria-hidden="true">
                {line.split(' ').map((word, wordIndex) => (
                  <span key={`${word}-${wordIndex}`}>
                    <span className={styles.heroWord} data-hero-word="">{word}</span>{' '}
                  </span>
                ))}
                {index < headlineLines.length - 1 ? ' ' : null}
              </span>
            ))}
          </h1>
          <div className={styles.heroStatement}>
            <p>a creative and marketing studio bringing strategy, identity, websites, and campaigns together.</p>
            <ModularButton href="/work">view selected work</ModularButton>
          </div>
        </div>
      </div>
      <div className={styles.heroClients}>{children}</div>
    </section>
  )
}
