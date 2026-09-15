'use client'

import { useEffect, type RefObject } from 'react'

export function useHeaderGlass(headerRef: RefObject<HTMLElement | null>, pathname: string, paused: boolean) {
  useEffect(() => {
    const header = headerRef.current
    const shell = header?.querySelector<HTMLElement>('.header-inner')
    if (!header || !shell) return
    if (pathname !== '/') {
      delete header.dataset.glassTheme
      delete header.dataset.glassSurface
      header.style.removeProperty('--header-surface')
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

    function readSurface(probe: DOMPoint) {
      // Decorative curves ignore pointer events but still paint over the outgoing section.
      for (const region of regions) {
        if (!(region instanceof SVGSVGElement)) continue
        const rect = region.getBoundingClientRect()
        if (probe.x < rect.left || probe.x > rect.right || probe.y < rect.top || probe.y > rect.bottom) continue
        const path = region.querySelector('path')
        const matrix = path?.getScreenCTM()
        if (path && matrix && path.isPointInFill(probe.matrixTransform(matrix.inverse()))) {
          return getComputedStyle(path).fill
        }
      }
      const underlying = document.elementsFromPoint(probe.x, probe.y).find(
        element => !header!.contains(element) && element.closest('main'),
      )
      let element = underlying ?? null
      while (element && element.tagName !== 'MAIN') {
        const background = getComputedStyle(element).backgroundColor
        const channels = background.match(/[\d.]+/g)?.map(Number)
        if (channels && channels.length >= 3 && (channels[3] ?? 1) >= 0.95) return background
        element = element.parentElement
      }
      return getComputedStyle(header!).getPropertyValue('--palette-navy').trim()
    }

    function surfaceTheme(surface: string) {
      const channels = surface.startsWith('#')
        ? surface.slice(1).match(/.{2}/g)?.map(channel => Number.parseInt(channel, 16))
        : surface.match(/[\d.]+/g)?.slice(0, 3).map(Number)
      if (!channels || channels.length < 3) return 'ink'
      const linear = channels.map(channel => {
        const value = surface.startsWith('color(srgb ') ? channel : channel / 255
        return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
      })
      const luminance = linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722
      return luminance > 0.14 ? 'frost' : 'ink'
    }

    function changeSurface(surface: string, reverse: boolean, immediate: boolean) {
      if (surface === header!.dataset.glassSurface) return
      const next = surfaceTheme(surface)
      if (animation && (surface === sweepFrom || surface === sweepTo) && !immediate) {
        header!.dataset.glassTheme = next
        header!.dataset.glassSurface = surface
        header!.style.setProperty('--header-surface', surface)
        animation.playbackRate = surface === sweepTo ? 1 : -1
        animation.play()
        return
      }
      finishSweep()
      sweepFrom = header!.dataset.glassSurface ?? ''
      sweepTo = surface
      const before = getComputedStyle(header!)
      const oldSurface = before.getPropertyValue('--header-surface')
      const oldInk = before.getPropertyValue('--header-ink')
      const oldActionInk = before.getPropertyValue('--header-action-ink')
      header!.dataset.glassTheme = next
      header!.dataset.glassSurface = surface
      header!.style.setProperty('--header-surface', surface)
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
      ], { duration: 700, easing: 'cubic-bezier(.45, 0, .35, 1)', fill: 'both' })
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
      changeSurface(readSurface(probe), window.scrollY < previousScroll, !initialized || document.hidden)
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
