'use client'

import { useEffect, useRef, type CSSProperties } from 'react'
import Link from '@/components/transition-link'
import { gsap } from '@/lib/motion'
import { homeCurvePoint } from '@/lib/home-curve'
import styles from './home-page.module.css'

// Exact reported figures from the corresponding case studies in lib/projects.ts.
const results = [
  { value: 576649, metric: 'Instagram views', client: 'MatchDay', period: 'May 15–October 12, 2025', href: '/work/matchday-social' },
  { value: 6555, metric: 'Instagram engagements', client: 'MatchDay', period: 'May 15–October 12, 2025', href: '/work/matchday-social' },
  { value: 172503, metric: 'Instagram views', client: 'Hush Hush Tan', period: 'June 1–September 22, 2025', href: '/work/hush-hush-tan-social' },
] as const
const format = new Intl.NumberFormat('en-US')

export function ActResults() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const media = gsap.matchMedia(section)
    const revealed = new Set<number>()

    media.add({ desktop: '(min-width: 700px)', reduced: '(prefers-reduced-motion: reduce)' }, (context) => {
      if (context.conditions?.reduced) return
      const groups = section.querySelectorAll<HTMLElement>('[data-result]')
      groups.forEach((group, index) => {
        const number = group.querySelector<HTMLElement>('[data-result-number]')!
        const value = results[index].value
        const counter = { value }
        if (!revealed.has(index)) {
          gsap.fromTo(counter, { value: 0 }, {
            value,
            duration: 1.3,
            ease: 'power2.out',
            onUpdate: () => { number.textContent = format.format(Math.round(counter.value)) },
            onComplete: () => { revealed.add(index) },
            scrollTrigger: { trigger: group, start: 'top 90%', once: true },
          })
        }
        if (context.conditions?.desktop) {
          const t = (index + 0.5) / results.length
          const start = homeCurvePoint(t - 0.016)
          const end = homeCurvePoint(t)
          gsap.fromTo(group, {
            x: () => (start.x - end.x) * group.parentElement!.parentElement!.clientWidth,
            y: () => (start.y - end.y) * Math.min(112, Math.max(56, window.innerWidth * 0.08)),
          }, {
            x: 0,
            y: 0,
            ease: 'none',
            scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom 55%', scrub: 0.5, invalidateOnRefresh: true },
          })
        }
      })
      return () => {
        groups.forEach((group, index) => {
          group.querySelector<HTMLElement>('[data-result-number]')!.textContent = format.format(results[index].value)
        })
      }
    })
    return () => media.revert()
  }, [])

  return (
    <section ref={sectionRef} className={styles.results} aria-labelledby="results-heading" data-nav-surface="frost">
      <h2 id="results-heading" className="font-serif">a little of the impact.</h2>
      <div className={styles.resultsContour}>
        {results.map((result, index) => (
          <div className={styles.resultPosition} key={`${result.client}-${result.metric}`} style={{ '--result-offset': homeCurvePoint((index + 0.5) / results.length).y } as CSSProperties}>
            <Link href={result.href} className={styles.result} data-result="">
              <span className="sr-only">{format.format(result.value)} </span>
              <span className={styles.resultNumber} aria-hidden="true">
                <span className={styles.resultNumberSpace}>{format.format(result.value)}</span>
                <span data-result-number="">{format.format(result.value)}</span>
              </span>
              <span className={styles.resultMetric}>{result.metric}</span>
              <span className={styles.resultClient}>{result.client}</span>
              <span className={styles.resultPeriod}>{result.period}</span>
            </Link>
          </div>
        ))}
      </div>
      <p className={styles.resultsNote}>View totals include organic and paid activity.</p>
    </section>
  )
}
