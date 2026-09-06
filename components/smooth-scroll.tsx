'use client'

import { useEffect } from 'react'

export function SmoothScroll() {
  useEffect(() => {
    const plates = Array.from(document.querySelectorAll<HTMLElement>('#main > [data-home-plate]'))
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    function measure() {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const headerHeight = document.querySelector('header.site-header')?.getBoundingClientRect().height ?? 0
        plates.forEach(plate => {
          // Tall plates scroll all the way through before their bottom edge holds.
          const top = Math.min(headerHeight, window.innerHeight - plate.offsetHeight)
          plate.style.setProperty('--plate-top', `${top}px`)
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
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', measure)
      preference.removeEventListener('change', measure)
      plates.forEach(plate => { plate.removeAttribute('data-stack-ready'); plate.style.removeProperty('--plate-top') })
    }
  }, [])
  return null
}
