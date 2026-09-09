'use client'

import { useEffect } from 'react'

const navy = [0, 0, 32]
const coral = [255, 74, 80]
const cyan = [0, 200, 237]
const alternateCyan = [49, 200, 239]
const mix = (from: number[], to: number[], progress: number) => from.map((value, index) => Math.round(value + (to[index] - value) * progress))
const rgb = (color: number[]) => `rgb(${color.join(' ')})`
const luminance = (color: number[]) => color.map(value => value / 255).map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4).reduce((sum, value, index) => sum + value * [.2126, .7152, .0722][index], 0)
const contrast = (a: number[], b: number[]) => (Math.max(luminance(a), luminance(b)) + .05) / (Math.min(luminance(a), luminance(b)) + .05)

export function ScrollPalette() {
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-homepage] [data-scroll-palette]'))
    const header = document.querySelector<HTMLElement>('.cyan-header[data-home="true"]')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    let disposed = false
    const previous = new Map<HTMLElement, number>()
    const properties = ['--scroll-bg', '--scroll-ink', '--scroll-body', '--palette-progress']

    const update = () => {
      frame = 0
      const viewport = window.innerHeight
      const scroll = window.scrollY
      const maximum = Math.max(0, document.documentElement.scrollHeight - viewport)
      // Read every section before writing styles to avoid layout thrashing.
      const measurements = sections.map(element => ({ element, top: element.getBoundingClientRect().top + scroll }))
      measurements.forEach(({ element, top }, index) => {
        const start = index === 0 ? 0 : Math.min(maximum, Math.max(0, top - viewport * .95))
        const end = index === 0 ? Math.min(maximum, Math.max(1, top + viewport * .6)) : Math.min(maximum, Math.max(start + 1, top - viewport * .15))
        const linear = reducedMotion.matches || maximum === 0 ? 0 : Math.max(0, Math.min(1, (scroll - start) / Math.max(1, end - start)))
        const progress = Math.round(linear * linear * (3 - 2 * linear) * 1000) / 1000
        if (previous.get(element) === progress) return
        previous.set(element, progress)
        const background = mix(navy, coral, progress)
        const ink = mix(cyan, alternateCyan, progress)
        const body = contrast(background, cyan) >= 4.5 ? cyan : contrast(background, navy) >= 4.5 ? navy : [255, 255, 255]
        const values = [rgb(background), rgb(ink), rgb(body), String(progress)]
        properties.forEach((property, i) => element.style.setProperty(property, values[i]))
        if (index === 0 && header) properties.forEach((property, i) => header.style.setProperty(property, values[i]))
      })
    }
    const schedule = () => { if (!disposed && !frame) frame = requestAnimationFrame(update) }
    const observer = new ResizeObserver(schedule)
    sections.forEach(section => observer.observe(section))
    observer.observe(document.body)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    window.addEventListener('pageshow', schedule)
    reducedMotion.addEventListener('change', schedule)
    document.fonts.ready.then(schedule)
    schedule()
    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      window.removeEventListener('pageshow', schedule)
      reducedMotion.removeEventListener('change', schedule)
      ;[...sections, ...(header ? [header] : [])].forEach(element => properties.forEach(property => element.style.removeProperty(property)))
    }
  }, [])
  return null
}
