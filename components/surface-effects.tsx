'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import styles from './surface-effects.module.css'

export function SurfaceEffects() {
  const cursor = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    const element = cursor.current
    if (!element) return
    const media = matchMedia('(prefers-reduced-motion: no-preference)')
    const touch = matchMedia('(pointer: coarse)')
    let frame = 0
    let active = false
    let x = 0
    let y = 0
    let targetX = 0
    let targetY = 0
    let previousTime = 0

    function hide() {
      active = false
      element!.dataset.visible = 'false'
      cancelAnimationFrame(frame)
      frame = 0
    }
    function animate(time: number) {
      frame = 0
      if (!active) return
      const elapsed = previousTime ? Math.min(time - previousTime, 48) : 16
      previousTime = time
      const blend = 1 - Math.exp(-elapsed / 42)
      x += (targetX - x) * blend
      y += (targetY - y) * blend
      const speed = Math.min(Math.hypot(targetX - x, targetY - y) / 180, .12)
      element!.style.transform = `translate3d(${x - 56}px, ${y - 46}px, 0) scale(${1 + speed}, ${1 - speed})`
      if (Math.abs(targetX - x) + Math.abs(targetY - y) > .1) frame = requestAnimationFrame(animate)
    }
    function move(event: PointerEvent) {
      if (!media.matches || touch.matches || event.pointerType !== 'mouse' || document.hidden) { hide(); return }
      targetX = event.clientX
      targetY = event.clientY
      if (!active) { x = targetX; y = targetY; previousTime = 0 }
      active = true
      element!.dataset.visible = 'true'
      const target = event.target instanceof Element ? event.target : null
      element!.dataset.interactive = String(Boolean(target?.closest('a, button, input, textarea, select, summary, [role="button"], [contenteditable="true"]')))
      if (!frame) frame = requestAnimationFrame(animate)
    }
    function press() { if (active) element!.dataset.pressed = 'true' }
    function release() { element!.dataset.pressed = 'false' }
    function key(event: KeyboardEvent) { if (event.key === 'Tab') hide() }
    function visibility() { if (document.hidden) hide() }
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerdown', press, { passive: true })
    window.addEventListener('pointerup', release, { passive: true })
    window.addEventListener('pointercancel', hide)
    window.addEventListener('blur', hide)
    document.documentElement.addEventListener('pointerleave', hide)
    document.addEventListener('keydown', key)
    document.addEventListener('visibilitychange', visibility)
    media.addEventListener('change', hide)
    return () => {
      hide()
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerdown', press)
      window.removeEventListener('pointerup', release)
      window.removeEventListener('pointercancel', hide)
      window.removeEventListener('blur', hide)
      document.documentElement.removeEventListener('pointerleave', hide)
      document.removeEventListener('keydown', key)
      document.removeEventListener('visibilitychange', visibility)
      media.removeEventListener('change', hide)
    }
  }, [pathname])

  return (
    <>
      <div aria-hidden="true" className={styles.texture} />
      <svg aria-hidden="true" focusable="false" className={styles.filterDefinitions} width="0" height="0">
        <defs>
          <filter id="burgama-water-refraction" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
            <feImage href="/droplet-refraction.png" x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="lens" />
            <feDisplacementMap in="SourceGraphic" in2="lens" scale="42" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>
      <div ref={cursor} aria-hidden="true" className={styles.cursor} data-visible="false">
        <div className={styles.droplet} />
      </div>
    </>
  )
}
