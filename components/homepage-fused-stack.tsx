'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { Project } from '@/lib/projects'

type Row = {
  /** Width as a fraction of the stack width. */
  w: number
  /** Height as a fraction of the stack width. */
  h: number
  /** Font size as a fraction of the stack width. */
  fs?: number
  text?: string
  href?: string
  external?: boolean
  tracking?: number
  marquee?: 'left' | 'right'
}

function buildRows(projects: Project[]): Row[] {
  const work = projects.slice(0, 4)
  const workWidths = [0.78, 0.92, 0.68, 0.84]

  return [
    { w: 0.34, h: 0.088, fs: 0.032, text: 'BURGAMA', tracking: 0.014, href: '/' },
    { w: 0.62, h: 0.082, fs: 0.026, text: 'AUSTIN, TEXAS' },
    { w: 0.86, h: 0.118, fs: 0.072, text: 'MADE FOR' },
    { w: 0.96, h: 0.118, fs: 0.072, text: 'WHAT COMES NEXT' },
    { w: 0.78, h: 0.082, fs: 0.026, text: 'BRAND · WEB · CONTENT · GROWTH' },
    { w: 0.26, h: 0.07 },
    { w: 0.96, h: 0.108, fs: 0.044, marquee: 'left' },
    { w: 0.84, h: 0.108, fs: 0.044, marquee: 'right' },
    { w: 0.24, h: 0.07 },
    ...work.map((project, index) => ({
      w: workWidths[index],
      h: 0.104,
      fs: 0.048,
      text: project.title.toUpperCase(),
      href: `/work/${project.slug}`,
    })),
    { w: 0.24, h: 0.07 },
    { w: 0.46, h: 0.108, fs: 0.046, text: 'ALL WORK', href: '/work' },
    { w: 0.6, h: 0.108, fs: 0.046, text: 'THE STUDIO', href: '/studio' },
    { w: 0.9, h: 0.124, fs: 0.054, text: 'START A PROJECT', href: '/contact' },
    { w: 0.28, h: 0.078 },
    {
      w: 0.64,
      h: 0.096,
      fs: 0.03,
      text: 'HELLO@BURGAMA.COM',
      href: 'mailto:hello@burgama.com',
      external: true,
    },
  ]
}

function rowStyle(row: Row) {
  return {
    width: `calc(var(--stack-w) * ${row.w})`,
    height: `calc(var(--stack-w) * ${row.h})`,
  }
}

export function HomepageFusedStack({ projects }: { projects: Project[] }) {
  const [hot, setHot] = useState<number | null>(null)

  const brands = projects.map((project) => project.client.toUpperCase())
  const rows = buildRows(projects)

  return (
    <section className="fused-shell" aria-labelledby="fused-heading">
      <h1 id="fused-heading" className="sr-only">
        Burgama — an Austin, Texas creative studio made for what comes next.
      </h1>

      <svg aria-hidden="true" className="fused-defs" focusable="false">
        <defs>
          {/* Blur then threshold: neighbouring bars melt together with concave fillets. */}
          <filter id="fused-goo" x="-12%" y="-4%" width="124%" height="108%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="soft" />
            <feColorMatrix
              in="soft"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -10"
            />
          </filter>
        </defs>
      </svg>

      <div className="fused-body">
        {/* Silhouette only, so the goo filter never blurs the type. */}
        <div aria-hidden="true" className="fused-shapes">
          {rows.map((row, index) => (
            <div
              key={index}
              className={`fused-shape${hot === index ? ' is-hot' : ''}`}
              style={{ ...rowStyle(row), ['--i' as string]: index }}
            />
          ))}
        </div>

        {/* Crisp content layer mirrors the shape stack exactly. */}
        <div className="fused-type">
          {rows.map((row, index) => {
            const style = { ...rowStyle(row), ['--i' as string]: index }
            const textStyle = {
              fontSize: row.fs ? `calc(var(--stack-w) * ${row.fs})` : undefined,
              letterSpacing: row.tracking ? `calc(var(--stack-w) * ${row.tracking})` : undefined,
              marginRight: row.tracking ? `calc(var(--stack-w) * -${row.tracking})` : undefined,
            }

            if (row.marquee) {
              return (
                <div key={index} className="fused-line fused-line-reel" style={style}>
                  <div className={`fused-reel fused-reel-${row.marquee}`} style={textStyle}>
                    {[0, 1].map((copy) => (
                      <span key={copy} aria-hidden={copy === 1} className="fused-reel-group">
                        {brands.map((brand) => (
                          <span key={brand} className="fused-reel-item">
                            {brand}
                          </span>
                        ))}
                      </span>
                    ))}
                  </div>
                </div>
              )
            }

            if (!row.text) return <div key={index} className="fused-line" style={style} />

            const label = (
              <span className="fused-label" style={textStyle}>
                {row.text}
              </span>
            )

            if (!row.href) {
              return (
                <div key={index} className="fused-line" style={style}>
                  {label}
                </div>
              )
            }

            const handlers = {
              onMouseEnter: () => setHot(index),
              onMouseLeave: () => setHot((current) => (current === index ? null : current)),
              onFocus: () => setHot(index),
              onBlur: () => setHot((current) => (current === index ? null : current)),
            }

            return (
              <div key={index} className="fused-line" style={style}>
                {row.external ? (
                  <a href={row.href} className="fused-link" {...handlers}>
                    {label}
                  </a>
                ) : (
                  <Link href={row.href} className="fused-link" {...handlers}>
                    {label}
                  </Link>
                )}
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
