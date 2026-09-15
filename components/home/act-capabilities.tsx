'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { homeSlopePath } from '@/lib/home-curve'
import { ModularButton } from '@/components/modular-button'
import { Reveal } from '@/components/reveal'
import { SectionRise } from '@/components/home/section-rise'
import styles from './home-page.module.css'

const topics = [
  { title: 'strategy', stage: 'understand', description: 'We get to know your business, your audience, and what needs to change. The result is a focused brief that gives the work a clear purpose.' },
  { title: 'identity', stage: 'shape', description: 'We find what makes you distinct, then give it a voice and a visual language. A shared direction for everything your business puts into the world.' },
  { title: 'websites', stage: 'make', description: 'We bring structure, design, and development together. Clear, considered websites that help people understand your business and take the next step.' },
  { title: 'content', stage: 'make', description: 'Photography, film, and words, made with the same direction in mind. We create the pieces your brand needs to show up consistently.' },
  { title: 'campaigns', stage: 'shape + make', description: 'We connect the message, the creative, and the channels. Campaigns built around who you need to reach and what you want to move forward.' },
  { title: 'refinement', stage: 'improve', description: 'The launch is a beginning. We listen to feedback, learn from performance, and keep improving the things that make a difference.' },
]

const lanes = [topics.slice(0, 3), topics.slice(3)]

export function ActCapabilities() {
  const sectionRef = useRef<HTMLElement>(null)
  const streamRef = useRef<HTMLDivElement>(null)
  const syncRef = useRef<() => void>(() => {})
  const selectedButton = useRef<HTMLButtonElement | null>(null)
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
    const stream = streamRef.current
    if (!section || !stream || !CSS.supports('offset-path', 'path("M 0 0 L 1 1")')) return

    const reduced = matchMedia('(prefers-reduced-motion: reduce)')
    const rows = [...stream.querySelectorAll<HTMLElement>('[data-topic-lane]')]
    let animations: Animation[] = []
    let inView = false
    let disposed = false
    let frame = 0
    let previousWidth = 0

    const sync = () => {
      const reasons = playback.current
      const shouldPause = !inView || document.hidden || reasons.hovered || reasons.focused || reasons.selected || reasons.manual
      const now = Number(document.timeline.currentTime ?? 0)
      for (const animation of animations) {
        if (shouldPause && animation.playState !== 'paused') animation.pause()
        else if (!shouldPause && animation.playState !== 'running') {
          const elapsed = Number(animation.currentTime ?? 0)
          animation.play()
          animation.startTime = now - elapsed
        }
      }
    }
    syncRef.current = sync

    const rebuild = () => {
      if (disposed) return
      const phases = animations.map(animation => Number(animation.currentTime ?? 0) / Number(animation.effect?.getTiming().duration || 1))
      animations.forEach(animation => animation.cancel())
      animations = []
      previousWidth = stream.clientWidth
      if (reduced.matches) {
        delete section.dataset.topicsAnimated
        return
      }

      section.dataset.topicsAnimated = 'true'
      rows.forEach((row, laneIndex) => {
        const nodes = [...row.querySelectorAll<HTMLElement>('[data-topic-node]')]
        const widths = nodes.map(node => node.offsetWidth)
        const widest = Math.max(...widths)
        const width = row.clientWidth
        const height = row.clientHeight
        const rise = Math.min(90, width * 0.1)
        const extension = widest / 2 + 28
        const path = homeSlopePath(width, rise, (height - rise) / 2, extension, laneIndex ? 'left' : 'right')
        row.style.setProperty('--topic-path', `path('${path}')`)
        const measurement = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        measurement.setAttribute('d', path)
        const length = measurement.getTotalLength()
        const gap = width < 700 ? 60 : 96
        const contentLength = widths.reduce((total, wordWidth) => total + wordWidth + gap, 0)
        const cycleLength = Math.max(contentLength, length + widest + gap)
        const duration = cycleLength / (width < 700 ? 23 : 32) * 1000
        const travelFraction = length / cycleLength
        const extraGap = (cycleLength - contentLength) / nodes.length
        let center = extension + widths[0] / 2

        nodes.forEach((node, index) => {
          const position = laneIndex ? 1 - center / cycleLength : center / cycleLength
          const animation = node.animate([
            { offset: 0, offsetDistance: laneIndex ? '100%' : '0%', opacity: 1 },
            { offset: travelFraction, offsetDistance: laneIndex ? '0%' : '100%', opacity: 1 },
            { offset: 1, offsetDistance: laneIndex ? '0%' : '100%', opacity: 0 },
          ], { duration, delay: -((position + 1) % 1) * duration, iterations: Infinity, easing: 'linear' })
          animation.pause()
          animation.currentTime = (phases[laneIndex * 3 + index] ?? 0) * duration
          animations.push(animation)
          center += widths[index] / 2 + (widths[index + 1] ?? widths[0]) / 2 + gap + extraGap
        })
      })
      sync()
    }

    const schedule = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(rebuild)
    }
    const intersection = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; sync() })
    const resize = new ResizeObserver(() => { if (stream.clientWidth !== previousWidth) schedule() })
    rebuild()
    intersection.observe(stream)
    resize.observe(stream)
    reduced.addEventListener('change', schedule)
    document.addEventListener('visibilitychange', sync)
    document.fonts.ready.then(() => { if (!disposed) schedule() })
    document.fonts.addEventListener('loadingdone', schedule)

    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      animations.forEach(animation => animation.cancel())
      intersection.disconnect()
      resize.disconnect()
      reduced.removeEventListener('change', schedule)
      document.removeEventListener('visibilitychange', sync)
      document.fonts.removeEventListener('loadingdone', schedule)
      syncRef.current = () => {}
      delete section.dataset.topicsAnimated
    }
  }, [])

  function closeTopic(restoreFocus = false) {
    setSelected(null)
    if (restoreFocus) selectedButton.current?.focus({ preventScroll: true })
  }

  return (
    <section id="capabilities" ref={sectionRef} className={styles.capabilities} data-nav-surface="frost" aria-labelledby="capabilities-heading">
      <div className={styles.processInner}>
        <Reveal><h2 id="capabilities-heading" className={styles.processHeading}>how we work</h2></Reveal>
        <div className={styles.processInteractive} onKeyDown={event => {
          if (event.nativeEvent.isComposing || event.keyCode === 229) return
          if (event.key === 'Escape' && selected) { event.preventDefault(); closeTopic(true) }
          if (event.key === 'Tab' && streamRef.current) streamRef.current.dataset.keyboard = 'true'
        }} onFocusCapture={event => {
          playback.current.focused = event.target.matches(':focus-visible')
          if (playback.current.focused && streamRef.current) streamRef.current.dataset.keyboard = 'true'
          syncRef.current()
        }} onBlurCapture={event => {
          if (event.currentTarget.contains(event.relatedTarget)) return
          playback.current.focused = false
          if (streamRef.current) delete streamRef.current.dataset.keyboard
          syncRef.current()
        }}>
          <div ref={streamRef} className={styles.processStream} role="group" aria-label="Explore our process" onPointerEnter={event => {
            if (event.pointerType !== 'touch') { playback.current.hovered = true; syncRef.current() }
          }} onPointerLeave={() => { playback.current.hovered = false; syncRef.current() }}>
            {lanes.map((lane, laneIndex) => (
              <div key={laneIndex} className={styles.processLane} data-topic-lane>
                {lane.map(topic => (
                  <div key={topic.title} className={styles.processTopic} data-topic-node>
                    <button type="button" aria-pressed={selected === topic.title} aria-controls={`${id}-detail`} onClick={event => {
                      selectedButton.current = event.currentTarget
                      setSelected(current => current === topic.title ? null : topic.title)
                    }}>{topic.title}</button>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className={styles.processDetails} id={`${id}-detail`} role="region" aria-label="About our process" aria-live="polite" aria-atomic="true">
            <div className={styles.processExplanation} data-active={selected === null} aria-hidden={selected !== null}>
              <h3>understand. shape. make. improve.</h3>
              <p>One shared direction, from the first conversation to what comes next. Explore what goes into the work.</p>
            </div>
            {topics.map(topic => (
              <div key={topic.title} className={styles.processExplanation} data-active={selected === topic.title} aria-hidden={selected !== topic.title}>
                <h3>{topic.title} / {topic.stage}</h3>
                <p>{topic.description}</p>
              </div>
            ))}
          </div>
          <div className={styles.processTools}>
            <button type="button" className={styles.processMotion} aria-pressed={paused} onClick={() => setPaused(current => !current)}>{paused ? 'resume motion' : 'pause motion'}</button>
            <button type="button" className={styles.processDismiss} disabled={!selected} onClick={() => closeTopic(true)}>close topic</button>
          </div>
        </div>
        <noscript>
          <style>{`.${styles.processInteractive} { display: none; }`}</style>
          <dl className={styles.processFallback}>{topics.map(topic => <div key={topic.title}><dt>{topic.title} — {topic.stage}</dt><dd>{topic.description}</dd></div>)}</dl>
        </noscript>
        <Reveal className={styles.processAction}><ModularButton href="#start-a-project">start a project</ModularButton></Reveal>
      </div>
      <SectionRise surface="navy" />
    </section>
  )
}
