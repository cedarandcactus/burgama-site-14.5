'use client'

import { useEffect } from 'react'

/**
 * MOVEMENT-DRIVEN BLUR SOURCE
 *
 * Publishes how fast the page is currently moving as two CSS variables on
 * `<html>`:
 *
 *   --vel   0 → 1, a normalised speed
 *   --vdir  1 when scrolling down, -1 when scrolling up
 *
 * Nothing is blurred by this hook directly. Elements OPT IN with `.mblur-y`,
 * which is the important constraint: blurring the whole page during scroll is
 * how this effect becomes nausea-inducing and unreadable. Only deliberately
 * chosen elements — chrome, not body copy — should subscribe.
 *
 * Design decisions worth keeping:
 *
 * - A rAF loop, not a scroll listener that writes styles. Scroll events can
 *   fire many times per frame; writing a custom property on each one causes
 *   redundant style recalculation.
 * - The value DECAYS toward zero every frame and is hard-snapped to exactly 0
 *   below a threshold. "Resolving to complete sharpness when movement stops"
 *   is the requirement, and an asymptotic decay would leave a permanent
 *   fractional blur that never quite clears.
 * - The loop parks itself when idle and is woken by scroll, so a static page
 *   is not running rAF forever.
 * - Under `prefers-reduced-motion` the hook does nothing at all and leaves
 *   `--vel` at 0.
 */
export function useScrollVelocity() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reduced.matches) return

    const root = document.documentElement

    let last = window.scrollY
    let velocity = 0
    let published = -1
    let frame = 0
    let idle = true

    /*
     * Speed in px/frame that counts as "fully moving". Chosen low: real
     * flick-scrolling on a phone easily exceeds 60px/frame, and the effect
     * should be saturated well before that so it reads during ordinary
     * scrolling rather than only during violent ones.
     */
    const FULL = 34

    /*
      Lenis drives scrolling, and its rAF and this one are not ordered. If the
      loop is allowed to stop the instant velocity decays to 0 it can park
      during a frame that Lenis has not advanced yet, mid-gesture — and since
      `wake` only re-arms on a `scroll` EVENT, a gesture already in flight
      never fires another one and the loop stays dead for the rest of the
      session. So the loop coasts for a few zero-delta frames before parking.
    */
    const IDLE_FRAMES = 6
    let quiet = 0

    const tick = () => {
      const y = window.scrollY
      const delta = y - last
      last = y

      quiet = delta === 0 ? quiet + 1 : 0

      const speed = Math.min(Math.abs(delta) / FULL, 1)

      /* Rise fast so the response feels immediate, fall slower so it settles
         smoothly instead of flickering between frames. */
      velocity = speed > velocity ? speed : velocity * 0.86

      /* Hard floor — guarantees a true return to zero. */
      if (velocity < 0.01) velocity = 0

      if (delta !== 0) root.style.setProperty('--vdir', delta > 0 ? '1' : '-1')

      /* Only write when the value actually changed at 2dp. */
      const next = Math.round(velocity * 100) / 100
      if (next !== published) {
        published = next
        root.style.setProperty('--vel', String(next))
        root.style.setProperty('--glass-blur', `${5 + next * 16}px`)
        root.style.setProperty('--glass-edge-opacity', String(0.55 + next * 0.35))
        root.style.setProperty('--glass-sheen-opacity', String(0.45 + next * 0.22))
      }

      /* Park only once the page has genuinely stopped moving, not merely
         because the decay reached zero on a frame Lenis had not advanced. */
      if (velocity === 0 && quiet >= IDLE_FRAMES) {
        idle = true
        frame = 0
        return
      }

      frame = requestAnimationFrame(tick)
    }

    const wake = () => {
      if (!idle) return
      idle = false
      frame = requestAnimationFrame(tick)
    }

    window.addEventListener('scroll', wake, { passive: true })

    return () => {
      window.removeEventListener('scroll', wake)
      if (frame) cancelAnimationFrame(frame)
      root.style.removeProperty('--vel')
      root.style.removeProperty('--vdir')
      root.style.removeProperty('--glass-blur')
      root.style.removeProperty('--glass-edge-opacity')
      root.style.removeProperty('--glass-sheen-opacity')
    }
  }, [])
}
