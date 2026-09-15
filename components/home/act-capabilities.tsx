'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/motion'
import { ModularButton } from '@/components/modular-button'
import { SectionRise } from '@/components/home/section-rise'
import styles from './home-page.module.css'

const capabilities = [
  { title: 'creative.', description: 'Find your voice. Make your mark.', services: ['strategy', 'branding', 'websites', 'photography'] },
  { title: 'marketing.', description: 'Reach the right people. Keep them close.', services: ['campaigns', 'content', 'social', 'search'] },
]

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
        rotation: (index) => index === 0 ? -2 : 2,
        stagger: 0.12,
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
        {capabilities.map((item) => (
          <article className={styles.capabilityCard} data-capability-card key={item.title}>
            <div>
              <h3 className="font-serif">{item.title}</h3>
              <p>{item.description}</p>
            </div>
            <ul aria-label={`${item.title.replace('.', '')} services`}>
              {item.services.map((service) => <li key={service}>{service}</li>)}
            </ul>
          </article>
        ))}
      </div>
      <div className={styles.capabilitiesAction}><ModularButton href="/contact">let&apos;s talk</ModularButton></div>
      <SectionRise surface="work" />
    </section>
  )
}
