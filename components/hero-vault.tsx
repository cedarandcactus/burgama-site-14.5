'use client'

import { useEffect, useRef } from 'react'

/*
  Full-bleed hero over the vault photograph. Scrolling drives a single
  custom property, `--scroll` (0 at rest, 1 once the hero has fully left
  the viewport), which CSS uses to push the image toward the arch of light
  while the copy settles out. One rAF-batched listener, no per-frame React
  state, and the effect is skipped outright for reduced-motion readers.
*/
export function HeroVault({ count }: { count: number }) {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0

    const update = () => {
      frame = 0
      const height = section.offsetHeight || 1
      const progress = Math.min(Math.max(window.scrollY / height, 0), 1)
      section.style.setProperty('--scroll', progress.toFixed(4))
    }

    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(update)
    }

    const start = () => {
      if (motion.matches) {
        section.style.setProperty('--scroll', '0')
        return
      }
      update()
      window.addEventListener('scroll', onScroll, { passive: true })
      window.addEventListener('resize', onScroll)
    }

    const stop = () => {
      if (frame) cancelAnimationFrame(frame)
      frame = 0
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }

    start()
    const onPreferenceChange = () => {
      stop()
      start()
    }
    motion.addEventListener('change', onPreferenceChange)

    return () => {
      stop()
      motion.removeEventListener('change', onPreferenceChange)
    }
  }, [])

  return (
    <section ref={sectionRef} className="hero" aria-labelledby="home-title">
      {/*
        Decorative: the photograph carries atmosphere, not information, so it
        stays out of the accessibility tree. Eager + high priority because it
        is the largest above-the-fold paint.
      */}
      <img
        src="/hero/vault.jpg"
        alt=""
        className="hero-image"
        fetchPriority="high"
        decoding="async"
      />
      <div className="hero-scrim" aria-hidden="true" />

      <div className="hero-copy">
        <p className="hero-marker">
          All projects <span className="hero-count">{count}</span>
        </p>
        <h1 id="home-title" className="hero-statement">
          Burgama is an independent creative studio in Austin, Texas.
        </h1>
      </div>
    </section>
  )
}
