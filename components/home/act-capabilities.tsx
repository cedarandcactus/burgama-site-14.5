'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/motion'
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

function CapabilityCard({ capability }: { capability: typeof capabilities[number] }) {
  return (
    <article className={styles.capabilityCard} data-capability-card>
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
    const media = gsap.matchMedia(section)

    media.add('(prefers-reduced-motion: no-preference)', () => {
      const cards = section.querySelectorAll('[data-capability-card]')
      gsap.from(cards, {
        y: 48,
        stagger: 0.08,
        duration: 1,
        ease: 'power3.out',
        clearProps: 'transform',
        scrollTrigger: { trigger: section, start: 'top 85%', once: true },
      })
    })

    return () => media.revert()
  }, [])

  return (
    <section id="capabilities" ref={sectionRef} className={styles.capabilities} data-nav-surface="frost" aria-labelledby="capabilities-heading">
      <h2 id="capabilities-heading" className="sr-only">two sides of one studio</h2>
      <div className={styles.capabilitiesGrid}>
        {capabilities.map((item) => <CapabilityCard key={item.title} capability={item} />)}
      </div>
      <SectionRise surface="navy" />
    </section>
  )
}
