'use client'

import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { gsap } from '@/lib/motion'
import { ModularButton } from '@/components/modular-button'
import { SectionRise } from '@/components/home/section-rise'
import styles from './home-page.module.css'

const capabilities = [
  {
    title: 'creative.',
    services: [
      { name: 'strategy', detail: 'Positioning, a clear point of view, and a direction to build on.' },
      { name: 'branding', detail: 'Identity, language, and design systems that feel like you.' },
      { name: 'websites', detail: 'Thoughtful design and development, from first impression to everyday use.' },
      { name: 'photography', detail: 'Art direction and original imagery for your brand, products, and people.' },
    ],
  },
  {
    title: 'marketing.',
    services: [
      { name: 'campaigns', detail: 'One clear idea, carried through the channels that matter.' },
      { name: 'content', detail: 'Words, images, and films with something worth saying.' },
      { name: 'social', detail: 'A considered presence, with content and community working together.' },
      { name: 'search', detail: 'Organic and paid search that helps the right people find you.' },
    ],
  },
]

function CapabilityCard({ capability }: { capability: typeof capabilities[number] }) {
  const id = useId()
  const [selected, setSelected] = useState(0)
  const tabsRef = useRef<HTMLDivElement>(null)

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.nativeEvent.isComposing || event.keyCode === 229 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    const total = capability.services.length
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? total - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + total) % total
    setSelected(next)
    tabsRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus({ preventScroll: true })
  }

  return (
    <article className={styles.capabilityCard} data-capability-card>
      <h3 className="font-serif">{capability.title}</h3>
      <div className={styles.capabilityServices}>
        <div ref={tabsRef} className={styles.serviceTabs} role="tablist" aria-label={`${capability.title.replace('.', '')} services`}>
          {capability.services.map((service, index) => (
            <button
              key={service.name}
              type="button"
              role="tab"
              id={`${id}-tab-${index}`}
              aria-selected={selected === index}
              aria-controls={`${id}-panel-${index}`}
              tabIndex={selected === index ? 0 : -1}
              onClick={() => setSelected(index)}
              onKeyDown={(event) => onKeyDown(event, index)}
            >
              {service.name}
            </button>
          ))}
        </div>
        <div className={styles.serviceDetails}>
          {capability.services.map((service, index) => (
            <div key={service.name} role="tabpanel" id={`${id}-panel-${index}`} aria-labelledby={`${id}-tab-${index}`} hidden={selected !== index} tabIndex={0}>
              <p>{service.detail}</p>
            </div>
          ))}
        </div>
      </div>
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
        {capabilities.map((item) => <CapabilityCard key={item.title} capability={item} />)}
      </div>
      <div className={styles.capabilitiesAction}><ModularButton href="/contact">let&apos;s talk</ModularButton></div>
      <SectionRise surface="work" />
    </section>
  )
}
