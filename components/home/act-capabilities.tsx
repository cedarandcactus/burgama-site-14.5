'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/motion'

const capabilities = [
  {
    label: 'Position and identity',
    title: 'Brand & direction',
    body: 'We find the useful truth, then turn it into a distinct identity and a system your team can actually use.',
  },
  {
    label: 'Websites and products',
    title: 'Digital & development',
    body: 'We design and build digital experiences that feel considered, work hard, and stay maintainable.',
  },
  {
    label: 'Stories in motion',
    title: 'Campaigns & content',
    body: 'We create the ideas, imagery, and production systems that keep a brand moving without losing the plot.',
  },
  {
    label: 'Traction over noise',
    title: 'Marketing & growth',
    body: 'We connect search, social, and ongoing support to the outcomes that matter—not activity for its own sake.',
  },
]

export function ActCapabilities() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const cards = gsap.utils.toArray<HTMLElement>('[data-capability-card]', section)
    const media = gsap.matchMedia()

    media.add('(prefers-reduced-motion: no-preference)', () => {
      const tweens = cards.map(card => gsap.fromTo(card, {
        xPercent: 42,
        rotate: 1.5,
        transformOrigin: 'center right',
      }, {
        xPercent: 0,
        rotate: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: card,
          start: 'top 96%',
          end: 'top 62%',
          scrub: 0.65,
          invalidateOnRefresh: true,
        },
      }))

      return () => tweens.forEach(tween => tween.kill())
    })

    return () => media.revert()
  }, [])

  return (
    <section ref={sectionRef} className="home-plate capabilities-plate" data-home-plate aria-labelledby="capabilities-heading">
      <div className="capabilities-shell">
        <div className="capabilities-intro">
          <h2 id="capabilities-heading" className="font-serif">Built wide.<br />Kept close.</h2>
          <p>Strategy, identity, digital, campaigns, and the people who connect them. One team stays with the work.</p>
        </div>
        <div className="capabilities-grid" role="list">
          {capabilities.map(item => (
            <article data-capability-card key={item.title} role="listitem">
              <p className="capability-label">{item.label}</p>
              <h3 className="font-serif text-balance">{item.title}</h3>
              <p className="capability-description">{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
