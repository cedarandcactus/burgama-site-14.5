'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { gsap, ScrollTrigger } from '@/lib/motion'

export function WorkShowcase({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const media = gsap.matchMedia(root)
    media.add({
      desktop: '(min-width: 700px)',
      mobile: '(max-width: 699px)',
      reduced: '(prefers-reduced-motion: reduce)',
    }, (context) => {
      if (context.conditions?.reduced) return
      const desktop = context.conditions?.desktop
      const travel = desktop ? 18 : 8

      root.querySelectorAll<HTMLElement>('[data-showcase]').forEach((card) => {
        const artwork = card.querySelector<HTMLElement>('.portfolio-showcase-media')
        const image = card.querySelector<HTMLElement>('.project-tile-image')
        const caption = card.querySelector<HTMLElement>('.project-tile-caption')
        if (!artwork || !image || !caption) return

        gsap.fromTo(artwork, { y: travel }, {
          y: -travel,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        })
        gsap.fromTo(image, { y: desktop ? 12 : 6, opacity: 0.7 }, {
          y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 92%', once: true },
        })
        gsap.fromTo(caption, { y: desktop ? 18 : 8, opacity: 0.7 }, {
          y: 0, opacity: 1, duration: 0.75, ease: 'power3.out',
          scrollTrigger: { trigger: caption, start: 'top 96%', once: true },
        })
      })
    })

    let disposed = false
    let frame = 0
    const refresh = () => {
      if (disposed) return
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        if (!disposed) ScrollTrigger.refresh()
      })
    }
    const images = Array.from(root.querySelectorAll('img'))
    images.forEach(image => {
      image.addEventListener('load', refresh)
      image.addEventListener('error', refresh)
    })
    const observer = new ResizeObserver(refresh)
    observer.observe(root)
    document.fonts.ready.then(refresh)
    document.fonts.addEventListener('loadingdone', refresh)

    // Page entrance transforms must settle before measuring document scroll positions.
    const entrances: Animation[] = []
    for (let parent = root.parentElement; parent; parent = parent.parentElement) {
      entrances.push(...parent.getAnimations())
    }
    Promise.allSettled(entrances.map(animation => animation.finished)).then(refresh)

    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      observer.disconnect()
      images.forEach(image => {
        image.removeEventListener('load', refresh)
        image.removeEventListener('error', refresh)
      })
      document.fonts.removeEventListener('loadingdone', refresh)
      media.revert()
    }
  }, [])

  return <div ref={rootRef} className="portfolio-showcase">{children}</div>
}
