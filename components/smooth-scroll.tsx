'use client'

import { useEffect } from 'react'

export function SmoothScroll() {
  useEffect(() => {
    const plates = Array.from(document.querySelectorAll<HTMLElement>('#main > [data-home-plate]'))
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    let measureFrame = 0

    function measure() {
      cancelAnimationFrame(measureFrame)
      measureFrame = requestAnimationFrame(() => {
        const viewportHeight = window.innerHeight
        const headerHeight = document.querySelector('header.site-header')?.getBoundingClientRect().height ?? 0
        const metrics = plates.map(plate => ({ plate, height: plate.offsetHeight }))
        metrics.forEach(({ plate, height }) => {
          // Tall plates finish scrolling before their bottom edge holds.
          plate.style.setProperty('--plate-top', `${Math.min(headerHeight, viewportHeight - height)}px`)
          plate.toggleAttribute('data-stack-ready', !preference.matches)
        })
      })
    }
    const observer = new ResizeObserver(measure)
    plates.forEach(plate => observer.observe(plate))
    const header = document.querySelector('header.site-header')
    if (header) observer.observe(header)
    window.addEventListener('resize', measure)
    preference.addEventListener('change', measure)
    measure()
    return () => {
      observer.disconnect()
      cancelAnimationFrame(measureFrame)
      window.removeEventListener('resize', measure)
      preference.removeEventListener('change', measure)
      plates.forEach(plate => {
        plate.removeAttribute('data-stack-ready')
        plate.style.removeProperty('--plate-top')
      })
    }
  }, [])
  return null
}
