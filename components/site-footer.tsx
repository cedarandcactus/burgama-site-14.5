'use client'

import { useEffect, useId, useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import Link from '@/components/transition-link'
import { FooterFilm } from '@/components/footer-film'
import { gsap, ScrollTrigger } from '@/lib/motion'
import styles from '@/components/site-footer.module.css'

const headline = 'ready for what comes next'
const words = headline.split(' ')

export function SiteFooter({ home = false, work = false }: { home?: boolean; work?: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const leadRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLSpanElement>(null)
  const titleId = useId()

  useEffect(() => {
    const root = rootRef.current
    const lead = leadRef.current
    const track = trackRef.current
    if (!root || !lead || !track) return

    const media = gsap.matchMedia(root)
    const identity = root.querySelector<HTMLElement>('[data-footer-identity]')
    const letters = Array.from(track.querySelectorAll<HTMLElement>('[data-footer-letter]'))
    let disposed = false
    let refreshFrame = 0
    const refresh = () => {
      if (disposed) return
      cancelAnimationFrame(refreshFrame)
      refreshFrame = requestAnimationFrame(() => {
        if (!disposed) ScrollTrigger.refresh()
      })
    }

    media.add({
      desktop: '(min-width: 700px)',
      mobile: '(max-width: 699px)',
      reduced: '(prefers-reduced-motion: reduce)',
    }, (context) => {
      if (context.conditions?.reduced) return

      if (context.conditions?.desktop) {
        lead.dataset.rolling = 'true'
        const entrance = () => lead.clientWidth * 0.72
        const destination = () => Math.min(0, lead.clientWidth * 0.92 - track.scrollWidth)
        const timeline = gsap.timeline({
          scrollTrigger: {
            id: `footer-roll-${titleId}`,
            trigger: lead,
            start: 'top top',
            end: () => `+=${Math.max(900, Math.min(1900, track.scrollWidth * 0.65))}`,
            pin: true,
            // Page wrappers use transforms, which change the containing block for fixed pins.
            pinType: 'transform',
            scrub: 0.65,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })

        timeline.fromTo(track, { x: entrance }, {
          x: destination,
          duration: 3,
          ease: 'none',
        }, 0)

        letters.forEach((letter) => {
          const word = letter.parentElement!
          const offset = word.offsetLeft + letter.offsetLeft
          const distance = entrance() - destination()
          const arrival = Math.max(0, (entrance() + offset - lead.clientWidth * 0.9) / distance * 3)
          timeline.fromTo(letter, {
            yPercent: 65,
            rotation: 16,
          }, {
            yPercent: 0,
            rotation: 0,
            duration: 0.45,
            ease: 'power2.out',
          }, Math.min(2.5, arrival))
        })

        timeline.to({}, { duration: 0.2 })
      } else {
        gsap.fromTo(track.children, { y: 42, rotation: 4 }, {
          y: 0,
          rotation: 0,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: lead,
            start: 'top 85%',
            end: 'center 55%',
            scrub: 0.5,
          },
        })
      }

      gsap.fromTo(identity, { y: 44 }, {
        y: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: root.querySelector('footer'),
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: 0.6,
        },
      })

      return () => {
        delete lead.dataset.rolling
        for (const element of [track, ...Array.from(track.children), ...letters, identity]) {
          element?.removeAttribute('style')
        }
      }
    })

    // Entrance transforms must settle before pin coordinates are measured.
    const entranceAnimations: Animation[] = []
    for (let parent = root.parentElement; parent; parent = parent.parentElement) {
      entranceAnimations.push(...parent.getAnimations())
    }
    Promise.allSettled(entranceAnimations.map(animation => animation.finished)).then(refresh)
    document.fonts.ready.then(refresh)
    document.fonts.addEventListener('loadingdone', refresh)
    let previousWidth = root.clientWidth
    const observer = new ResizeObserver(() => {
      if (root.clientWidth === previousWidth) return
      previousWidth = root.clientWidth
      refresh()
    })
    observer.observe(root)

    return () => {
      disposed = true
      cancelAnimationFrame(refreshFrame)
      observer.disconnect()
      document.fonts.removeEventListener('loadingdone', refresh)
      media.revert()
    }
  }, [titleId])

  return (
    <div ref={rootRef} className={styles.ending} data-site-ending="">
      <section ref={leadRef} className={styles.lead} aria-labelledby={titleId} data-footer-lead="">
        <div className={styles.leadViewport}>
          <h2 id={titleId} className={styles.headline} aria-label={headline}>
            <span ref={trackRef} className={styles.track} aria-hidden="true">
              {words.map((word) => (
                <span className={styles.word} key={word}>
                  {Array.from(word).map((letter, index) => (
                    <span className={styles.letter} data-footer-letter="" key={index}>{letter}</span>
                  ))}
                </span>
              ))}
            </span>
          </h2>
        </div>
      </section>
      <div className={styles.footerFrame}>
        <footer className={styles.footer} data-home={home} data-work={work}>
          <FooterFilm />
          <div className={styles.content}>
            <div className={styles.topRow}>
              <div className={styles.invitation}>
                <h2>let&apos;s start something.</h2>
                <a className={styles.emailButton} href="mailto:hello@burgama.com">
                  <span>hello@burgama.com</span>
                  <span className={styles.emailArrow} aria-hidden="true"><ArrowUpRight /></span>
                </a>
                <p>Bring the idea. We&apos;ll bring the people to make it happen.</p>
              </div>
              <nav className={styles.linkColumn} aria-label="Explore Burgama">
                <Link href="/#capabilities">services</Link>
                <Link href="/work">work</Link>
                <Link href="/studio">about</Link>
              </nav>
              <nav className={styles.linkColumn} aria-label="Inside the studio">
                <Link href="/ideas">ideas</Link>
                <Link href="/studio#small-title">our approach</Link>
                <Link href="/studio#team-title">the people</Link>
              </nav>
              <div className={styles.linkColumn}>
                <p className={styles.location}>austin, texas</p>
                <p className={styles.availability}>Working wherever you are.</p>
                <Link href="/contact">contact</Link>
              </div>
            </div>
            <div className={styles.identity} data-footer-identity="">
              <Link href="/" className={styles.wordmark} aria-label="Burgama home">burgama</Link>
            </div>
            <div className={styles.bottomRow}>
              <p>© {new Date().getFullYear()} Burgama. All rights reserved.</p>
              <a href="mailto:hello@burgama.com">hello@burgama.com</a>
              <p className={styles.credit}>Independent by design.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
