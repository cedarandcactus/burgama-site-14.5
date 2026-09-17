'use client'

import { useEffect, useRef, useState } from 'react'
import { createScrollMomentum, gsap } from '@/lib/motion'
import { ModularButton } from '@/components/modular-button'
import { Reveal } from '@/components/reveal'
import { SectionRise } from '@/components/home/section-rise'
import styles from './home-page.module.css'

export function ActCapabilities() {
  const sectionRef = useRef<HTMLElement>(null)
  const [showVideo, setShowVideo] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    const video = section?.querySelector('video')
    if (!section || !video) return
    const media = gsap.matchMedia()
    media.add({ motion: '(prefers-reduced-motion: no-preference)', wide: '(min-width: 700px)' }, (context) => {
      if (!context.conditions?.motion) {
        video.pause()
        return
      }

      const isWide = Boolean(context.conditions?.wide)
      let active = false
      let inViewport = false
      let sourceAttached = false
      const updatePlayback = () => {
        if (active && !sourceAttached) {
          video.preload = 'metadata'
          video.muted = true
          video.src = '/videos/bg-2.mp4'
          video.load()
          sourceAttached = true
        }
        if (active && video.paused) {
          void video.play().catch(() => setShowVideo(false))
        } else if (!active) {
          video.pause()
        }
      }
      const observer = new IntersectionObserver(([entry]) => {
        inViewport = entry.isIntersecting
        active = inViewport && !document.hidden
        updatePlayback()
      }, { rootMargin: '320px 0px', threshold: 0.01 })
      observer.observe(section)
      const onVisibilityChange = () => {
        active = inViewport && !document.hidden
        updatePlayback()
      }
      document.addEventListener('visibilitychange', onVisibilityChange)
      const travel = () => Math.max(0, -parseFloat(getComputedStyle(video).top) - 36) * (isWide ? 1 : 0.55)
      gsap.fromTo(video, { y: () => -travel() }, {
        y: travel,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.65,
          invalidateOnRefresh: true,
        },
      })
      const heading = section.querySelector<HTMLElement>('h2')
      const momentumCleanup = createScrollMomentum(section, [
        { element: video, distance: isWide ? 24 : 8 },
        ...(heading ? [{ element: heading, distance: isWide ? -12 : -4 }] : []),
      ])
      return () => {
        momentumCleanup?.()
        observer.disconnect()
        document.removeEventListener('visibilitychange', onVisibilityChange)
        video.pause()
        video.removeAttribute('src')
        video.load()
      }
    })
    return () => media.revert()
  }, [])

  return (
    <section ref={sectionRef} id="capabilities" className={styles.capabilities} data-nav-surface="ink" aria-labelledby="capabilities-heading">
      <div className={styles.processMedia} aria-hidden="true">
        <video
          className={styles.processVideo}
          data-background-video=""
          data-visible={showVideo}
          onPlaying={() => setShowVideo(true)}
          onPause={() => setShowVideo(false)}
          onError={() => setShowVideo(false)}
          autoPlay muted loop playsInline controls={false}
          disablePictureInPicture disableRemotePlayback
          controlsList="nodownload nofullscreen noremoteplayback"
          preload="metadata" tabIndex={-1}
        />
        <div className={styles.processVideoShade} />
      </div>
      <div className={styles.processInner}>
        <div className={styles.processContent}>
          <Reveal variant="scroll">
            <h2 id="capabilities-heading" className={styles.processHeading}>How we work</h2>
            <p className={styles.processDescription}>We start by listening, getting to know your business and what makes it different. Together, we shape a clear direction and bring it to life through identity, websites, content, and campaigns. We stay close to the work after launch, learning from what connects and refining what comes next.</p>
          </Reveal>
          <Reveal delay={140} className={styles.processAction}><ModularButton href="#start-a-project">start a project</ModularButton></Reveal>
        </div>
      </div>
      <SectionRise surface="navy" />
    </section>
  )
}
