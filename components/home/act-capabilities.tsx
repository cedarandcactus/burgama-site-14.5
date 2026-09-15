'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { ModularButton } from '@/components/modular-button'
import { Reveal } from '@/components/reveal'
import { SectionRise } from '@/components/home/section-rise'
import styles from './home-page.module.css'

const stages = [
  { title: 'understand', caption: 'find the starting point', description: 'We get to know your business, your audience, and what needs to change. Together, we turn those conversations into a focused strategy and brief.' },
  { title: 'shape', caption: 'give it a direction', description: 'We find what makes you distinct, then shape the positioning, voice, and visual identity. One creative direction for everything that follows.' },
  { title: 'make', caption: 'bring it to life', description: 'We bring the direction to life through websites, imagery, film, words, and campaigns. Every piece made to work together.' },
  { title: 'improve', caption: 'keep moving forward', description: 'We listen to feedback and learn from performance after launch. Then we refine the work, carrying what we learn into the next cycle.' },
]

const routes = [
  {
    layout: 'wide',
    viewBox: '0 0 1000 520',
    path: 'M 24 460 H 148 Q 180 460 180 428 Q 180 396 148 396 H 110 Q 80 396 80 366 V 230 Q 80 190 55 190 Q 20 190 20 150 Q 20 110 60 110 H 195 Q 240 110 240 155 Q 240 200 285 200 H 440 Q 480 200 480 240 V 260 Q 480 300 440 300 H 420 Q 380 300 380 340 Q 380 380 420 380 H 720 Q 770 380 770 330 V 85 Q 770 40 815 40 H 960',
    stops: [[80, 340], [330, 200], [590, 380], [770, 180]],
  },
  {
    layout: 'narrow',
    viewBox: '0 0 400 760',
    path: 'M 20 20 Q 50 20 50 50 V 110 Q 50 155 95 155 H 305 Q 350 155 350 200 V 295 Q 350 340 305 340 H 95 Q 50 340 50 385 V 490 Q 50 535 95 535 H 305 Q 350 535 350 580 V 690 Q 350 735 305 735 H 210',
    stops: [[50, 80], [350, 260], [50, 450], [350, 640]],
  },
]
const cycleDuration = 18000

function StageMark({ index }: { index: number }) {
  if (index === 0) return <circle r="15" />
  if (index === 1) return <rect x="-14" y="-14" width="28" height="28" rx="7" transform="rotate(45)" />
  if (index === 2) return <><rect x="-7" y="-18" width="14" height="36" rx="6" /><rect x="-18" y="-7" width="36" height="14" rx="6" /></>
  return <><rect x="-5" y="-18" width="10" height="36" rx="4" /><rect x="-18" y="-5" width="36" height="10" rx="4" /><rect x="-5" y="-18" width="10" height="36" rx="4" transform="rotate(45)" /><rect x="-5" y="-18" width="10" height="36" rx="4" transform="rotate(-45)" /></>
}

export function ActCapabilities() {
  const sectionRef = useRef<HTMLElement>(null)
  const diagramRef = useRef<HTMLDivElement>(null)
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
    if (!section || !diagram) return

    const reduced = matchMedia('(prefers-reduced-motion: reduce)')
    const narrow = matchMedia('(max-width: 599px)')
    let path: SVGPathElement | null = null
    let marker: SVGGElement | null = null
    let length = 0
    let inView = false
    let frame = 0
    let previousTime: number | null = null
    let elapsed = 0

    const position = () => {
      if (!path || !marker || !length) return
      const progress = elapsed / cycleDuration
      const point = path.getPointAtLength(progress * length)
      marker.setAttribute('transform', `translate(${point.x} ${point.y})`)
      // Fade at the open ends so the repeating journey never visibly jumps back.
      marker.setAttribute('opacity', String(reduced.matches ? 0 : Math.min(1, progress / .035, (1 - progress) / .035)))
    }
    const measure = () => {
      const graphic = diagram.querySelector(`svg[data-layout="${narrow.matches ? 'narrow' : 'wide'}"]`)
      path = graphic?.querySelector<SVGPathElement>('[data-process-route]') ?? null
      marker = graphic?.querySelector<SVGGElement>('[data-process-tracer]') ?? null
      length = typeof path?.getTotalLength === 'function' ? path.getTotalLength() : 0
      if (!Number.isFinite(length)) length = 0
      position()
    }
    const shouldRun = () => {
      const reasons = playback.current
      return length > 0 && inView && !document.hidden && !reduced.matches && !reasons.hovered && !reasons.focused && !reasons.selected && !reasons.manual
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
      section.dataset.loopMotion = reduced.matches || !length ? 'false' : 'true'
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
      position()
      sync()
    }
    const layoutChanged = () => { measure(); sync() }
    syncRef.current = sync
    const intersection = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      sync()
    })
    measure()
    sync()
    intersection.observe(diagram)
    narrow.addEventListener('change', layoutChanged)
    reduced.addEventListener('change', preferenceChanged)
    document.addEventListener('visibilitychange', sync)

    return () => {
      cancelAnimationFrame(frame)
      intersection.disconnect()
      narrow.removeEventListener('change', layoutChanged)
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
            {routes.map(route => (
              <svg key={route.layout} data-layout={route.layout} className={styles.processGraphic} viewBox={route.viewBox} fill="none" aria-hidden="true" focusable="false">
                <path data-process-route className={styles.processOutline} d={route.path} vectorEffect="non-scaling-stroke" />
                {route.stops.map(([x, y], index) => (
                  <g key={stages[index].title} className={styles.processStop} data-selected={selected === stages[index].title} transform={`translate(${x} ${y})`}>
                    <StageMark index={index} />
                  </g>
                ))}
                <g data-process-tracer className={styles.processMarker} opacity="0">
                  <circle r="7" vectorEffect="non-scaling-stroke" />
                </g>
              </svg>
            ))}
            <div className={styles.processStages}>
              {stages.map(stage => (
                <div key={stage.title} className={styles.processStage} data-stage={stage.title}>
                  <button type="button" aria-pressed={selected === stage.title} aria-controls={`${id}-detail`} onClick={event => {
                    selectedButton.current = event.currentTarget
                    setSelected(current => current === stage.title ? null : stage.title)
                  }}><span>{stage.title}</span></button>
                  <noscript><h3>{stage.title}</h3></noscript>
                  <p className={styles.processCaption}>{stage.caption}</p>
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
