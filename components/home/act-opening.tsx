'use client'

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { ModularButton } from '@/components/modular-button'
import { HeroFilm } from '@/components/home/hero-film'
import { SectionRise } from '@/components/home/section-rise'
import {
  COOKIE_CONSENT_EVENT,
  clearHeadlinePreference,
  getCookieConsent,
  readHeadlinePreference,
  setHeadlinePreference,
  type CookieConsent,
} from '@/lib/cookie-consent'
import { gsap, ScrollTrigger } from '@/lib/motion'
import styles from './home-page.module.css'

const headlines = [
  ['We turn what makes you', 'different into brands', 'the right people remember.'],
  ['We find what sets you apart', 'and build a brand', 'that makes it matter.'],
  ['Your next chapter deserves', 'a brand that feels like you', 'and moves you forward.'],
]

export function ActOpening({ children }: { children: ReactNode }) {
  const heroRef = useRef<HTMLElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const frostRef = useRef<HTMLDivElement>(null)
  const chosenHeadline = useRef<number | null>(null)
  const [headlineIndex, setHeadlineIndex] = useState<number | null>(null)

  useLayoutEffect(() => {
    if (chosenHeadline.current === null) {
      const consent = getCookieConsent()
      const previous = consent === 'accepted' ? (readHeadlinePreference() ?? -1) : -1
      const choices = headlines.map((_, index) => index).filter((index) => index !== previous)
      chosenHeadline.current = choices[Math.floor(Math.random() * choices.length)]
      if (consent === 'accepted') {
        setHeadlinePreference(chosenHeadline.current)
      } else {
        clearHeadlinePreference()
      }
    }
    setHeadlineIndex(chosenHeadline.current)
  }, [])

  useEffect(() => {
    function updatePreference(event: Event) {
      const consent = (event as CustomEvent<CookieConsent>).detail
      if (consent === 'accepted' && chosenHeadline.current !== null) {
        setHeadlinePreference(chosenHeadline.current)
      } else {
        clearHeadlinePreference()
      }
    }

    window.addEventListener(COOKIE_CONSENT_EVENT, updatePreference)
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, updatePreference)
  }, [])

  useEffect(() => {
    if (headlineIndex === null) return
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
      const words = hero.querySelectorAll('[data-headline-active="true"] [data-hero-word]')

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
        .to(frost, { opacity: 0.55, ease: 'none', duration: 0.7 }, 0)
    })

    document.fonts.ready.then(() => {
      if (!disposed) ScrollTrigger.refresh()
    })

    return () => {
      disposed = true
      media.revert()
    }
  }, [headlineIndex])

  return (
    <section ref={heroRef} className={styles.hero} aria-labelledby="opening-title" data-cinematic-hero="" data-nav-surface="ink">
      <div ref={mediaRef} className={styles.heroMedia}>
        <HeroFilm />
      </div>
      <div ref={frostRef} className={styles.heroFrost} aria-hidden="true" />
      <div className={styles.heroFrame}>
        <div ref={contentRef} className={styles.heroFrameContent}>
          <h1 id="opening-title" className="font-serif" aria-label={headlines[headlineIndex ?? 0].join(' ')}>
            {headlines.map((lines, variantIndex) => (
              <span
                key={variantIndex}
                className={styles.heroHeadlineVariant}
                data-headline-active={variantIndex === (headlineIndex ?? 0)}
                aria-hidden="true"
              >
                {lines.map((line, index) => (
                  <span key={line} className={styles.heroHeadlineLine}>
                    {line.split(' ').map((word, wordIndex) => (
                      <span key={`${word}-${wordIndex}`}>
                        <span className={styles.heroWord} data-hero-word="">{word}</span>{' '}
                      </span>
                    ))}
                    {index < lines.length - 1 ? ' ' : null}
                  </span>
                ))}
              </span>
            ))}
          </h1>
          <div className={styles.heroStatement}>
            <p>A creative and marketing studio bringing strategy, identity, websites, and campaigns together.</p>
            <ModularButton href="#studio-introduction">meet the studio</ModularButton>
          </div>
        </div>
      </div>
      <div className={styles.heroClients}>{children}</div>
      <SectionRise surface="powder" />
    </section>
  )
}
