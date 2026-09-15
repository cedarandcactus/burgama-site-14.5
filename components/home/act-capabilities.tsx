'use client'

import { useEffect, useRef, useState } from 'react'
import { ModularButton } from '@/components/modular-button'
import { Reveal } from '@/components/reveal'
import { SectionRise } from '@/components/home/section-rise'
import { homeCurvePath } from '@/lib/home-curve'
import styles from './home-page.module.css'

export function ActCapabilities() {
  const sectionRef = useRef<HTMLElement>(null)
  const graphicRef = useRef<SVGSVGElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const markerRef = useRef<SVGCircleElement>(null)
  const syncRef = useRef<() => void>(() => {})
  const pausedRef = useRef(false)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    const graphic = graphicRef.current
    const path = pathRef.current
    const marker = markerRef.current
    if (!section || !graphic || !path || !marker) return

    const reduced = matchMedia('(prefers-reduced-motion: reduce)')
    let visible = false
    let frame = 0
    let previousTime: number | null = null
    let elapsed = 2500
    let length = 0
    const duration = 14000

    const position = () => {
      if (!length) return
      const progress = reduced.matches ? .5 : elapsed / duration
      const point = path.getPointAtLength(progress * length)
      marker.setAttribute('cx', String(point.x))
      marker.setAttribute('cy', String(point.y))
      // Fade only at the edges so the repeating dot never visibly jumps back.
      marker.setAttribute('opacity', String(Math.min(1, progress / .025, (1 - progress) / .025)))
    }
    const shouldRun = () => visible && !document.hidden && !reduced.matches && !pausedRef.current && length > 0
    const tick = (time: number) => {
      frame = 0
      if (!shouldRun()) { previousTime = null; return }
      if (previousTime !== null) elapsed = (elapsed + time - previousTime) % duration
      previousTime = time
      position()
      frame = requestAnimationFrame(tick)
    }
    const sync = () => {
      section.dataset.loopMotion = String(!reduced.matches && length > 0)
      if (shouldRun()) {
        if (!frame) frame = requestAnimationFrame(tick)
      } else {
        cancelAnimationFrame(frame)
        frame = 0
        previousTime = null
      }
    }
    const measure = () => {
      const { width, height } = graphic.getBoundingClientRect()
      if (!width || !height) return
      graphic.setAttribute('viewBox', `0 0 ${width} ${height}`)
      path.setAttribute('d', homeCurvePath(width, height))
      length = path.getTotalLength()
      position()
      sync()
    }
    const preferenceChanged = () => { position(); sync() }
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync() })
    const resize = new ResizeObserver(measure)
    syncRef.current = sync
    measure()
    intersection.observe(graphic)
    resize.observe(graphic)
    reduced.addEventListener('change', preferenceChanged)
    document.addEventListener('visibilitychange', sync)

    return () => {
      cancelAnimationFrame(frame)
      intersection.disconnect()
      resize.disconnect()
      reduced.removeEventListener('change', preferenceChanged)
      document.removeEventListener('visibilitychange', sync)
      syncRef.current = () => {}
      delete section.dataset.loopMotion
    }
  }, [])

  return (
    <section id="capabilities" ref={sectionRef} className={styles.capabilities} data-nav-surface="frost" aria-labelledby="capabilities-heading">
      <div className={styles.processInner}>
        <Reveal>
          <h2 id="capabilities-heading" className={styles.processHeading}>how we work</h2>
          <p className={styles.processDescription}>We start by listening, getting to know your business and what makes it different. Together, we shape a clear direction and bring it to life through identity, websites, content, and campaigns. We stay close to the work after launch, learning from what connects and refining what comes next.</p>
        </Reveal>
        <Reveal className={styles.processAction}><ModularButton href="#start-a-project">start a project</ModularButton></Reveal>
        <button type="button" className={styles.processMotion} aria-pressed={paused} onClick={() => {
          pausedRef.current = !pausedRef.current
          setPaused(pausedRef.current)
          syncRef.current()
        }}>{paused ? 'resume motion' : 'pause motion'}</button>
      </div>
      <svg ref={graphicRef} className={styles.processGraphic} viewBox="0 0 1000 100" preserveAspectRatio="none" fill="none" aria-hidden="true" focusable="false">
        <path ref={pathRef} className={styles.processOutline} d={homeCurvePath(1000, 100)} vectorEffect="non-scaling-stroke" />
        <circle ref={markerRef} className={styles.processMarker} r="6" opacity="0" />
      </svg>
      <SectionRise surface="navy" />
    </section>
  )
}
