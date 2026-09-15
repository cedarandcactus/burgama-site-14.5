'use client'

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import styles from './home-page.module.css'

export function WorkReel({ children, count }: { children: ReactNode; count: number }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef(0)
  const [active, setActive] = useState(0)

  const readPosition = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const cards = Array.from(track.children) as HTMLElement[]
    const inset = parseFloat(getComputedStyle(track).paddingInlineStart) || 0
    const trackLeft = track.getBoundingClientRect().left + inset
    let nearest = 0
    let distance = Infinity
    cards.forEach((card, index) => {
      const nextDistance = Math.abs(card.getBoundingClientRect().left - trackLeft)
      if (nextDistance < distance) {
        distance = nextDistance
        nearest = index
      }
    })
    setActive(nearest)
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const observer = new ResizeObserver(readPosition)
    observer.observe(track)
    readPosition()
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frameRef.current)
    }
  }, [readPosition])

  function scrollToCard(index: number) {
    const track = trackRef.current
    const card = track?.children[Math.max(0, Math.min(count - 1, index))] as HTMLElement | undefined
    if (!track || !card) return
    const inset = parseFloat(getComputedStyle(track).paddingInlineStart) || 0
    track.scrollTo({
      left: track.scrollLeft + card.getBoundingClientRect().left - track.getBoundingClientRect().left - inset,
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    })
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.nativeEvent.isComposing || event.keyCode === 229 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? count - 1 : active + (event.key === 'ArrowRight' ? 1 : -1)
    scrollToCard(next)
    if (event.target !== event.currentTarget) {
      const track = trackRef.current
      const card = track?.children[Math.max(0, Math.min(count - 1, next))] as HTMLElement | undefined
      card?.focus({ preventScroll: true })
    }
  }

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
        onScroll={() => {
          cancelAnimationFrame(frameRef.current)
          frameRef.current = requestAnimationFrame(readPosition)
        }}
        onFocusCapture={(event) => {
          const card = event.target.closest<HTMLElement>('.project-tile')
          if (card) card.scrollIntoView({ block: 'nearest', inline: 'start', behavior: 'instant' })
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
          <button type="button" aria-label="Previous project" aria-controls="featured-project-reel" aria-disabled={active === 0} onClick={() => active > 0 && scrollToCard(active - 1)}><ArrowLeft size={20} aria-hidden="true" /></button>
          <button type="button" aria-label="Next project" aria-controls="featured-project-reel" aria-disabled={active === count - 1} onClick={() => active < count - 1 && scrollToCard(active + 1)}><ArrowRight size={20} aria-hidden="true" /></button>
        </div>
      </div>
    </div>
  )
}
