'use client'

import { useLayoutEffect, useRef, type ReactNode } from 'react'
import { gsap, ScrollTrigger } from '@/lib/motion'

type Direction = 'photographic' | 'identity' | 'packaging' | 'screen' | 'comparison' | 'document' | 'reading'

const directions: Record<string, Direction> = {
  'wagner-wealth': 'identity',
  'sidecar-spirits': 'document',
  'harvest-dating': 'identity',
  go2bites: 'photographic',
  cellinkey: 'photographic',
  matchday: 'document',
  'hush-hush-tan': 'document',
  'clement-senior-solutions': 'screen',
  wurqly: 'screen',
  'hiking-pony': 'packaging',
  smoothsailing: 'screen',
  '10-pillar-productions': 'screen',
  'alh-senior-solutions': 'screen',
  'dr-saba-syed': 'screen',
  turant: 'screen',
  avro: 'reading',
  'patent-earth': 'reading',
  ollivate: 'reading',
  cloon: 'reading',
  'matchday-social': 'comparison',
  'matchday-local-seo': 'reading',
  'hush-hush-tan-social': 'comparison',
  'clement-local-search': 'screen',
}

export function CaseStudyMotion({ slug, children }: { slug: string; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null)
  const direction = directions[slug] ?? 'reading'

  useLayoutEffect(() => {
    const root = ref.current
    if (!root) return
    const media = gsap.matchMedia(root)
    media.add({ wide: '(min-width: 700px)', motion: '(prefers-reduced-motion: no-preference)' }, context => {
      if (!context.conditions?.motion) return
      const wide = Boolean(context.conditions.wide)
      const distance = wide ? 1 : 0.35
      const hero = root.querySelector<HTMLElement>('.studio-hero')
      const opening = root.querySelector<HTMLElement>('.portfolio-detail-hero')

      if (hero) {
        gsap.to(hero.querySelector('.studio-title'), {
          y: -32 * distance,
          x: -12 * distance,
          ease: 'none',
          scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
        })
        gsap.to(hero.querySelector('.studio-hero-children'), {
          y: -14 * distance,
          ease: 'none',
          scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
        })
      }

      if (opening) {
        const frame = opening.querySelector('.case-media-frame')
        const measured = direction === 'screen' || direction === 'document' || direction === 'comparison'
        gsap.fromTo(frame, {
          scale: measured ? 0.985 : wide ? 0.94 : 0.97,
          y: (measured ? 16 : 42) * distance,
        }, {
          scale: 1, y: 0, ease: 'none',
          scrollTrigger: { trigger: opening, start: 'top bottom', end: 'top 22%', scrub: true },
        })
      }

      root.querySelectorAll<HTMLElement>('[data-case-module]').forEach(module => {
        const kind = module.dataset.caseModule
        const title = module.querySelector<HTMLElement>('.case-module-title, .case-quote')
        if (title) {
          gsap.fromTo(title, { x: (direction === 'reading' ? 14 : 22) * distance }, {
            x: 0, ease: 'power2.out',
            scrollTrigger: { trigger: module, start: 'top 94%', end: 'top 64%', scrub: true },
          })
        }

        const figures = Array.from(module.querySelectorAll<HTMLElement>('.case-media'))
        const paired = kind === 'mediaPair' || kind === 'mediaGrid'
        if (paired && wide && direction === 'photographic') {
          figures.forEach((figure, index) => {
            const sign = index % 2 === 0 ? 1 : -1
            gsap.fromTo(figure, { y: sign * 42 }, {
              y: -sign * 28, ease: 'none',
              scrollTrigger: { trigger: module, start: 'top bottom', end: 'bottom top', scrub: true },
            })
          })
          return
        }

        figures.forEach((figure, index) => {
          const frame = figure.querySelector('.case-media-frame')
          const readable = figure.dataset.mediaKind !== 'image' || direction === 'comparison'
          if (readable) {
            gsap.fromTo(frame, { y: (wide ? 22 : 10), scale: 0.99 }, {
              y: 0, scale: 1, ease: 'none',
              scrollTrigger: {
                trigger: wide && paired ? module : figure,
                start: paired && wide && index > 0 ? 'top 86%' : 'top 96%',
                end: 'top 58%', scrub: true,
              },
            })
          } else if (paired) {
            gsap.fromTo(frame, {
              clipPath: wide ? `inset(0% ${index % 2 ? 0 : 8}% 0% ${index % 2 ? 8 : 0}%)` : 'inset(0% 0% 8% 0%)',
              y: wide ? 0 : 12,
            }, {
              clipPath: 'inset(0% 0% 0% 0%)', y: 0, ease: 'none',
              scrollTrigger: { trigger: figure, start: 'top 98%', end: 'top 62%', scrub: true },
            })
          } else if (direction === 'photographic') {
            gsap.fromTo(frame, { y: 32 * distance, scale: wide ? 0.965 : 0.98 }, {
              y: -20 * distance, scale: 1, ease: 'none',
              scrollTrigger: { trigger: figure, start: 'top bottom', end: 'bottom 20%', scrub: true },
            })
          } else {
            gsap.fromTo(frame, { clipPath: 'inset(0% 5% 0% 5%)' }, {
              clipPath: 'inset(0% 0% 0% 0%)', ease: 'none',
              scrollTrigger: { trigger: figure, start: 'top 98%', end: 'top 38%', scrub: true },
            })
          }
        })

        if (kind === 'process') {
          gsap.fromTo(module.querySelectorAll('.case-process > li'), { x: 16 * distance }, {
            x: 0, stagger: 0.12, ease: 'none',
            scrollTrigger: { trigger: module, start: 'top 90%', end: 'bottom 65%', scrub: true },
          })
        }
      })

      const next = root.querySelector<HTMLElement>('.portfolio-next')
      if (next) {
        gsap.fromTo(next.querySelector('.portfolio-next-artwork'), {
          scale: wide ? 0.94 : 0.97,
          clipPath: 'inset(10% 0% 0% 0%)',
        }, {
          scale: 1, clipPath: 'inset(0% 0% 0% 0%)', ease: 'none',
          scrollTrigger: { trigger: next, start: 'top bottom', end: 'top 28%', scrub: true },
        })
        gsap.fromTo(next.querySelector('.portfolio-next-caption'), { x: -24 * distance }, {
          x: 0, ease: 'none',
          scrollTrigger: { trigger: next, start: 'top 95%', end: 'bottom 88%', scrub: true },
        })
      }
    })

    let disposed = false
    let frame = 0
    const refresh = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        if (!disposed) ScrollTrigger.refresh()
      })
    }
    // Intrinsic media sizes reserve space; observe only actual layout changes, not scroll transforms.
    const resize = new ResizeObserver(refresh)
    resize.observe(root)
    void document.fonts.ready.then(() => { if (!disposed) refresh() })
    window.addEventListener('pageshow', refresh)
    root.dataset.motionReady = 'true'
    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      resize.disconnect()
      window.removeEventListener('pageshow', refresh)
      media.revert()
      delete root.dataset.motionReady
    }
  }, [slug, direction])

  return <article ref={ref} className="portfolio portfolio-detail" data-case-direction={direction} aria-labelledby="project-title">{children}</article>
}
