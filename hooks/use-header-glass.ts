'use client'

import { useEffect, type RefObject } from 'react'

function isLight(surface: string) {
  const channels = surface.startsWith('#')
    ? surface.slice(1).match(/.{2}/g)?.map((channel) => Number.parseInt(channel, 16))
    : surface.match(/[\d.]+/g)?.slice(0, 3).map(Number)
  if (!channels || channels.length < 3) return false
  const linear = channels.map((channel) => {
    const value = surface.startsWith('color(srgb ') ? channel : channel / 255
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  })
  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722 > 0.14
}

export function useHeaderGlass(headerRef: RefObject<HTMLElement | null>, pathname: string) {
  useEffect(() => {
    const header = headerRef.current
    const shell = header?.querySelector<HTMLElement>('.header-inner')
    const main = document.querySelector<HTMLElement>('main')
    if (!header || !shell || !main) return

    const palette = getComputedStyle(header)
    const navy = palette.getPropertyValue('--palette-navy').trim()
    const powder = palette.getPropertyValue('--palette-powder').trim()
    const backgrounds = new Map<Element, string>()
    let frame = 0
    let disposed = false
    let currentTheme = ''

    function background(element: Element | null): string {
      if (!element || element === document.documentElement) return navy
      const cached = backgrounds.get(element)
      if (cached) return cached
      const color = getComputedStyle(element).backgroundColor
      const channels = color.match(/[\d.]+/g)?.map(Number)
      const opaque = channels && channels.length >= 3 && (channels[3] ?? 1) >= 0.92
      const value = opaque ? color : background(element.parentElement)
      backgrounds.set(element, value)
      return value
    }

    function sourceIsLight() {
      const bounds = shell!.getBoundingClientRect()
      const x = Math.min(window.innerWidth - 1, Math.max(0, bounds.left + bounds.width / 2))
      const y = Math.min(window.innerHeight - 1, Math.max(0, bounds.top + Math.min(bounds.height, 64) / 2))
      const underlying = document.elementsFromPoint(x, y).find((element) => !header!.contains(element) && element.closest('main'))
      const marker = underlying?.closest<HTMLElement>('[data-nav-surface]')
      if (marker?.dataset.navSurface === 'frost') return true
      if (marker?.dataset.navSurface === 'ink') return false
      if (underlying instanceof HTMLVideoElement || underlying instanceof HTMLImageElement || underlying instanceof HTMLCanvasElement) return false
      return isLight(background(underlying ?? main))
    }

    function applyTheme(lightPage: boolean) {
      const theme = lightPage ? 'dark' : 'light'
      if (theme === currentTheme) return
      currentTheme = theme
      const surface = lightPage ? navy : powder
      const ink = lightPage ? powder : navy
      header!.dataset.glassTheme = theme
      header!.style.setProperty('--header-surface', surface)
      header!.style.setProperty('--header-ink', ink)
      header!.style.setProperty('--header-action-bg', ink)
      header!.style.setProperty('--header-action-ink', surface)
      header!.style.setProperty('--header-color-scheme', lightPage ? 'dark' : 'light')
    }

    function update() {
      frame = 0
      if (disposed || header!.dataset.menuOpen === 'true' || header!.dataset.projectOpen === 'true') return
      applyTheme(sourceIsLight())
    }

    function scheduleUpdate() {
      if (!disposed && !frame) frame = requestAnimationFrame(update)
    }

    function refresh() {
      backgrounds.clear()
      scheduleUpdate()
    }

    const resize = new ResizeObserver(refresh)
    const state = new MutationObserver(scheduleUpdate)
    const surfaces = [...document.querySelectorAll<HTMLElement | SVGSVGElement>('[data-nav-surface]')]

    resize.observe(shell)
    for (const surface of surfaces) resize.observe(surface)
    state.observe(header, { attributes: true, attributeFilter: ['data-menu-open', 'data-project-open'] })
    state.observe(main, { subtree: true, childList: true, attributes: true, attributeFilter: ['data-nav-surface', 'style'] })

    update()
    document.fonts.ready.then(refresh)
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', refresh, { passive: true })
    window.visualViewport?.addEventListener('resize', refresh)
    document.addEventListener('visibilitychange', scheduleUpdate)

    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      resize.disconnect()
      state.disconnect()
      delete header!.dataset.glassTheme
      header!.style.removeProperty('--header-surface')
      header!.style.removeProperty('--header-ink')
      header!.style.removeProperty('--header-action-bg')
      header!.style.removeProperty('--header-action-ink')
      header!.style.removeProperty('--header-color-scheme')
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', refresh)
      window.visualViewport?.removeEventListener('resize', refresh)
      document.removeEventListener('visibilitychange', scheduleUpdate)
    }
  }, [headerRef, pathname])
}
