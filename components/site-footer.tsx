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

const headline = 'Ready for what comes next'
const words = headline.split(' ')
const socialLinks = [
  {
    label: 'Instagram',
    href: 'https://instagram.com/byburgama/?hl=af',
    paths: [
      'M4 8a4 4 0 0 1 4 -4h8a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-8a4 4 0 0 1 -4 -4l0 -8',
      'M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0',
      'M16.5 7.5v.01',
    ],
  },
  {
    label: 'TikTok',
    href: 'https://tiktok.com/@byburgama',
    paths: ['M21 7.917v4.034a9.948 9.948 0 0 1 -5 -1.951v4.5a6.5 6.5 0 1 1 -8 -6.326v4.326a2.5 2.5 0 1 0 4 2v-11.5h4.083a6.005 6.005 0 0 0 4.917 4.917'],
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/company/cedarandcactus',
    paths: [
      'M8 11v5',
      'M8 8v.01',
      'M12 16v-5',
      'M16 16v-3a2 2 0 1 0 -4 0',
      'M3 7a4 4 0 0 1 4 -4h10a4 4 0 0 1 4 4v10a4 4 0 0 1 -4 4h-10a4 4 0 0 1 -4 -4l0 -10',
    ],
  },
]
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
      { label: 'Research', href: '/research' },
      { label: 'Contact', href: '#start-a-project' },
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

export function SiteFooter({ enquiryHeading }: { enquiryHeading?: string }) {
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
    let refreshTimer: ReturnType<typeof setTimeout> | undefined
    const enquiry = root.querySelector<HTMLElement>('[data-inline-enquiry]')
    let curveEntrance = 0
    let curveDestination = 0
    const measureCurve = () => {
      const svg = svgRef.current
      const path = pathRef.current
      const text = textRef.current
      if (!svg || !path || !text || lead.dataset.curved !== 'true') return
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
      clearTimeout(refreshTimer)
      refreshTimer = setTimeout(() => {
        if (disposed || enquiry?.querySelector('[data-layout-animating="true"]')) return
        refreshFrame = requestAnimationFrame(() => {
          if (disposed || enquiry?.querySelector('[data-layout-animating="true"]')) return
          measureWordmark()
          measureCurve()
          ScrollTrigger.refresh()
        })
      }, 100)
    }

    media.add({
      desktop: '(min-width: 700px)',
      mobile: '(max-width: 699px)',
      reduced: '(prefers-reduced-motion: reduce)',
    }, (context) => {
      if (context.conditions?.reduced) return

      if (context.conditions?.desktop && textPathRef.current) {
        lead.dataset.curved = 'true'
        measureCurve()
        const timeline = gsap.timeline({
          scrollTrigger: {
            id: `footer-roll-${titleId}`,
            trigger: lead,
            start: 'top bottom',
            end: 'bottom 35%',
            onRefreshInit: measureCurve,
            scrub: 0.65,
            invalidateOnRefresh: true,
          },
        })
        timeline.fromTo(textPathRef.current, { attr: { startOffset: () => curveEntrance } }, {
          attr: { startOffset: () => curveDestination },
          duration: 3,
          ease: 'none',
        }, 0)
        timeline.to({}, { duration: 0.2 })
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
        delete lead.dataset.curved
        for (const element of [track, ...Array.from(track.children), ...letters, ...groups, identity]) {
          element?.removeAttribute('style')
        }
      }
    })

    // Ancestor entrance transforms must settle before scroll coordinates are measured.
    const entranceAnimations: Animation[] = []
    for (let parent = root.parentElement; parent; parent = parent.parentElement) {
      entranceAnimations.push(...parent.getAnimations())
    }
    Promise.allSettled(entranceAnimations.map(animation => animation.finished)).then(refresh)
    document.fonts.ready.then(refresh)
    document.fonts.addEventListener('loadingdone', refresh)
    let previousWidth = root.clientWidth
    let previousFormHeight = 0
    enquiry?.addEventListener('enquiry-layout-settled', refresh)
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
      clearTimeout(refreshTimer)
      enquiry?.removeEventListener('enquiry-layout-settled', refresh)
      observer.disconnect()
      document.fonts.removeEventListener('loadingdone', refresh)
      media.revert()
    }
  }, [titleId])

  return (
    <div ref={rootRef} className={styles.ending} data-site-ending="">
      <section ref={leadRef} className={styles.lead} aria-labelledby={titleId} data-footer-lead="" data-nav-surface="frost">
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
          <svg ref={svgRef} className={styles.curvedHeadline} aria-hidden="true" focusable="false">
              <defs><path ref={pathRef} id={curveId} d={homeCurvePath(1440, 144, 220, 3200)} /></defs>
              <text ref={textRef}>
                <textPath ref={textPathRef} href={`#${curveId}`} startOffset="3200">{headline}</textPath>
              </text>
          </svg>
        </div>
        <SectionRise surface="powder" />
      </section>
      <section id="start-a-project" className={styles.enquiry} data-inline-enquiry="" data-search-section="start-a-project" data-nav-surface="frost" aria-labelledby="start-a-project-heading">
        <h2 id="start-a-project-heading" className="sr-only">Ready for what comes next</h2>
        <Reveal className={styles.enquiryInner}>
          <ProjectEnquiryForm variant="inline" introHeading={enquiryHeading} />
          <noscript><style>{'[data-inline-enquiry] form { display: none; }'}</style><p>Email <a href="mailto:hello@burgama.com">hello@burgama.com</a> to start a project.</p></noscript>
        </Reveal>
        <SectionRise surface="navy" direction="left" />
      </section>
      <div className={styles.footerFrame}>
        <footer className={styles.footer} data-site-footer="" data-nav-surface="ink">
          <FooterFilm />
          <div className={styles.content}>
            <div className={styles.topRow}>
              <div className={styles.invitation}>
                <FooterUpdates />
              </div>
              <div className={styles.utilities}>
                <div className={styles.navigation}>
                  {navigationGroups.map((group) => (
                    <div key={group.label} className={styles.navigationGroup} data-footer-group="">
                      <nav className={styles.linkColumn} aria-label={group.label}>
                        {group.links.map((link) => (
                          <Link key={link.href} href={link.href}>
                            <span className={styles.linkLabel}><RollingLabel text={link.label} /></span>
                            <ArrowUpRight aria-hidden="true" />
                          </Link>
                        ))}
                      </nav>
                      {group.label === 'The studio' && (
                        <nav className={styles.socialLinks} aria-label="Follow Burgama">
                          {socialLinks.map(({ label, href, paths }) => (
                            <a key={label} className={styles.socialLink} href={href} target="_blank" rel="noopener noreferrer" aria-label={`${label} (opens in a new tab)`}>
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                                {paths.map((path) => <path key={path} d={path} />)}
                              </svg>
                            </a>
                          ))}
                        </nav>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className={styles.identityReveal} data-footer-identity-reveal="">
              <div className={styles.identity} data-footer-identity="">
                <Link href="/" className={styles.wordmark} aria-label="burgama home" data-haptics="logo"><span data-footer-wordmark="">burgama</span></Link>
              </div>
            </div>
            <div className={styles.bottomRow}>
              <address className={styles.address}>
                Based in Texas. Borderless in practice.
              </address>
              <div className={styles.bottomLegal}>
                <p>© 2026 burgama</p>
                <nav className={styles.legalLinks} aria-label="Legal">
                  <Link href="/cookies">Cookies</Link>
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
