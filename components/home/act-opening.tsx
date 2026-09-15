'use client'

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { ModularButton } from '@/components/modular-button'
import { HeroFilm } from '@/components/home/hero-film'
import { gsap, ScrollTrigger } from '@/lib/motion'
import styles from './home-page.module.css'

const headlines = [
  ['we turn what makes you', 'different into brands', 'the right people remember.'],
  ['we find what sets you apart', 'and build a brand', 'that makes it matter.'],
  ['your next chapter deserves', 'a brand that feels like you', 'and moves you forward.'],
]

const headlineCookie = 'burgama-hero-message'

export function ActOpening({ children }: { children: ReactNode }) {
  const heroRef = useRef<HTMLElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const frostRef = useRef<HTMLDivElement>(null)
  const chosenHeadline = useRef<number | null>(null)
  const [headlineIndex, setHeadlineIndex] = useState<number | null>(null)

  useLayoutEffect(() => {
    if (chosenHeadline.current === null) {
      let previous = -1
      try {
        const value = document.cookie.split('; ').find((cookie) => cookie.startsWith(`${headlineCookie}=`))?.split('=')[1]
        if (value !== undefined && /^[0-2]$/.test(value)) previous = Number(value)
      } catch {
        // A blocked cookie must not prevent the hero from rendering.
      }
      const choices = headlines.map((_, index) => index).filter((index) => index !== previous)
      chosenHeadline.current = choices[Math.floor(Math.random() * choices.length)]
      try {
        document.cookie = `${headlineCookie}=${chosenHeadline.current}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`
      } catch {
        // Without preference cookies, selection remains random on every visit.
      }
    }
    setHeadlineIndex(chosenHeadline.current)
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
        .to(frost, { opacity: 1, ease: 'none', duration: 0.7 }, 0)
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
    <section ref={heroRef} className={styles.hero} aria-labelledby="opening-title" data-cinematic-hero="">
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
            <p>a creative and marketing studio bringing strategy, identity, websites, and campaigns together.</p>
            <ModularButton href="/work">view selected work</ModularButton>
          </div>
        </div>
      </div>
      <div className={styles.heroClients}>{children}</div>
    </section>
  )
}
