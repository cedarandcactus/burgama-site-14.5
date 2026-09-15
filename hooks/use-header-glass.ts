'use client'

import { useEffect, type RefObject } from 'react'
import { homeCurvePath, homeCurvePoint } from '@/lib/home-curve'

function paint(width: number, height: number, base: string, fill: string, path: string, matrix: DOMMatrix) {
  const transform = [matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f].map(value => value.toFixed(5)).join(' ')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" fill="${base}"/><path d="${path}" transform="matrix(${transform})" fill="${fill}"/></svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}

function isLight(surface: string) {
  const channels = surface.startsWith('#')
    ? surface.slice(1).match(/.{2}/g)?.map(channel => Number.parseInt(channel, 16))
    : surface.match(/[\d.]+/g)?.slice(0, 3).map(Number)
  if (!channels || channels.length < 3) return false
  const linear = channels.map(channel => {
    const value = surface.startsWith('color(srgb ') ? channel : channel / 255
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  })
  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722 > 0.14
}

export function useHeaderGlass(headerRef: RefObject<HTMLElement | null>, pathname: string) {
  useEffect(() => {
    const header = headerRef.current
    const shell = header?.querySelector<HTMLElement>('.header-inner')
    if (!header || !shell || pathname !== '/') return

    const transparency = matchMedia('(prefers-reduced-transparency: reduce)')
    const supportsPaint = CSS.supports('background-clip', 'text') && CSS.supports('mask-image', 'url("/burgama-symbol.svg")')
    const regions = [...document.querySelectorAll<HTMLElement | SVGSVGElement>('[data-nav-surface]')]
    const controls = [...shell.querySelectorAll<HTMLElement>('[data-glass-ink], .header-contact')]
    const hero = document.querySelector('[data-homepage] > section:first-child')
    const palette = getComputedStyle(header)
    const navy = palette.getPropertyValue('--palette-navy').trim()
    const powder = palette.getPropertyValue('--palette-powder').trim()
    const blue = palette.getPropertyValue('--palette-powder-deep').trim()
    let frame = 0
    let disposed = false
    let hovered = shell.matches(':hover')
    let initialized = false
    const backgrounds = new Map<Element, string>()

    function background(element: Element | null): string {
      if (!element) return navy
      if (element === hero) return blue
      const cached = backgrounds.get(element)
      if (cached) return cached
      const color = getComputedStyle(element).backgroundColor
      const channels = color.match(/[\d.]+/g)?.map(Number)
      const value = channels && channels.length >= 3 && (channels[3] ?? 1) >= 0.95
        ? color
        : background(element.parentElement)
      backgrounds.set(element, value)
      return value
    }

    const curves = regions.flatMap(region => {
      if (!(region instanceof SVGSVGElement) || !region.hasAttribute('data-nav-curve')) return []
      const path = region.querySelector('path')
      if (!path) return []
      const { width, height } = region.viewBox.baseVal
      return [{
        region,
        path,
        width,
        height,
        fill: getComputedStyle(path).fill,
        base: background(region.parentElement),
        // Continue the incoming surface below the SVG's viewport, into the next band.
        extendedPath: `${homeCurvePath(width, height)} L ${width} ${height + 100000} L 0 ${height + 100000} Z`,
      }]
    }).reverse()

    function surfaceAt(point: DOMPoint) {
      for (const curve of curves) {
        const rect = curve.region.getBoundingClientRect()
        if (point.x < rect.left || point.x > rect.right || point.y < rect.top || point.y > rect.bottom) continue
        const matrix = curve.path.getScreenCTM()
        if (matrix && curve.path.isPointInFill(point.matrixTransform(matrix.inverse()))) return curve.fill
        return curve.base
      }
      const underlying = document.elementsFromPoint(point.x, point.y).find(element => !header!.contains(element) && element.closest('main'))
      return background(underlying?.closest('[data-nav-surface]') ?? underlying ?? null)
    }

    function clearPaint() {
      delete header!.dataset.glassCrossing
      shell!.style.removeProperty('--glass-paint')
      for (const control of controls) control.style.removeProperty('--glass-ink-paint')
    }

    function update() {
      frame = 0
      if (disposed) return
      // Project the underlying surface without changing the shell's shape or position.
      const headerBounds = header!.getBoundingClientRect()
      const left = headerBounds.left + shell!.offsetLeft
      const top = headerBounds.top + shell!.offsetTop
      const width = shell!.offsetWidth
      const height = shell!.offsetHeight
      const center = new DOMPoint(left + width / 2, top + Math.min(height, 60) / 2)
      const interacting = hovered || shell!.contains(document.activeElement)
        || header!.dataset.menuOpen === 'true' || header!.dataset.projectOpen === 'true'
      if (!initialized || !interacting) {
        const surface = surfaceAt(center)
        header!.dataset.glassTheme = isLight(surface) ? 'frost' : 'ink'
        header!.dataset.glassSurface = surface
        header!.style.setProperty('--header-surface', surface)
        initialized = true
      }

      let crossing: { curve: typeof curves[number]; matrix: DOMMatrix; distance: number } | undefined
      if (!interacting && !transparency.matches && supportsPaint) {
        for (const curve of curves) {
          const rect = curve.region.getBoundingClientRect()
          if (rect.top > center.y + height + 100 || rect.bottom < center.y - height - 100) continue
          const matrix = curve.path.getScreenCTM()
          if (!matrix) continue
          const local = center.matrixTransform(matrix.inverse())
          const x = Math.max(0, Math.min(1, local.x / curve.width))
          let low = 0
          let high = 1
          for (let index = 0; index < 16; index++) {
            const middle = (low + high) / 2
            if (homeCurvePoint(middle).x < x) low = middle
            else high = middle
          }
          const t = (low + high) / 2
          const project = (progress: number) => {
            const point = homeCurvePoint(progress)
            return new DOMPoint(point.x * curve.width, point.y * curve.height).matrixTransform(matrix)
          }
          const point = project(t)
          const distance = point.y - center.y
          if (Math.abs(distance) > height + 90 || (crossing && Math.abs(distance) >= Math.abs(crossing.distance))) continue
          crossing = { curve, matrix, distance }
        }
      }

      if (!crossing) {
        clearPaint()
        return
      }
      const { curve, matrix } = crossing
      const screenToShell = new DOMMatrix().translate(left, top).inverse()
      const projected = screenToShell.multiply(matrix)
      const oldInk = isLight(curve.base) ? navy : powder
      const newInk = isLight(curve.fill) ? navy : powder
      shell!.style.setProperty('--glass-paint', paint(width, height, curve.base, curve.fill, curve.extendedPath, projected))
      header!.dataset.glassCrossing = 'true'

      for (const control of controls) {
        if (!control.offsetWidth || !control.offsetHeight || control.checkVisibility?.() === false) continue
        const rect = control.getBoundingClientRect()
        const centerInShell = new DOMPoint(rect.left + rect.width / 2, rect.top + rect.height / 2).matrixTransform(screenToShell)
        const transform = getComputedStyle(control).transform
        const own = transform === 'none' ? new DOMMatrix() : new DOMMatrix(transform)
        own.e = 0
        own.f = 0
        const localToShell = new DOMMatrix().translate(centerInShell.x, centerInShell.y).multiply(own).translate(-control.offsetWidth / 2, -control.offsetHeight / 2)
        const isActionLabel = !!control.closest('.header-contact') && !control.matches('.header-contact')
        const from = isActionLabel ? (isLight(curve.base) ? powder : navy) : oldInk
        const to = isActionLabel ? (isLight(curve.fill) ? powder : navy) : newInk
        control.style.setProperty('--glass-ink-paint', paint(control.offsetWidth, control.offsetHeight, from, to, curve.extendedPath, localToShell.inverse().multiply(projected)))
      }
    }

    function scheduleUpdate() {
      if (!disposed && !frame) frame = requestAnimationFrame(update)
    }
    const enter = (event: PointerEvent) => {
      if (event.pointerType !== 'touch') hovered = true
      scheduleUpdate()
    }
    const leave = () => { hovered = false; scheduleUpdate() }
    const refresh = () => { backgrounds.clear(); scheduleUpdate() }
    const resize = new ResizeObserver(refresh)
    const state = new MutationObserver(scheduleUpdate)
    state.observe(header, { attributes: true, attributeFilter: ['data-menu-open', 'data-project-open', 'data-condensed', 'data-footer-visible'] })
    resize.observe(shell)
    for (const region of regions) resize.observe(region)
    update()
    document.fonts.ready.then(refresh)
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', refresh, { passive: true })
    document.addEventListener('visibilitychange', scheduleUpdate)
    shell.addEventListener('pointerenter', enter)
    shell.addEventListener('pointerleave', leave)
    shell.addEventListener('focusin', scheduleUpdate)
    shell.addEventListener('focusout', scheduleUpdate)
    transparency.addEventListener('change', scheduleUpdate)
    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      resize.disconnect()
      state.disconnect()
      clearPaint()
      delete header.dataset.glassTheme
      delete header.dataset.glassSurface
      header.style.removeProperty('--header-surface')
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', refresh)
      document.removeEventListener('visibilitychange', scheduleUpdate)
      shell.removeEventListener('pointerenter', enter)
      shell.removeEventListener('pointerleave', leave)
      shell.removeEventListener('focusin', scheduleUpdate)
      shell.removeEventListener('focusout', scheduleUpdate)
      transparency.removeEventListener('change', scheduleUpdate)
    }
  }, [headerRef, pathname])
}
