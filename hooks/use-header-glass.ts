'use client'

import { useEffect, type RefObject } from 'react'

export function useHeaderGlass(headerRef: RefObject<HTMLElement | null>, pathname: string, paused: boolean) {
  useEffect(() => {
    const header = headerRef.current
    const shell = header?.querySelector<HTMLElement>('.header-inner')
    if (!header || !shell) return
    if (pathname !== '/') {
      delete header.dataset.glassTheme
      return
    }

    const motion = matchMedia('(prefers-reduced-motion: reduce)')
    const transparency = matchMedia('(prefers-reduced-transparency: reduce)')
    const regions = [...document.querySelectorAll<HTMLElement | SVGSVGElement>('[data-nav-surface]')]
    let frame = 0
    let animation: Animation | null = null
    let sweepFrom = ''
    let sweepTo = ''
    let previousScroll = window.scrollY
    let initialized = false

    function finishSweep() {
      animation?.cancel()
      animation = null
      delete header!.dataset.glassSweeping
    }

    function measureControls() {
      const bounds = shell!.getBoundingClientRect()
      shell!.style.setProperty('--glass-width', `${bounds.width}px`)
      shell!.style.setProperty('--glass-height', `${bounds.height}px`)
      for (const control of shell!.querySelectorAll<HTMLElement>('[data-glass-ink], .header-contact')) {
        const rect = control.getBoundingClientRect()
        control.style.setProperty('--glass-offset-x', `${bounds.left - rect.left}px`)
        control.style.setProperty('--glass-offset-y', `${bounds.top - rect.top}px`)
      }
    }

    function changeSurface(next: string, reverse: boolean, immediate: boolean) {
      if (next === header!.dataset.glassTheme) return
      if (animation && (next === sweepFrom || next === sweepTo) && !immediate) {
        header!.dataset.glassTheme = next
        animation.playbackRate = next === sweepTo ? 1 : -1
        animation.play()
        return
      }
      finishSweep()
      sweepFrom = header!.dataset.glassTheme ?? 'ink'
      sweepTo = next
      const before = getComputedStyle(header!)
      const oldSurface = before.getPropertyValue('--header-surface')
      const oldInk = before.getPropertyValue('--header-ink')
      const oldActionInk = before.getPropertyValue('--header-action-ink')
      header!.dataset.glassTheme = next
      if (immediate || motion.matches || transparency.matches || typeof CSS.registerProperty !== 'function') return

      const after = getComputedStyle(header!)
      shell!.style.setProperty('--glass-old-surface', oldSurface)
      shell!.style.setProperty('--glass-old-ink', oldInk)
      shell!.style.setProperty('--glass-new-surface', after.getPropertyValue('--header-surface'))
      shell!.style.setProperty('--glass-new-ink', after.getPropertyValue('--header-ink'))
      shell!.style.setProperty('--glass-old-action-ink', oldActionInk)
      shell!.style.setProperty('--glass-new-action-ink', after.getPropertyValue('--header-action-ink'))
      shell!.style.setProperty('--glass-origin-a', reverse ? '104%' : '-4%')
      shell!.style.setProperty('--glass-origin-b', reverse ? '49%' : '51%')
      shell!.style.setProperty('--glass-origin-c', reverse ? '7%' : '93%')
      measureControls()
      header!.dataset.glassSweeping = 'true'
      animation = shell!.animate([
        { '--glass-bloom': '0%' },
        { '--glass-bloom': '320%' },
      ], { duration: 1400, easing: 'cubic-bezier(.45, 0, .35, 1)', fill: 'both' })
      animation.onfinish = finishSweep
    }

    function update() {
      frame = 0
      if (paused) {
        finishSweep()
        return
      }
      const bounds = shell!.getBoundingClientRect()
      const compactHeight = Number.parseFloat(getComputedStyle(header!).getPropertyValue('--header-control-height'))
      const padding = Number.parseFloat(getComputedStyle(header!).getPropertyValue('--header-shell-padding'))
      const probe = new DOMPoint(bounds.left + bounds.width / 2, bounds.top + padding + compactHeight / 2)
      let next = 'ink'
      for (const region of regions) {
        const rect = region.getBoundingClientRect()
        if (probe.y < rect.top || probe.y >= rect.bottom) continue
        if (region instanceof SVGSVGElement) {
          const path = region.querySelector('path')
          const matrix = path?.getScreenCTM()
          if (!path || !matrix || !path.isPointInFill(probe.matrixTransform(matrix.inverse()))) continue
        }
        next = region.dataset.navSurface ?? 'ink'
      }
      changeSurface(next, window.scrollY < previousScroll, !initialized || document.hidden)
      previousScroll = window.scrollY
      initialized = true
    }

    function scheduleUpdate() {
      if (!frame) frame = requestAnimationFrame(update)
    }

    function onPreferenceChange() {
      finishSweep()
      update()
    }

    const resize = new ResizeObserver(() => {
      if (animation) measureControls()
      scheduleUpdate()
    })
    resize.observe(shell)
    for (const region of regions) resize.observe(region)
    update()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate, { passive: true })
    document.addEventListener('visibilitychange', onPreferenceChange)
    motion.addEventListener('change', onPreferenceChange)
    transparency.addEventListener('change', onPreferenceChange)
    return () => {
      cancelAnimationFrame(frame)
      finishSweep()
      resize.disconnect()
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      document.removeEventListener('visibilitychange', onPreferenceChange)
      motion.removeEventListener('change', onPreferenceChange)
      transparency.removeEventListener('change', onPreferenceChange)
    }
  }, [headerRef, pathname, paused])
}
