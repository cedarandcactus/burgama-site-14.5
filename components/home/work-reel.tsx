'use client'

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { CircularArrowIcon } from '@/components/circular-arrow-icon'
import { gsap } from '@/lib/motion'
import styles from './home-page.module.css'

export function WorkReel({ children, count }: { children: ReactNode; count: number }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef(0)
  const targetRef = useRef(0)
  const scrollTween = useRef<ReturnType<typeof gsap.to> | null>(null)
  const entrance = useRef<ReturnType<typeof gsap.timeline> | null>(null)
  const animatedNodes = useRef<HTMLElement[]>([])
  const movingFocus = useRef(false)
  const [active, setActive] = useState(0)

  const readPosition = useCallback(() => {
    const track = trackRef.current
    if (!track || scrollTween.current) return
    const cards = Array.from(track.children) as HTMLElement[]
    const inset = parseFloat(getComputedStyle(track).paddingInlineStart) || 0
    const trackLeft = track.getBoundingClientRect().left + inset
    let nearest = 0
    let distance = Infinity
    cards.forEach((card, index) => {
      const nextDistance = Math.abs(card.getBoundingClientRect().left - trackLeft)
      if (nextDistance < distance) { distance = nextDistance; nearest = index }
    })
    targetRef.current = nearest
    setActive(nearest)
  }, [])

  const stopMotion = useCallback(() => {
    scrollTween.current?.kill()
    scrollTween.current = null
    entrance.current?.kill()
    entrance.current = null
    if (animatedNodes.current.length) gsap.set(animatedNodes.current, { clearProps: 'transform,opacity,willChange' })
    animatedNodes.current = []
    if (trackRef.current) delete trackRef.current.dataset.moving
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    let width = track.clientWidth
    const observer = new ResizeObserver(() => {
      if (width !== track.clientWidth) { width = track.clientWidth; stopMotion() }
      readPosition()
    })
    const reduced = matchMedia('(prefers-reduced-motion: reduce)')
    const reset = () => { stopMotion(); readPosition() }
    observer.observe(track)
    reduced.addEventListener('change', reset)
    readPosition()
    return () => {
      observer.disconnect()
      reduced.removeEventListener('change', reset)
      cancelAnimationFrame(frameRef.current)
      stopMotion()
    }
  }, [readPosition, stopMotion])

  function scrollToCard(index: number, instant = false) {
    const track = trackRef.current
    const next = Math.max(0, Math.min(count - 1, index))
    const card = track?.children[next] as HTMLElement | undefined
    if (!track || !card) return
    const direction = next >= targetRef.current ? 1 : -1
    stopMotion()
    targetRef.current = next
    setActive(next)
    const inset = parseFloat(getComputedStyle(track).paddingInlineStart) || 0
    const left = Math.max(0, Math.min(track.scrollWidth - track.clientWidth, track.scrollLeft + card.getBoundingClientRect().left - track.getBoundingClientRect().left - inset))
    const image = card.querySelector<HTMLImageElement>('.project-tile-image img')
    const caption = card.querySelector<HTMLElement>('.project-tile-caption')
    if (image) { image.loading = 'eager'; void image.decode().catch(() => {}) }

    if (instant || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      track.scrollTo({ left, behavior: 'instant' })
      return
    }

    track.dataset.moving = 'true'
    animatedNodes.current = [image, caption].filter((node): node is HTMLElement => node !== null)
    const timeline = gsap.timeline({ onComplete: () => {
      gsap.set(animatedNodes.current, { clearProps: 'transform,opacity,willChange' })
      animatedNodes.current = []
      entrance.current = null
    } })
    entrance.current = timeline
    if (image) timeline.fromTo(image, { x: direction * 24, scale: 1.025, opacity: 0.85, willChange: 'transform,opacity' }, { x: 0, scale: 1, opacity: 1, duration: 0.95, ease: 'power3.out' }, 0)
    if (caption) timeline.fromTo(caption, { y: 14, opacity: 0.35, willChange: 'transform,opacity' }, { y: 0, opacity: 1, duration: 0.65, ease: 'power3.out' }, 0.16)
    scrollTween.current = gsap.to(track, { scrollLeft: left, duration: 0.9, ease: 'power3.out', onComplete: () => {
      scrollTween.current = null
      delete track.dataset.moving
      readPosition()
    } })
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.nativeEvent.isComposing || event.keyCode === 229 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? count - 1 : targetRef.current + (event.key === 'ArrowRight' ? 1 : -1)
    scrollToCard(next)
    if (event.target !== event.currentTarget) {
      const card = trackRef.current?.children[Math.max(0, Math.min(count - 1, next))] as HTMLElement | undefined
      movingFocus.current = true
      card?.focus({ preventScroll: true })
      movingFocus.current = false
    }
  }

  function interrupt() { stopMotion(); readPosition() }

  return (
    <div className={styles.workReel}>
      <div
        ref={trackRef}
        id="featured-project-reel"
        className={styles.workTrack}
        role="region"
        aria-roledescription="carousel"
        aria-label="Selected projects"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={interrupt}
        onWheel={interrupt}
        onScroll={() => {
          cancelAnimationFrame(frameRef.current)
          frameRef.current = requestAnimationFrame(readPosition)
        }}
        onFocusCapture={event => {
          if (movingFocus.current) return
          const card = event.target.closest<HTMLElement>('.project-tile')
          if (card && trackRef.current) scrollToCard(Array.from(trackRef.current.children).indexOf(card), true)
        }}
      >
        {children}
      </div>
      <div className={styles.reelControls}>
        <div className={styles.reelPosition}>
          <span className="sr-only" aria-live="polite" aria-atomic="true">Project {active + 1} of {count}</span>
          <div className={styles.reelProgress} aria-hidden="true"><span style={{ width: `${((active + 1) / count) * 100}%` }} /></div>
        </div>
        <div className={styles.reelArrows}>
          <button type="button" aria-label="Previous project" aria-controls="featured-project-reel" aria-disabled={active === 0} onClick={() => targetRef.current > 0 && scrollToCard(targetRef.current - 1)}><span className="arrow-capsule"><CircularArrowIcon direction="left" /></span></button>
          <button type="button" aria-label="Next project" aria-controls="featured-project-reel" aria-disabled={active === count - 1} onClick={() => targetRef.current < count - 1 && scrollToCard(targetRef.current + 1)}><span className="arrow-capsule"><CircularArrowIcon /></span></button>
        </div>
      </div>
    </div>
  )
}
