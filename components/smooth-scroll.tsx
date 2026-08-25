'use client'

import Lenis from 'lenis'
import { useEffect } from 'react'
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/motion'

/**
 * Lenis, driven by GSAP's ticker.
 *
 * The two libraries fight if each runs its own loop: Lenis writes a new scroll
 * position on its own rAF while ScrollTrigger samples on GSAP's, so triggers
 * read a stale offset and pinned sections visibly jitter. The fix is to give
 * up Lenis's internal loop entirely — GSAP's ticker becomes the single clock,
 * and `ScrollTrigger.update` runs from Lenis's own scroll event so a trigger
 * can never sample a position Lenis has not published yet.
 *
 * `lagSmoothing(0)` is required alongside this. By default GSAP freezes the
 * ticker after a long frame to avoid a visual jump, which under smooth scroll
 * reads as the page briefly sticking.
 */
export function SmoothScroll() {
  useEffect(() => {
    /*
      Reduced motion gets the native scroller. Lenis inertia is exactly the
      "scroll hijacking" the accessibility rules ask to drop, and the site is
      fully readable without it.
    */
    if (prefersReducedMotion()) return

    const lenis = new Lenis({
      /*
        Restraint over drama. Lenis's default (~1.2s at 0.1 lerp) reads as
        floaty; this is enough glide to feel continuous without the page
        continuing to travel noticeably after the finger or wheel stops.
      */
      duration: 1.05,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      /*
        Touch devices keep their native scrolling. Smoothing touch is where
        Lenis most often feels wrong, and the brief explicitly warns against
        motion that traps the user on mobile.
      */
      smoothWheel: true,
      touchMultiplier: 1,
    })

    lenis.on('scroll', ScrollTrigger.update)

    const tick = (time: number) => {
      // GSAP ticker reports seconds; Lenis expects milliseconds.
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    /*
      Anchor links stop working once Lenis owns the scroll position, because
      the browser's native jump is fighting the smoothed value. Route in-page
      anchors through Lenis so /#work and the skip link both still land.
    */
    const onAnchorClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest?.(
        'a[href^="#"]',
      ) as HTMLAnchorElement | null
      if (!anchor) return
      const id = anchor.getAttribute('href')
      if (!id || id === '#') return
      const target = document.querySelector(id)
      if (!target) return
      event.preventDefault()
      lenis.scrollTo(target as HTMLElement, { offset: -24 })
    }

    document.addEventListener('click', onAnchorClick)

    return () => {
      document.removeEventListener('click', onAnchorClick)
      gsap.ticker.remove(tick)
      gsap.ticker.lagSmoothing(500, 33)
      lenis.destroy()
    }
  }, [])

  return null
}
