'use client'

import { useEffect, useId, useRef } from 'react'
import { homeCurveExtensionLength, homeSlopePath } from '@/lib/home-curve'
import { gsap, ScrollTrigger } from '@/lib/motion'
import { ModularButton } from '@/components/modular-button'
import { Reveal } from '@/components/reveal'
import { SectionRise } from '@/components/home/section-rise'
import styles from './home-page.module.css'

const process = [
  { title: 'understand', description: 'Your business, your audience, what needs to change. We turn the right questions into a focused brief.' },
  { title: 'shape', description: 'Find the direction. Align the strategy, the message, and the creative around what makes you distinct.' },
  { title: 'make', description: 'Bring it into the world. Identity, websites, and content, built to work together.' },
  { title: 'improve', description: 'Launch, listen, refine. We measure what matters and build on what works.' },
]

export function ActCapabilities() {
  const sectionRef = useRef<HTMLElement>(null)
  const id = useId().replace(/:/g, '')

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const media = gsap.matchMedia(section)
    let disposed = false
    let frame = 0

    media.add('(prefers-reduced-motion: no-preference)', () => {
      const rows = [...section.querySelectorAll<HTMLElement>('[data-process-row]')]
      rows.forEach((row, index) => {
        const svg = row.querySelector<SVGSVGElement>('svg')!
        const path = svg.querySelector<SVGPathElement>('defs path')!
        const text = svg.querySelector<SVGTextElement>('text')!
        const copy = svg.querySelector<SVGTextPathElement>('textPath')!
        const direction = index % 2 ? 'left' : 'right'
        const progress = { value: 0 }
        let origin = 0
        let travel = 0
        row.dataset.processReady = 'true'

        const render = () => {
          copy.setAttribute('startOffset', String(origin + (progress.value - 0.5) * travel * (index % 2 ? 1 : -1)))
        }
        const measure = () => {
          const width = svg.clientWidth
          const height = svg.clientHeight
          if (!width || !height) return
          const fontSize = parseFloat(getComputedStyle(text).fontSize)
          const rise = Math.min(64, width * 0.08)
          const extension = width
          svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
          path.setAttribute('d', homeSlopePath(width, rise, (height - rise + fontSize * 0.65) / 2, extension, direction))
          const textWidth = text.getComputedTextLength()
          origin = (direction === 'left' ? extension : homeCurveExtensionLength(width, rise, extension)) + (width - textWidth) / 2
          travel = Math.max(0, Math.min(width * 0.35, width - textWidth - 16))
          render()
        }
        measure()
        gsap.to(progress, {
          value: 1,
          ease: 'none',
          onUpdate: render,
          scrollTrigger: {
            trigger: row,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.4,
            onRefreshInit: measure,
            onRefresh: render,
          },
        })
        gsap.from(row.querySelector('p'), {
          y: 18,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: { trigger: row, start: 'top 85%', once: true },
        })
      })
      return () => rows.forEach(row => { delete row.dataset.processReady })
    })

    const refresh = () => {
      if (disposed) return
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => ScrollTrigger.refresh())
    }
    let width = section.clientWidth
    const resize = new ResizeObserver(() => {
      if (width === section.clientWidth) return
      width = section.clientWidth
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
    <section id="capabilities" ref={sectionRef} className={styles.capabilities} data-nav-surface="frost" aria-labelledby="capabilities-heading">
      <div className={styles.processInner}>
        <Reveal><h2 id="capabilities-heading" className={styles.processHeading}>how we work</h2></Reveal>
        <div className={styles.processList}>
          {process.map((step, index) => (
            <article key={step.title} className={styles.processRow} data-process-row aria-labelledby={`process-${id}-${index}-heading`}>
              <div className={styles.processWord}>
                <h3 id={`process-${id}-${index}-heading`}>{step.title}</h3>
                <svg className={styles.processRibbon} aria-hidden="true" focusable="false">
                  <defs><path id={`process-${id}-${index}`} /></defs>
                  <text><textPath href={`#process-${id}-${index}`}>{step.title}</textPath></text>
                </svg>
              </div>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
        <Reveal className={styles.processAction}><ModularButton href="#start-a-project">start a project</ModularButton></Reveal>
      </div>
      <SectionRise surface="navy" />
    </section>
  )
}
