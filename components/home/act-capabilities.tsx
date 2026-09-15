'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react'
import { ModularButton } from '@/components/modular-button'
import { Reveal } from '@/components/reveal'
import { SectionRise } from '@/components/home/section-rise'
import styles from './home-page.module.css'

const stages = [
  { title: 'understand', description: 'We get to know your business, your audience, and what needs to change. Together, we turn those conversations into a focused strategy and brief.' },
  { title: 'shape', description: 'We find what makes you distinct, then shape the positioning, voice, and visual identity. One creative direction for everything that follows.' },
  { title: 'make', description: 'We bring the direction to life through websites, imagery, film, words, and campaigns. Every piece made to work together.' },
  { title: 'improve', description: 'We listen to feedback and learn from performance after launch. Then we refine the work, carrying what we learn into the next cycle.' },
]

// Four circular shoulders joined with short tangent curves keep the marker smooth at each inward turn.
const loopPath = 'M 326 92.55 A 160 160 0 1 1 547.45 314 Q 538.31 320 547.45 326 A 160 160 0 1 1 326 547.45 Q 320 538.31 314 547.45 A 160 160 0 1 1 92.55 326 Q 101.69 320 92.55 314 A 160 160 0 1 1 314 92.55 Q 320 101.69 326 92.55 Z'
const innerPath = 'M 320 257.46 A 160 160 0 0 0 382.54 320 A 160 160 0 0 0 320 382.54 A 160 160 0 0 0 257.46 320 A 160 160 0 0 0 320 257.46 Z'
const cycleDuration = 16000

export function ActCapabilities() {
  const sectionRef = useRef<HTMLElement>(null)
  const diagramRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const markerRef = useRef<SVGGElement>(null)
  const motionButtonRef = useRef<HTMLButtonElement>(null)
  const selectedButton = useRef<HTMLButtonElement | null>(null)
  const syncRef = useRef<() => void>(() => {})
  const playback = useRef({ hovered: false, focused: false, selected: false, manual: false })
  const [selected, setSelected] = useState<string | null>(null)
  const [paused, setPaused] = useState(false)
  const id = useId()

  useEffect(() => {
    playback.current.selected = selected !== null
    playback.current.manual = paused
    syncRef.current()
  }, [selected, paused])

  useEffect(() => {
    const section = sectionRef.current
    const diagram = diagramRef.current
    const path = pathRef.current
    const marker = markerRef.current
    if (!section || !diagram || !path || !marker || typeof path.getPointAtLength !== 'function') return

    const reduced = matchMedia('(prefers-reduced-motion: reduce)')
    const length = path.getTotalLength()
    if (!Number.isFinite(length) || length <= 0) return
    let inView = false
    let frame = 0
    let previousTime: number | null = null
    let elapsed = cycleDuration * 0.875

    const position = () => {
      const point = path.getPointAtLength((elapsed / cycleDuration) * length)
      marker.setAttribute('transform', `translate(${point.x} ${point.y})`)
    }
    const shouldRun = () => {
      const reasons = playback.current
      return inView && !document.hidden && !reduced.matches && !reasons.hovered && !reasons.focused && !reasons.selected && !reasons.manual
    }
    const tick = (time: number) => {
      frame = 0
      if (!shouldRun()) { previousTime = null; return }
      if (previousTime !== null) elapsed = (elapsed + time - previousTime) % cycleDuration
      previousTime = time
      position()
      frame = requestAnimationFrame(tick)
    }
    const sync = () => {
      section.dataset.loopMotion = reduced.matches ? 'false' : 'true'
      if (shouldRun()) {
        if (!frame) frame = requestAnimationFrame(tick)
      } else {
        cancelAnimationFrame(frame)
        frame = 0
        previousTime = null
      }
    }
    const preferenceChanged = () => {
      if (reduced.matches && document.activeElement === motionButtonRef.current) {
        const target = selectedButton.current ?? diagram.querySelector<HTMLButtonElement>('button')
        target?.focus({ preventScroll: true })
      }
      sync()
    }
    syncRef.current = sync
    const intersection = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      sync()
    })
    position()
    sync()
    intersection.observe(diagram)
    reduced.addEventListener('change', preferenceChanged)
    document.addEventListener('visibilitychange', sync)

    return () => {
      cancelAnimationFrame(frame)
      intersection.disconnect()
      reduced.removeEventListener('change', preferenceChanged)
      document.removeEventListener('visibilitychange', sync)
      syncRef.current = () => {}
      delete section.dataset.loopMotion
    }
  }, [])

  function closeStage(restoreFocus = false) {
    setSelected(null)
    if (restoreFocus) selectedButton.current?.focus({ preventScroll: true })
  }

  return (
    <section id="capabilities" ref={sectionRef} className={styles.capabilities} data-nav-surface="frost" aria-labelledby="capabilities-heading">
      <div className={styles.processInner}>
        <Reveal><h2 id="capabilities-heading" className={styles.processHeading}>how we work</h2></Reveal>
        <div className={styles.processInteractive} onKeyDown={event => {
          if (event.nativeEvent.isComposing || event.keyCode === 229) return
          if (event.key === 'Escape' && selected) { event.preventDefault(); closeStage(true) }
          if (['Tab', 'Enter', ' '].includes(event.key)) {
            playback.current.focused = true
            syncRef.current()
          }
        }} onPointerDownCapture={() => {
          playback.current.focused = false
          syncRef.current()
        }} onFocusCapture={event => {
          playback.current.focused = event.target.matches(':focus-visible')
          syncRef.current()
        }} onBlurCapture={event => {
          if (event.currentTarget.contains(event.relatedTarget)) return
          playback.current.focused = false
          syncRef.current()
        }}>
          <div ref={diagramRef} className={styles.processDiagram} role="group" aria-label="Explore our process: understand, shape, make, improve" onPointerEnter={event => {
            if (event.pointerType !== 'touch') { playback.current.hovered = true; syncRef.current() }
          }} onPointerLeave={() => { playback.current.hovered = false; syncRef.current() }}>
            <svg className={styles.processGraphic} viewBox="0 0 640 640" fill="none" aria-hidden="true" focusable="false">
              <g className={styles.processOutline}>
                <path ref={pathRef} d={loopPath} vectorEffect="non-scaling-stroke" />
                <path d={innerPath} vectorEffect="non-scaling-stroke" />
              </g>
              <ArrowRight x={302} y={162} width={36} height={36} strokeWidth={1.8} />
              <ArrowDown x={442} y={302} width={36} height={36} strokeWidth={1.8} />
              <ArrowLeft x={302} y={442} width={36} height={36} strokeWidth={1.8} />
              <ArrowUp x={162} y={302} width={36} height={36} strokeWidth={1.8} />
              <g ref={markerRef} className={styles.processMarker} transform="translate(66.86 66.86)">
                <circle r="10" vectorEffect="non-scaling-stroke" />
              </g>
            </svg>
            <div className={styles.processStages}>
              {stages.map(stage => (
                <div key={stage.title} className={styles.processStage} data-stage={stage.title}>
                  <button type="button" aria-pressed={selected === stage.title} aria-controls={`${id}-detail`} onClick={event => {
                    selectedButton.current = event.currentTarget
                    setSelected(current => current === stage.title ? null : stage.title)
                  }}>{stage.title}</button>
                  <noscript><h3>{stage.title}</h3></noscript>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.processDetails} id={`${id}-detail`} role="region" aria-label="About our process" aria-live="polite" aria-atomic="true">
            <div className={styles.processExplanation} data-active={selected === null} aria-hidden={selected !== null}>
              <p>One shared direction, from the first conversation to what comes next.</p>
            </div>
            {stages.map(stage => (
              <div key={stage.title} className={styles.processExplanation} data-active={selected === stage.title} aria-hidden={selected !== stage.title}>
                <h3>{stage.title}</h3>
                <p>{stage.description}</p>
              </div>
            ))}
          </div>
          <div className={styles.processTools}>
            <button ref={motionButtonRef} type="button" className={styles.processMotion} aria-pressed={paused} onClick={() => setPaused(current => !current)}>{paused ? 'resume motion' : 'pause motion'}</button>
            <button type="button" className={styles.processDismiss} disabled={!selected} onClick={() => closeStage(true)}>close stage</button>
          </div>
        </div>
        <noscript>
          <style>{`.${styles.processStage} button, .${styles.processDetails}, .${styles.processTools} { display: none; }`}</style>
          <dl className={styles.processFallback}>{stages.map(stage => <div key={stage.title}><dt>{stage.title}</dt><dd>{stage.description}</dd></div>)}</dl>
        </noscript>
        <Reveal className={styles.processAction}><ModularButton href="#start-a-project">start a project</ModularButton></Reveal>
      </div>
      <SectionRise surface="navy" />
    </section>
  )
}
