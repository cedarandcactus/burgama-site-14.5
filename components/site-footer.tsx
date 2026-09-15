'use client'

import { useEffect, useId, useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import Link from '@/components/transition-link'
import { FooterFilm } from '@/components/footer-film'
import { FooterUpdates } from '@/components/footer-updates'
import { Reveal } from '@/components/reveal'
import { ProjectEnquiryForm } from '@/components/nav-project-form'
import { SectionRise } from '@/components/home/section-rise'
import { gsap, ScrollTrigger } from '@/lib/motion'
import { homeCurveExtensionLength, homeCurvePath } from '@/lib/home-curve'
import styles from '@/components/site-footer.module.css'

const headline = 'ready for what comes next'
const words = headline.split(' ')
const navigationGroups = [
  {
    label: 'Explore',
    links: [
      { label: 'How we work', href: '/#capabilities' },
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
  const curveId = `footer-curve-${useId().replace(/:/g, '')}`
  const svgRef = useRef<SVGSVGElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const textRef = useRef<SVGTextElement>(null)
  const textPathRef = useRef<SVGTextPathElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const lead = leadRef.current
    const track = trackRef.current
    if (!root || !lead || !track) return

    const media = gsap.matchMedia(root)
    const identity = root.querySelector<HTMLElement>('[data-footer-identity]')
    const groups = Array.from(root.querySelectorAll<HTMLElement>('[data-footer-group]'))
    const letters = Array.from(track.querySelectorAll<HTMLElement>('[data-footer-letter]'))
    let disposed = false
    let refreshFrame = 0
    let curveEntrance = 0
    let curveDestination = 0
    const measureCurve = () => {
      const svg = svgRef.current
      const path = pathRef.current
      const text = textRef.current
      if (!home || !svg || !path || !text || lead.dataset.curved !== 'true') return
      const width = lead.clientWidth
      const height = lead.clientHeight
      const rise = root.querySelector<SVGSVGElement>('[data-footer-lead] > svg')?.getBoundingClientRect().height ?? 100
      text.style.removeProperty('font-size')
      const textWidth = text.getComputedTextLength()
      const extension = Math.max(width, textWidth) + 160
      const d = homeCurvePath(width, rise, height - rise - 48, extension)
      const leftLength = homeCurveExtensionLength(width, rise, extension)
      svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
      path.setAttribute('d', d)
      curveDestination = leftLength + Math.min(width * 0.05, width * 0.94 - textWidth)
      curveEntrance = leftLength + width * 0.42
    }
    const measureWordmark = () => {
      const wordmark = root.querySelector<HTMLElement>('[data-footer-wordmark]')
      const link = wordmark?.parentElement
      if (!wordmark || !link || !wordmark.offsetWidth) return
      const size = Number.parseFloat(getComputedStyle(wordmark).fontSize)
      link.style.setProperty('--footer-wordmark-size', `${size * link.clientWidth * 0.995 / wordmark.offsetWidth}px`)
    }
    measureWordmark()
    const refresh = () => {
      if (disposed) return
      cancelAnimationFrame(refreshFrame)
      refreshFrame = requestAnimationFrame(() => {
        if (!disposed) {
          measureWordmark()
          measureCurve()
          ScrollTrigger.refresh()
        }
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
        if (home) {
          lead.dataset.curved = 'true'
          measureCurve()
        }
        const entrance = () => lead.clientWidth * 0.72
        const destination = () => Math.min(0, lead.clientWidth * 0.92 - track.scrollWidth)
        const timeline = gsap.timeline({
          scrollTrigger: {
            id: `footer-roll-${titleId}`,
            trigger: lead,
            start: home ? 'top bottom' : 'top top',
            end: home ? 'bottom 35%' : () => `+=${Math.max(600, Math.min(1300, track.scrollWidth * 0.55))}`,
            onRefreshInit: measureCurve,
            pin: !home,
            // Page wrappers use transforms, which change the containing block for fixed pins.
            pinType: 'transform',
            scrub: 0.65,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })

        if (home && textPathRef.current) {
          timeline.fromTo(textPathRef.current, { attr: { startOffset: () => curveEntrance } }, {
            attr: { startOffset: () => curveDestination },
            duration: 3,
            ease: 'none',
          }, 0)
        } else {
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
        }

        timeline.to({}, { duration: 0.2 })
      } else if (!home) {
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
        delete lead.dataset.curved
        for (const element of [track, ...Array.from(track.children), ...letters, ...groups, identity]) {
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
    let previousFormHeight = 0
    const enquiry = root.querySelector<HTMLElement>('[data-inline-enquiry]')
    const observer = new ResizeObserver(() => {
      const formHeight = enquiry?.offsetHeight ?? 0
      if (root.clientWidth === previousWidth && formHeight === previousFormHeight) return
      previousWidth = root.clientWidth
      previousFormHeight = formHeight
      refresh()
    })
    observer.observe(root)
    if (enquiry) observer.observe(enquiry)

    return () => {
      disposed = true
      cancelAnimationFrame(refreshFrame)
      observer.disconnect()
      document.fonts.removeEventListener('loadingdone', refresh)
      media.revert()
    }
  }, [titleId, home])

  return (
    <div ref={rootRef} className={styles.ending} data-site-ending="" data-home={home}>
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
          {home && (
            <svg ref={svgRef} className={styles.curvedHeadline} aria-hidden="true" focusable="false">
              <defs><path ref={pathRef} id={curveId} d={homeCurvePath(1440, 144, 220, 3200)} /></defs>
              <text ref={textRef}>
                <textPath ref={textPathRef} href={`#${curveId}`} startOffset="3200">{headline}</textPath>
              </text>
            </svg>
          )}
        </div>
        {home && <SectionRise surface="powder" />}
      </section>
      {home && <section id="start-a-project" className={styles.enquiry} data-inline-enquiry="" data-nav-surface="frost" aria-label="Start a project">
        <Reveal className={styles.enquiryInner}>
          <ProjectEnquiryForm variant="inline" />
          <noscript><style>{'[data-inline-enquiry] form { display: none; }'}</style><p>Email <a href="mailto:hello@burgama.com">hello@burgama.com</a> to start a project.</p></noscript>
        </Reveal>
        <SectionRise surface="navy" direction="left" />
      </section>}
      <div className={styles.footerFrame} data-home={home}>
        <footer className={styles.footer} data-site-footer="" data-home={home} data-work={work} data-nav-surface={home ? 'ink' : undefined}>
          <FooterFilm />
          <div className={styles.content}>
            <div className={styles.topRow}>
              <div className={styles.invitation}>
                <FooterUpdates />
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
            <div className={styles.identityReveal} data-footer-identity-reveal="">
              <div className={styles.identity} data-footer-identity="">
                <Link href="/" className={styles.wordmark} aria-label="burgama home"><span data-footer-wordmark="">burgama</span></Link>
              </div>
            </div>
            <div className={styles.bottomRow}>
              <address className={styles.address} aria-label="Mailing address">
                701 Tillery St #12, Mailbox #289, Austin, TX 78702
              </address>
              <div className={styles.bottomLegal}>
                <p>© 2026 burgama</p>
                <nav className={styles.legalLinks} aria-label="Legal">
                  <Link href="/privacy">Privacy</Link>
                  <Link href="/terms">Terms</Link>
                </nav>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
