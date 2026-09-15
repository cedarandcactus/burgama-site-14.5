'use client'

import { useEffect, useRef } from 'react'
import styles from './client-ticker.module.css'

const logos = [
  { file: 'harvest', name: 'Harvest', shape: 'wordmark' },
  { file: 'wagner', name: 'Wagner Wealth Management', shape: 'symbol' },
  { file: 'sidecar', name: 'Sidecar Spirits', shape: 'script' },
  { file: 'avro', name: 'AVRO', shape: 'wordmark' },
  { file: 'go2bites', name: 'Go2Bites', shape: 'symbol' },
  { file: 'cellinkey', name: 'Cellinkey', shape: 'wordmark' },
  { file: 'wurqly-cobalt', format: 'svg', name: 'Wurqly', shape: 'wordmark' },
  { file: 'clement', name: 'Clement Senior Solutions', shape: 'wordmark' },
  { file: 'logo-21', name: 'Hush Hush Tan', shape: 'symbol' },
  { file: 'matchday', name: 'MatchDay', shape: 'wordmark' },
  { file: 'hiking-pony', name: 'Hiking Pony Coffee Co.', shape: 'illustration' },
  { file: 'smoothsailing', name: 'Smoothsailing Sustainability', shape: 'wordmark' },
  { file: 'cloon', name: 'Cloon', shape: 'symbol' },
  { file: 'livelihood', name: 'Livelihood', shape: 'wordmark' },
  { file: 'logo-02', name: 'Zeytin', shape: 'script' },
]

function logoPath(width: number, height: number) {
  const center = height * 0.5
  return `M ${width + 100} ${center} L -100 ${center}`
}

export function ClientTicker() {
  const sectionRef = useRef<HTMLElement>(null)
  const windowRef = useRef<HTMLDivElement>(null)
  const groupRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const windowElement = windowRef.current
    const group = groupRef.current
    if (!section || !windowElement || !group || !CSS.supports('offset-path', 'path("M 0 0 L 1 1")')) return

    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)')
    const nodes = [...group.children] as HTMLElement[]
    let animations: Animation[] = []
    let inView = false
    let focused = false
    let lastWidth = 0

    const syncPlayback = () => {
      const paused = !inView || document.hidden || focused
      const sharedStart = Number(document.timeline.currentTime ?? 0) - Number(animations[0]?.currentTime ?? 0)
      for (const animation of animations) {
        if (paused) animation.pause()
        else {
          animation.play()
          animation.startTime = sharedStart
        }
      }
    }

    const rebuild = () => {
      const phase = animations[0]?.currentTime
      const previousDuration = Number(animations[0]?.effect?.getTiming().duration || 1)
      for (const animation of animations) animation.cancel()
      animations = []
      if (reducedMotion.matches) {
        delete section.dataset.animated
        return
      }

      section.dataset.animated = 'true'
      const width = windowElement.clientWidth
      const height = windowElement.clientHeight
      lastWidth = width
      const path = logoPath(width, height)
      group.style.setProperty('--logo-path', `path('${path}')`)

      const measurement = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      measurement.setAttribute('d', path)
      const pathLength = measurement.getTotalLength()
      const spacing = width < 700 ? 170 : 220
      const speed = width < 700 ? 26 : 34
      const duration = Math.max(logos.length * spacing, pathLength + spacing) / speed * 1000
      const travelFraction = pathLength / speed * 1000 / duration
      const elapsedTime = typeof phase === 'number' ? phase / previousDuration * duration : 0
      const frames: Keyframe[] = Array.from({ length: 121 }, (_, index) => {
        const progress = index / 120
        const point = measurement.getPointAtLength(progress * pathLength)
        const edgeDistance = Math.min(point.x, width - point.x) - (width < 700 ? 12 : 20)
        const fade = Math.max(0, Math.min(1, edgeDistance / (width < 700 ? 64 : 130)))
        const clarity = fade * fade * (3 - 2 * fade)
        return {
          offset: progress * travelFraction,
          offsetDistance: `${progress * 100}%`,
          opacity: clarity,
        }
      })
      frames.push({ offset: 1, offsetDistance: '100%', opacity: 0 })

      animations = nodes.map((node, index) => {
        const phaseOffset = (0.12 + (logos.length - index) / logos.length) % 1
        const animation = node.animate(frames, {
          duration,
          delay: -phaseOffset * duration,
          iterations: Infinity,
          easing: 'linear',
        })
        animation.pause()
        animation.currentTime = elapsedTime
        return animation
      })
      syncPlayback()
    }

    const focus = () => { focused = true; syncPlayback() }
    const blur = () => { focused = false; syncPlayback() }
    const intersection = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      syncPlayback()
    })
    const resize = new ResizeObserver(() => {
      if (!reducedMotion.matches && windowElement.clientWidth !== lastWidth) rebuild()
    })

    rebuild()
    intersection.observe(section)
    resize.observe(windowElement)
    reducedMotion.addEventListener('change', rebuild)
    document.addEventListener('visibilitychange', syncPlayback)
    section.addEventListener('focusin', focus)
    section.addEventListener('focusout', blur)

    return () => {
      animations.forEach((animation) => animation.cancel())
      intersection.disconnect()
      resize.disconnect()
      reducedMotion.removeEventListener('change', rebuild)
      document.removeEventListener('visibilitychange', syncPlayback)
      section.removeEventListener('focusin', focus)
      section.removeEventListener('focusout', blur)
      delete section.dataset.animated
    }
  }, [])

  return (
    <section ref={sectionRef} className={styles.section} aria-label="Brands we have worked with" tabIndex={0} aria-describedby="client-motion-hint">
      <span id="client-motion-hint" className="sr-only">Keep keyboard focus here to pause the logo motion.</span>
      <div ref={windowRef} className={styles.window}>
        <ul ref={groupRef} className={styles.group}>
          {logos.map((logo) => (
            <li className={`${styles.logo} ${styles[logo.shape]}`} key={logo.file}>
              <span
                className={styles.artwork}
                role="img"
                aria-label={logo.name}
                style={{ maskImage: `url('/client-logos/${logo.file}.${logo.format ?? 'webp'}')` }}
              />
            </li>
          ))}
        </ul>
        <div className={`${styles.glass} ${styles.glassLeft}`} aria-hidden="true" />
        <div className={`${styles.glass} ${styles.glassRight}`} aria-hidden="true" />
      </div>
    </section>
  )
}
