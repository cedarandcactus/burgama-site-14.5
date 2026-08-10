'use client'

import { useEffect, useRef, useState } from 'react'

const stats = [
  { value: 286, suffix: 'K+', label: 'documented views', tone: 'bg-surface-1', size: 'large' },
  { value: 3.85, suffix: 'K', label: 'documented sends', tone: 'bg-surface-2', size: 'medium' },
  { value: 71.5, suffix: 'K', label: 'average views', tone: 'bg-surface-2', size: 'medium' },
  { value: 4, suffix: '', label: 'measured posts', tone: 'bg-surface-1', size: 'small' },
  { value: 3, suffix: '', label: 'featured brands', tone: 'bg-periwinkle text-navy', size: 'small' },
]

const capabilities = [
  ['Social strategy', 'Channel direction, campaign thinking and a clear plan for what gets made.'],
  ['Content creation', 'Platform-native concepts, production and edits built to earn attention.'],
  ['UGC', 'Creator-led content that feels natural in-feed while staying true to the brand.'],
  ['Retailer collaborations', 'Coordinated content that connects brands with their retail partners.'],
  ['Channel management', 'Publishing, iteration and ongoing stewardship across social channels.'],
]

function CountUp({ value, suffix }: { value: number; suffix: string }) {
  const [display, setDisplay] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) {
      setDisplay(value)
      return
    }

    let frame = 0
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return

        const startedAt = performance.now()
        const duration = 1200
        const animate = (now: number) => {
          const progress = Math.min((now - startedAt) / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 4)
          setDisplay(value * eased)
          if (progress < 1) frame = requestAnimationFrame(animate)
        }

        frame = requestAnimationFrame(animate)
        observer.disconnect()
      },
      { threshold: 0.5 },
    )

    observer.observe(node)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [value])

  const decimals = value % 1 === 0 ? 0 : value.toString().split('.')[1]?.length ?? 1
  const formatted = decimals === 0 ? Math.round(display).toString() : display.toFixed(decimals)

  return (
    <span ref={ref} className="tabular-nums">
      {formatted}
      {suffix}
    </span>
  )
}

export function SocialPerformanceBand() {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setVisible(true)
        observer.disconnect()
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.12 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} aria-labelledby="social-proof-title" className="px-module pb-28 md:pb-40">
      <div className="rail mx-auto flex flex-col gap-module overflow-hidden">
        <div className="overflow-hidden rounded-module bg-periwinkle p-5 text-navy md:p-7">
          <p className="t-ui mb-12">Social media content creation</p>
          <h2 id="social-proof-title" className="t-title text-balance">
            <span className="block overflow-hidden">
              <span
                className="block transition-transform duration-700 ease-module motion-reduce:transform-none"
                style={{ transform: visible ? 'translateY(0)' : 'translateY(110%)' }}
              >
                Performance,
              </span>
            </span>
            <span className="block overflow-hidden">
              <span
                className="block transition-transform delay-75 duration-700 ease-module motion-reduce:transform-none"
                style={{ transform: visible ? 'translateY(0)' : 'translateY(110%)' }}
              >
                documented.
              </span>
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-module">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`flex min-h-36 flex-col justify-between rounded-module p-5 transition-transform duration-700 ease-module motion-reduce:transform-none md:p-7 ${stat.tone} ${index === 0 ? 'col-span-2 min-h-52' : ''} ${index === 3 ? 'col-span-1' : ''}`}
              style={{
                transform: visible ? 'translate3d(0,0,0)' : 'translate3d(0,24%,0)',
                transitionDelay: `${100 + index * 80}ms`,
              }}
            >
              <strong
                className={`font-serif leading-none tracking-[-0.06em] ${stat.size === 'large' ? 'text-7xl md:text-8xl' : stat.size === 'medium' ? 'text-5xl md:text-6xl' : 'text-4xl md:text-5xl'}`}
              >
                <CountUp value={stat.value} suffix={stat.suffix} />
              </strong>
              <span className="t-ui">{stat.label}</span>
            </div>
          ))}
        </div>

        <div className="mt-20 flex flex-col gap-module md:mt-28" aria-labelledby="social-capabilities-title">
          <div className="rounded-module bg-surface-1 p-5 md:p-7">
            <p className="t-ui mb-12">What we make</p>
            <h3 id="social-capabilities-title" className="t-title text-balance">
              Social systems built to move.
            </h3>
          </div>

          <div className="flex flex-col gap-module">
            {capabilities.map(([title, body], index) => (
              <article
                key={title}
                className={`flex min-h-40 flex-col justify-between rounded-module p-5 transition-transform duration-700 ease-module motion-reduce:transform-none md:p-7 ${index % 2 === 0 ? 'bg-surface-2' : 'bg-surface-1'}`}
                style={{
                  transform: visible ? 'translate3d(0,0,0)' : 'translate3d(12%,0,0)',
                  transitionDelay: `${400 + index * 70}ms`,
                }}
              >
                <h4 className="t-section text-balance">{title}</h4>
                <p className="t-body text-pretty">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
