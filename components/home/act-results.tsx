'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/motion'
import { homeCurvePoint } from '@/lib/home-curve'
import { SectionRise } from '@/components/home/section-rise'
import styles from './home-page.module.css'

const results = [
  { value: '130+', spoken: '130 plus', metric: 'businesses worked with', surface: 'yellow-soft', next: 'soft-coral', direction: 'right' },
  { value: '20m', spoken: '20 million', metric: 'annual ad impressions', surface: 'soft-coral', next: 'powder', direction: 'left' },
  { value: '65', spoken: '65', metric: 'countries with active clients', surface: 'powder', next: 'powder-deep', direction: 'right' },
] as const

export function ActResults() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const media = gsap.matchMedia(section)
    let disposed = false
    let frame = 0

    media.add('(prefers-reduced-motion: no-preference)', () => {
      const groups = [...section.querySelectorAll<HTMLElement>('[data-result]')]
      groups.forEach((group, index) => {
        const band = group.closest<HTMLElement>('[data-impact-band]')!
        const progress = { value: 0 }
        let width = 0
        let rise = 0
        let travel = 0
        const measure = () => {
          width = band.clientWidth
          rise = band.querySelector('svg')?.getBoundingClientRect().height ?? 80
          const gutter = Number.parseFloat(getComputedStyle(band).paddingLeft)
          const available = Math.max(0, (width - group.offsetWidth) / 2 - gutter)
          travel = Math.min(0.14, available / width)
        }
        const render = () => {
          const point = homeCurvePoint(0.5 - travel * (1 - progress.value))
          const destination = homeCurvePoint(0.5)
          const direction = results[index].direction === 'left' ? -1 : 1
          group.style.transform = `translate3d(${(point.x - destination.x) * width * direction}px, ${(point.y - destination.y) * rise}px, 0)`
        }
        measure()
        gsap.fromTo(progress, { value: 0 }, {
          value: 1,
          ease: 'none',
          onUpdate: render,
          scrollTrigger: {
            trigger: band,
            start: 'top bottom',
            end: 'center 55%',
            scrub: 0.45,
            onRefreshInit: measure,
            onRefresh: render,
            invalidateOnRefresh: true,
          },
        })
      })
      return () => groups.forEach(group => group.style.removeProperty('transform'))
    })

    const refresh = () => {
      if (disposed) return
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => ScrollTrigger.refresh())
    }
    let previousWidth = section.clientWidth
    const resize = new ResizeObserver(() => {
      if (section.clientWidth === previousWidth) return
      previousWidth = section.clientWidth
      refresh()
    })
    resize.observe(section)
    document.fonts.ready.then(refresh)
    document.fonts.addEventListener('loadingdone', refresh)
    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      resize.disconnect()
      document.fonts.removeEventListener('loadingdone', refresh)
      media.revert()
    }
  }, [])

  return (
    <section ref={sectionRef} className={styles.results} aria-labelledby="results-heading">
      {results.map((result, index) => (
        <div className={styles.impactBand} key={result.value} data-impact-band={result.surface} data-nav-surface="frost">
          {index === 0 && <h2 id="results-heading" className="font-serif">a little of the impact.</h2>}
          <dl className={styles.result} data-result="">
            <dt className={styles.resultMetric}>{result.metric}</dt>
            <dd className={styles.resultNumber}>
              <span aria-hidden="true">{result.value}</span>
              <span className="sr-only">{result.spoken}</span>
            </dd>
          </dl>
          <SectionRise surface={result.next} direction={result.direction} />
        </div>
      ))}
    </section>
  )
}
