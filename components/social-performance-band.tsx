'use client'

import { useEffect, useRef, useState } from 'react'

const socialStats = [
  { value: 286, suffix: 'K+', label: 'views' },
  { value: 3.85, suffix: 'K', label: 'sends' },
  { value: 71.5, suffix: 'K', label: 'average views' },
  { value: 1.35, suffix: '%', label: 'view-to-send rate' },
]

const studioCapabilities = [
  {
    eyebrow: 'Web',
    title: 'Digital experiences with a job to do.',
    body: 'Strategy, UX, visual design and development brought together as one connected customer experience.',
  },
  {
    eyebrow: 'Brand',
    title: 'Identity built for every place it needs to live.',
    body: 'Positioning, visual systems and product thinking that give brands a clear and usable point of view.',
  },
  {
    eyebrow: 'Content',
    title: 'Stories shaped for the channel and the moment.',
    body: 'Campaign concepts, photography, film, UGC and retailer collaborations made as one flexible content system.',
  },
]

function CountUp({ value, suffix }: { value: number; suffix: string }) {
  const [display, setDisplay] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(value)
      return
    }

    let frame = 0
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        const startedAt = performance.now()
        const animate = (now: number) => {
          const progress = Math.min((now - startedAt) / 1200, 1)
          setDisplay(value * (1 - Math.pow(1 - progress, 4)))
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
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="capabilities"
      ref={ref}
      aria-labelledby="studio-proof-title"
      className="section-navy scroll-mt-24 px-module py-28 md:py-40"
    >
      <div className="rail mx-auto grid gap-module overflow-hidden min-[900px]:grid-cols-12">
        <div className="pair-invert overflow-hidden rounded-module p-5 md:p-8 min-[900px]:col-span-5 min-[900px]:min-h-[420px]">
          <p className="t-ui mb-12">Burgama, broadly speaking</p>
          <h2 id="studio-proof-title" className="t-title text-balance min-[900px]:text-5xl">
            {['One studio.', 'Four connected practices.'].map((line, index) => (
              <span key={line} className="block overflow-hidden">
                <span
                  className="block transition-transform duration-700 ease-module motion-reduce:transform-none"
                  style={{
                    transform: visible ? 'translateY(0)' : 'translateY(110%)',
                    transitionDelay: `${index * 75}ms`,
                  }}
                >
                  {line}
                </span>
              </span>
            ))}
          </h2>
        </div>

        {studioCapabilities.slice(0, 2).map((capability, index) => (
          <article
            key={capability.eyebrow}
            className="flex min-h-64 flex-col justify-between rounded-module bg-navy p-5 transition-transform duration-700 ease-module motion-reduce:transform-none md:p-8 min-[900px]:col-span-7 min-[900px]:min-h-[206px]"
            style={{
              transform: visible ? 'translate3d(0,0,0)' : 'translate3d(0,18%,0)',
              transitionDelay: `${120 + index * 90}ms`,
            }}
          >
            <p className="t-ui">{capability.eyebrow}</p>
            <div className="flex flex-col gap-4 min-[900px]:flex-row min-[900px]:items-end min-[900px]:justify-between">
              <h3 className="t-section max-w-[18ch] text-balance">{capability.title}</h3>
              <p className="t-body max-w-[38ch] text-pretty">{capability.body}</p>
            </div>
          </article>
        ))}

        <article
          className="pair-invert rounded-module p-5 transition-transform duration-700 ease-module motion-reduce:transform-none md:p-8 min-[900px]:col-span-8"
          style={{
            transform: visible ? 'translate3d(0,0,0)' : 'translate3d(0,18%,0)',
            transitionDelay: '300ms',
          }}
        >
          <p className="t-ui mb-12">Social</p>
          <h3 className="t-section mb-7 text-balance">Content made to travel.</h3>
          <div className="grid grid-cols-2 gap-module min-[1100px]:grid-cols-4">
            {socialStats.map((stat, index) => (
              <div
                key={stat.label}
                className={`flex min-h-32 flex-col justify-between rounded-module p-4 ${
                  index === 0 ? 'col-span-2 bg-navy text-periwinkle min-[1100px]:col-span-2' : 'bg-navy text-periwinkle'
                }`}
              >
                <strong className={`${index === 0 ? 'text-6xl md:text-7xl' : 'text-4xl md:text-5xl'} font-serif leading-none tracking-[-0.06em]`}>
                  <CountUp value={stat.value} suffix={stat.suffix} />
                </strong>
                <span className="t-ui">{stat.label}</span>
              </div>
            ))}
          </div>
        </article>

        {studioCapabilities.slice(2).map((capability) => (
          <article
            key={capability.eyebrow}
            className="flex min-h-64 flex-col justify-between rounded-module bg-navy p-5 transition-transform delay-500 duration-700 ease-module motion-reduce:transform-none md:p-8 min-[900px]:col-span-4"
            style={{ transform: visible ? 'translate3d(0,0,0)' : 'translate3d(0,18%,0)' }}
          >
            <p className="t-ui">{capability.eyebrow}</p>
            <div className="flex flex-col gap-4">
              <h3 className="t-section text-balance">{capability.title}</h3>
              <p className="t-body text-pretty">{capability.body}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
