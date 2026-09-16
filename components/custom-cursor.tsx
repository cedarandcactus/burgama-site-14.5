'use client'

import { useEffect, useRef } from 'react'

const interactiveSelector = 'a[href], button, summary, input, textarea, select, [role="button"], [role="tab"], [role="switch"], [data-cursor="interactive"]'

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor) return

    const finePointer = window.matchMedia('(pointer: fine)')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    let x = -100
    let y = -100

    const syncSupport = () => {
      document.documentElement.toggleAttribute('data-custom-cursor', finePointer.matches && !reducedMotion.matches)
    }

    const move = (event: PointerEvent) => {
      x = event.clientX
      y = event.clientY
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`
        frame = 0
      })
    }

    const enter = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target : null
      if (!target) return
      const interactive = target.closest(interactiveSelector)
      const media = target.closest('video, img, [data-cursor="media"]')
      cursor.dataset.state = interactive ? 'interactive' : media ? 'media' : 'default'
    }

    const leave = () => {
      cursor.dataset.state = 'outside'
    }

    syncSupport()
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerover', enter, { passive: true })
    document.documentElement.addEventListener('mouseleave', leave)
    finePointer.addEventListener('change', syncSupport)
    reducedMotion.addEventListener('change', syncSupport)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', enter)
      document.documentElement.removeEventListener('mouseleave', leave)
      finePointer.removeEventListener('change', syncSupport)
      reducedMotion.removeEventListener('change', syncSupport)
      document.documentElement.removeAttribute('data-custom-cursor')
    }
  }, [])

  return <div ref={cursorRef} className="custom-cursor" data-state="outside" aria-hidden="true" />
}
