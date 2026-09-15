'use client'

import { useEffect, useId, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/motion'
import { homeCurveExtensionLength, homeSlopePath } from '@/lib/home-curve'
import { SectionRise } from '@/components/home/section-rise'
import styles from './home-page.module.css'

const results = [
  { phrase: '130+ businesses worked with', surface: 'yellow-soft', next: 'soft-coral', direction: 'right' },
  { phrase: '20 million annual ad impressions', surface: 'soft-coral', next: 'powder', direction: 'left' },
  { phrase: '65 countries with active clients', surface: 'powder', next: 'powder-deep', direction: 'right' },
] as const

export function ActResults() {
  const sectionRef = useRef<HTMLElement>(null)
  const id = useId().replace(/:/g, '')

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const media = gsap.matchMedia(section)
    let disposed = false
    let frame = 0

    media.add('(prefers-reduced-motion: no-preference)', () => {
      const bands = [...section.querySelectorAll<HTMLElement>('[data-impact-band]')]
      bands.forEach((band, index) => {
        const svg = band.querySelector<SVGSVGElement>('[data-impact-ribbon]')!
        const path = svg.querySelector<SVGPathElement>('defs path')!
        const text = svg.querySelector<SVGTextElement>('text')!
        const copies = [...svg.querySelectorAll<SVGTextPathElement>('textPath')]
        const progress = { value: 0 }
        let period = 0
        let entrance = 0
        band.dataset.ribbonReady = 'true'

        const render = () => {
          const direction = results[index].direction === 'left' ? 1 : -1
          const offset = (progress.value - 0.5) * period * direction
          copies.forEach((copy, copyIndex) => {
            copy.setAttribute('startOffset', String(entrance + (copyIndex - 2) * period + offset))
          })
        }
        const measure = () => {
          const width = band.clientWidth
          const height = band.clientHeight
          const rise = band.querySelector<SVGSVGElement>('[data-nav-curve]')!.getBoundingClientRect().height
          const fontSize = Number.parseFloat(getComputedStyle(text).fontSize)
          period = text.getComputedTextLength() + fontSize * 1.4
          const extension = Math.max(width, period) * 3
          const baseline = height - rise - Math.max(24, fontSize * 0.42)
          svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
          path.setAttribute('d', homeSlopePath(width, rise, baseline, extension, results[index].direction))
          entrance = results[index].direction === 'left' ? extension : homeCurveExtensionLength(width, rise, extension)
          render()
        }

        measure()
        gsap.to(progress, {
          value: 1,
          ease: 'none',
          onUpdate: render,
          scrollTrigger: {
            trigger: band,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.35,
            onRefreshInit: measure,
            onRefresh: render,
            invalidateOnRefresh: true,
          },
        })
      })
      return () => bands.forEach(band => { delete band.dataset.ribbonReady })
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
      <h2 id="results-heading" className="sr-only">a little of the impact.</h2>
      {results.map((result, index) => (
        <div className={styles.impactBand} key={result.surface} data-impact-band={result.surface} data-nav-surface="frost">
          <h3 className={styles.impactPhrase}>{result.phrase}</h3>
          <svg className={styles.impactRibbon} data-impact-ribbon="" aria-hidden="true" focusable="false">
            <defs>
              <path id={`impact-${id}-${index}`} d={homeSlopePath(1440, 144, 160, 6000, result.direction)} />
            </defs>
            {Array.from({ length: 5 }, (_, copy) => (
              <text key={copy}>
                <textPath href={`#impact-${id}-${index}`}>{result.phrase}</textPath>
              </text>
            ))}
          </svg>
          <SectionRise surface={result.next} direction={result.direction} />
        </div>
      ))}
    </section>
  )
}
