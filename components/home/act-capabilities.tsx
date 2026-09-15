'use client'

import { useEffect, useRef } from 'react'
import { homeCardPath, homeSlopeSample } from '@/lib/home-curve'
import { ModularButton } from '@/components/modular-button'
import { SectionRise } from '@/components/home/section-rise'
import styles from './home-page.module.css'

const capabilities = [
  {
    title: 'creative.',
    description: 'We find what makes your business distinct, then bring it to life through identity, websites, and imagery.',
    accessibleAction: 'Our creative approach',
  },
  {
    title: 'marketing.',
    description: 'We connect strategy, content, and campaigns to reach the right people—and keep learning from what works.',
    accessibleAction: 'Our marketing approach',
  },
]

function CapabilityCard({ capability, index }: { capability: typeof capabilities[number]; index: number }) {
  return (
    <article className={styles.capabilityCard} data-capability-card>
      <svg className={styles.cardContour} viewBox="0 0 550 400" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path d={homeCardPath(550, 400,
          { left: index ? 0.4 : 0.05, right: index ? 1 : 0.4, tangent: 0.15, proximity: index ? 0.45 : 0.9 },
          { left: index ? 0.4 : 1, right: index ? 0.05 : 0.4, tangent: -0.15, proximity: index ? 0.9 : 0.45 },
        )} />
      </svg>
      <h3 className="font-serif">{capability.title}</h3>
      <p>{capability.description}</p>
      <ModularButton href="/studio">
        <span aria-hidden="true">our approach</span>
        <span className="sr-only">{capability.accessibleAction}</span>
      </ModularButton>
    </article>
  )
}

export function ActCapabilities() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const cards = [...section.querySelectorAll<HTMLElement>('[data-capability-card]')]
    const incoming = section.previousElementSibling?.querySelector<SVGSVGElement>('[data-nav-curve]')
    const outgoing = section.querySelector<SVGSVGElement>('[data-nav-curve]')
    if (!incoming || !outgoing) return
    let frame = 0
    let disposed = false

    function measure() {
      frame = 0
      if (disposed) return
      for (const card of cards) {
        const rect = card.getBoundingClientRect()
        const sampleEdge = (curve: SVGSVGElement, top: boolean) => {
          const bounds = curve.getBoundingClientRect()
          const direction = curve.dataset.direction === 'left' ? 'left' : 'right'
          const sample = (x: number) => homeSlopeSample(x - bounds.left, bounds.width, bounds.height, direction)
          const center = sample(rect.left + rect.width / 2)
          const distance = top ? rect.top - bounds.top - center.y : bounds.top + center.y - rect.bottom
          return {
            left: sample(rect.left).y / bounds.height,
            right: sample(rect.right).y / bounds.height,
            tangent: center.tangent,
            proximity: 1 / (1 + Math.max(0, distance) / (rect.height * 0.85)),
          }
        }
        const svg = card.querySelector('svg')!
        svg.setAttribute('viewBox', `0 0 ${rect.width} ${rect.height}`)
        svg.querySelector('path')!.setAttribute('d', homeCardPath(rect.width, rect.height, sampleEdge(incoming!, true), sampleEdge(outgoing!, false)))
      }
    }
    const refresh = () => {
      if (!disposed && !frame) frame = requestAnimationFrame(measure)
    }
    const observer = new ResizeObserver(refresh)
    for (const element of [section, incoming, outgoing, ...cards]) observer.observe(element)
    measure()
    document.fonts.ready.then(refresh)
    document.fonts.addEventListener('loadingdone', refresh)
    window.addEventListener('resize', refresh, { passive: true })
    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      observer.disconnect()
      document.fonts.removeEventListener('loadingdone', refresh)
      window.removeEventListener('resize', refresh)
    }
  }, [])

  return (
    <section id="capabilities" ref={sectionRef} className={styles.capabilities} data-nav-surface="frost" aria-labelledby="capabilities-heading">
      <h2 id="capabilities-heading" className="sr-only">two sides of one studio</h2>
      <div className={styles.capabilitiesGrid}>
        {capabilities.map((item, index) => <CapabilityCard key={item.title} capability={item} index={index} />)}
      </div>
      <SectionRise surface="navy" />
    </section>
  )
}
