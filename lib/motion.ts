'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/*
  ONE registration point for GSAP.

  Every act imports `gsap` and `ScrollTrigger` from here rather than from the
  package, so the plugin is registered exactly once no matter which component
  mounts first. Registering inside each component's effect is the usual way
  this goes wrong: it is idempotent but it means the import order decides
  whether a trigger created in a sibling's effect can see the plugin.
*/
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export { gsap, ScrollTrigger }

export function createScrollMomentum(
  trigger: HTMLElement,
  layers: { element: HTMLElement; distance: number }[],
) {
  if (prefersReducedMotion()) return () => {}
  const previous = layers.map(({ element }) => element.style.translate)
  const momentum = { value: 0 }
  // Independent translate composes with the existing scrubbed GSAP transforms.
  const move = gsap.quickTo(momentum, 'value', {
    duration: 0.65,
    ease: 'power3.out',
    onUpdate: () => {
      layers.forEach(({ element, distance }) => {
        element.style.translate = `0 ${momentum.value * distance}px`
      })
    },
  })
  const settle = gsap.delayedCall(0.1, () => move(0)).pause()
  const scroll = ScrollTrigger.create({
    trigger,
    start: 'top bottom',
    end: 'bottom top',
    onUpdate: (self) => {
      if (!self.isActive) {
        move(0)
        return
      }
      move(gsap.utils.clamp(-1, 1, self.getVelocity() / 1800))
      settle.restart(true)
    },
    onRefresh: () => {
      settle.pause()
      move(0)
    },
  })
  return () => {
    scroll.kill()
    settle.kill()
    move.tween.kill()
    layers.forEach(({ element }, index) => {
      element.style.translate = previous[index]
    })
  }
}

/*
  Read live rather than cached at module scope: the user can toggle the OS
  setting while the page is open, and a cached boolean would strand the site
  in whichever mode it loaded with.
*/
export function prefersReducedMotion() {
  if (typeof window === 'undefined') return true
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/*
  The brief's mobile rules ask for shorter pins and "significantly reduced"
  parallax rather than the desktop distances. Acts multiply their travel
  numbers by this so there is a single place to tune the ratio, and so a
  narrow viewport never inherits an 80px parallax that eats the composition.
*/
export function motionScale() {
  if (typeof window === 'undefined') return 1
  return window.matchMedia('(max-width: 860px)').matches ? 0.45 : 1
}

/**
 * Shared wiring for an act's scroll animation.
 *
 * Wraps the work in `gsap.context()` so every tween and ScrollTrigger created
 * inside is reverted together on unmount — important under the App Router,
 * where client components remount on navigation and orphaned ScrollTriggers
 * would otherwise keep firing against detached nodes.
 *
 * Returns early under reduced motion, which is what satisfies the brief's
 * "remove pinned cinematic sequences / strong parallax" requirement: nothing
 * is ever animated, so every element stays at its authored CSS position and
 * the full layout is preserved.
 */
export function createActContext(
  scope: Element | null,
  build: (ctx: { scope: Element }) => void,
) {
  if (!scope || prefersReducedMotion()) return () => {}

  const ctx = gsap.context(() => build({ scope }), scope)
  return () => ctx.revert()
}
