'use client'

import { useEffect, useRef, useState } from 'react'

const socialWork = [
  {
    client: 'Patent Earth',
    detail: 'Instagram Reel',
    views: '85K views',
    sends: '1K sends',
    href: 'https://www.instagram.com/reel/DbWC2CTgQ4L/?igsh=ZnlmMXk4dG5sb2N3',
  },
  {
    client: 'Clement Senior Solutions',
    detail: 'Instagram Reel',
    views: '165K views',
    sends: '2.3K sends',
    href: 'https://www.instagram.com/reel/DZ3SSzZp6ku/?igsh=MXBjMHE4aHkycnN4Nw==',
  },
  {
    client: 'MatchDay',
    detail: 'Instagram Reel',
    views: '15K views',
    sends: '550 sends',
    href: 'https://www.instagram.com/reel/DbObtvtR6Gt/?igsh=dDBqdmtmcjBmbG9s',
  },
  {
    client: 'MatchDay',
    detail: 'TikTok',
    views: '21K views',
    href: 'https://vt.tiktok.com/ZS4NTX3rn/',
  },
  {
    client: 'AVRO',
    detail: 'UGC content creation',
    href: 'https://www.instagram.com/reel/DW9Tvp7kYqJ/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
  },
  {
    client: 'AVRO',
    detail: 'Retailer collaborations',
    href: 'https://www.instagram.com/reel/DXzkW0cxZdB/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
  },
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

  const formatted = value % 1 === 0 ? Math.round(display).toString() : display.toFixed(2)

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
          <p className="t-ui mb-12">Documented social performance</p>
          <h2 id="social-proof-title" className="t-title text-balance">
            <span
              className="block transition-transform duration-700 ease-module motion-reduce:transform-none"
              style={{ transform: visible ? 'translateY(0)' : 'translateY(110%)' }}
            >
              Social media
            </span>
            <span className="block overflow-hidden">
              <span
                className="block transition-transform delay-75 duration-700 ease-module motion-reduce:transform-none"
                style={{ transform: visible ? 'translateY(0)' : 'translateY(110%)' }}
              >
                content creation
              </span>
            </span>
          </h2>
        </div>

        <div className="flex gap-module">
          <div className="flex min-h-44 basis-[58%] flex-col justify-between rounded-module bg-surface-1 p-5 md:p-7">
            <strong className="font-serif text-5xl leading-none tracking-[-0.06em] md:text-6xl">
              <CountUp value={286} suffix="K+" />
            </strong>
            <span className="t-ui">documented views</span>
          </div>
          <div className="flex min-h-44 basis-[42%] flex-col justify-between rounded-module bg-surface-2 p-5 md:p-7">
            <strong className="font-serif text-4xl leading-none tracking-[-0.06em] md:text-5xl">
              <CountUp value={3.85} suffix="K" />
            </strong>
            <span className="t-ui">documented sends</span>
          </div>
        </div>

        <div className="social-data-list flex flex-col gap-module">
          {socialWork.map((item, index) => (
            <a
              key={`${item.client}-${item.detail}`}
              href={item.href}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={`View ${item.client} ${item.detail} on social media`}
              className="social-data-row flex min-h-24 items-center justify-between gap-4 rounded-module bg-surface-1 p-4 transition-[transform,background-color,color] duration-700 ease-module hover:bg-periwinkle hover:text-navy focus-visible:bg-periwinkle focus-visible:text-navy md:p-5"
              style={{
                transform: visible
                  ? 'translate3d(0,0,0)'
                  : `translate3d(${index % 2 === 0 ? '-18%' : '18%'},0,0)`,
                transitionDelay: `${140 + index * 70}ms`,
              }}
            >
              <span className="min-w-0">
                <strong className="block truncate font-sans text-base leading-tight">{item.client}</strong>
                <span className="mt-1 block font-sans text-sm leading-tight text-muted-foreground">
                  {item.detail}
                </span>
              </span>
              <span className="flex shrink-0 flex-col items-end font-mono text-xs leading-relaxed">
                {item.views && <span>{item.views}</span>}
                {item.sends && <span>{item.sends}</span>}
                {!item.views && !item.sends && <span>View work ↗</span>}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
