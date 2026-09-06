'use client'

import { useEffect } from 'react'

export function SmoothScroll() {
  useEffect(() => {
    const plates = Array.from(document.querySelectorAll<HTMLElement>('#main > [data-home-plate]'))
    const joints = plates.slice(1)
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sizes = new Map<HTMLElement, number>()
    let measureFrame = 0
    let scrollFrame = 0
    let viewportHeight = window.innerHeight

    function drawJoints() {
      scrollFrame = 0
      // Read all geometry before writing styles; scrolling itself stays entirely native.
      const gaps = joints.map(plate => {
        if (preference.matches) return 0
        const top = plate.getBoundingClientRect().top
        const progress = Math.max(0, Math.min(1, (viewportHeight * .95 - top) / (viewportHeight * .75)))
        const smooth = (value: number) => value * value * (3 - 2 * value)
        const approach = 1 - smooth(Math.min(1, progress / .42))
        const release = smooth(Math.max(0, (progress - .72) / .28))
        return (sizes.get(plate) ?? 73) * (.26 * approach - .12 * release)
      })
      joints.forEach((plate, index) => plate.style.setProperty('--curl-gap', `${gaps[index].toFixed(2)}px`))
    }
    function onScroll() {
      if (!scrollFrame && !preference.matches) scrollFrame = requestAnimationFrame(drawJoints)
    }
    function measure() {
      cancelAnimationFrame(measureFrame)
      measureFrame = requestAnimationFrame(() => {
        viewportHeight = window.innerHeight
        const headerHeight = document.querySelector('header.site-header')?.getBoundingClientRect().height ?? 0
        const metrics = plates.map(plate => ({
          plate,
          height: plate.offsetHeight,
          curveHeight: parseFloat(getComputedStyle(plate, '::before').height) || 46,
        }))
        metrics.forEach(({ plate, height, curveHeight }) => {
          // Tall plates finish scrolling before their bottom edge holds.
          plate.style.setProperty('--plate-top', `${Math.min(headerHeight, viewportHeight - height)}px`)
          plate.toggleAttribute('data-stack-ready', !preference.matches)
          sizes.set(plate, curveHeight)
        })
        cancelAnimationFrame(scrollFrame)
        scrollFrame = requestAnimationFrame(drawJoints)
      })
    }
    const observer = new ResizeObserver(measure)
    plates.forEach(plate => observer.observe(plate))
    const header = document.querySelector('header.site-header')
    if (header) observer.observe(header)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', measure)
    preference.addEventListener('change', measure)
    measure()
    return () => {
      observer.disconnect()
      cancelAnimationFrame(measureFrame)
      cancelAnimationFrame(scrollFrame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', measure)
      preference.removeEventListener('change', measure)
      plates.forEach(plate => {
        plate.removeAttribute('data-stack-ready')
        plate.style.removeProperty('--plate-top')
        plate.style.removeProperty('--curl-gap')
      })
    }
  }, [])
  return null
}
