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
  const videoRef = useRef<HTMLVideoElement>(null)

  /*
    Playback is driven here rather than with the `autoPlay` attribute, so the
    clip never starts before the motion preference has been read. Reduced
    motion leaves the poster frame in place. The clip is also paused while
    the hero is offscreen, so a 16MB loop isn't decoding for the whole page.
  */
  useEffect(() => {
    const video = videoRef.current
    const section = sectionRef.current
    if (!video || !section) return

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let visible = true

    const sync = () => {
      if (motion.matches || !visible) {
        video.pause()
        return
      }
      // Autoplay can still be refused; the poster stays visible if so.
      void video.play().catch(() => {})
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        sync()
      },
      { threshold: 0 },
    )
    observer.observe(section)

    motion.addEventListener('change', sync)
    sync()

    return () => {
      observer.disconnect()
      motion.removeEventListener('change', sync)
    }
  }, [])

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
        Decorative: the footage carries atmosphere, not information, so it
        stays out of the accessibility tree. The still frame is the poster, so
        the hero paints immediately at 35KB while the 16MB clip streams in
        behind it — and it remains the visible frame if the video is paused
        for reduced motion, or never loads at all.
      */}
      <video
        ref={videoRef}
        className="hero-image"
        poster="/hero/vault.jpg"
        aria-hidden="true"
        muted
        loop
        playsInline
        preload="metadata"
      >
        <source src="/hero/vault.mp4" type="video/mp4" />
      </video>
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
