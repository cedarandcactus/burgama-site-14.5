'use client'

import { useEffect, useId, useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import Link from '@/components/transition-link'
import { FooterFilm } from '@/components/footer-film'
import { SectionRise } from '@/components/home/section-rise'
import { gsap, ScrollTrigger } from '@/lib/motion'
import styles from '@/components/site-footer.module.css'

const headline = 'Ready for what comes next'
const words = headline.split(' ')
const navigationGroups = [
  {
    label: 'Explore',
    links: [
      { label: 'Services', href: '/#capabilities' },
      { label: 'Work', href: '/work' },
      { label: 'About', href: '/studio' },
    ],
  },
  {
    label: 'The studio',
    links: [
      { label: 'Ideas', href: '/ideas' },
      { label: 'Contact', href: '/contact' },
    ],
  },
]

function RollingLabel({ text }: { text: string }) {
  return (
    <>
      <span className="sr-only">{text}</span>
      <span className={styles.rollWindow} aria-hidden="true">
        {Array.from(text).map((character, index) => (
          <span
            key={index}
            className={styles.rollGlyph}
            style={{ transitionDelay: `${index * 14}ms` }}
          >
            <span>{character === ' ' ? '\u00a0' : character}</span>
            <span className={styles.rollCopy}>{character === ' ' ? '\u00a0' : character}</span>
          </span>
        ))}
      </span>
    </>
  )
}

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
    const invitation = root.querySelector<HTMLElement>('[data-footer-invitation]')
    const titleWords = Array.from(root.querySelectorAll<HTMLElement>('[data-footer-title-word]'))
    const groups = Array.from(root.querySelectorAll<HTMLElement>('[data-footer-group]'))
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

      gsap.fromTo(titleWords, {
        yPercent: context.conditions?.desktop ? 55 : 30,
        rotation: context.conditions?.desktop ? 5 : 2,
      }, {
        yPercent: 0,
        rotation: 0,
        duration: 0.8,
        stagger: 0.09,
        ease: 'back.out(1.15)',
        scrollTrigger: {
          trigger: invitation,
          start: 'top 92%',
          once: true,
        },
      })

      groups.forEach((group, index) => {
        gsap.fromTo(group, { y: context.conditions?.desktop ? 28 : 16 }, {
          y: 0,
          duration: 0.7,
          delay: index * 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: group,
            start: 'top 95%',
            once: true,
          },
        })
      })

      gsap.fromTo(identity, {
        y: context.conditions?.desktop ? 84 : 32,
        skewY: context.conditions?.desktop ? 1.5 : 0,
      }, {
        y: 0,
        skewY: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: root.querySelector('[data-footer-identity-reveal]'),
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      })

      return () => {
        delete lead.dataset.rolling
        for (const element of [track, ...Array.from(track.children), ...letters, ...titleWords, ...groups, identity]) {
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
      <section ref={leadRef} className={styles.lead} aria-labelledby={titleId} data-footer-lead="" data-nav-surface={home ? 'frost' : undefined}>
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
        {home && <SectionRise surface="navy" />}
      </section>
      <div className={styles.footerFrame} data-home={home}>
        <footer className={styles.footer} data-home={home} data-work={work} data-nav-surface={home ? 'ink' : undefined}>
          <FooterFilm />
          <div className={styles.content}>
            <div className={styles.topRow}>
              <div className={styles.invitation} data-footer-invitation="">
                <h2 aria-label="Let’s make your mark.">
                  <span className={styles.titleLine} aria-hidden="true">
                    <span data-footer-title-word="">let&apos;s</span>{' '}
                    <span data-footer-title-word="">make</span>
                  </span>
                  <span className={styles.titleLine} aria-hidden="true">
                    <span data-footer-title-word="">your</span>{' '}
                    <span data-footer-title-word="">mark.</span>
                  </span>
                </h2>
                <a className={styles.emailButton} href="mailto:hello@burgama.com">
                  <span className={styles.emailLabel}><RollingLabel text="hello@burgama.com" /></span>
                  <span className={styles.emailArrow} aria-hidden="true">
                    <ArrowUpRight />
                    <ArrowUpRight />
                  </span>
                </a>
              </div>
              <div className={styles.utilities}>
                <div className={styles.navigation}>
                  {navigationGroups.map((group) => (
                    <nav key={group.label} className={styles.linkColumn} aria-label={group.label} data-footer-group="">
                      {group.links.map((link) => (
                        <Link key={link.href} href={link.href}>
                          <span className={styles.linkLabel}><RollingLabel text={link.label} /></span>
                          <ArrowUpRight aria-hidden="true" />
                        </Link>
                      ))}
                    </nav>
                  ))}
                </div>
              </div>
            </div>
            <address className={styles.address} aria-label="Mailing address" data-footer-group="">
              701 Tillery St #12, Mailbox #289, Austin, TX 78702
            </address>
            <div className={styles.identityReveal} data-footer-identity-reveal="">
              <div className={styles.identity} data-footer-identity="">
                <Link href="/" className={styles.wordmark} aria-label="burgama home">burgama</Link>
              </div>
            </div>
            <div className={styles.bottomRow}>
              <p>© {new Date().getFullYear()} burgama</p>
              <nav className={styles.legalLinks} aria-label="Legal">
                <Link href="/privacy">Privacy</Link>
                <Link href="/terms">Terms</Link>
              </nav>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
