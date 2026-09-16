'use client'

import { useEffect, useId, useRef } from 'react'
import type { IdeaVisual } from '@/lib/editorial'
import styles from './editorial.module.css'

type Stop = [position: number, color: string, opacity?: number]
type Gradient =
  | { kind: 'linear'; points: [number, number, number, number]; stops: Stop[] }
  | { kind: 'radial'; points: [number, number, number]; stops: Stop[] }
type Field = { path: string; gradient: Gradient; soft?: boolean }
type Composition = { background: Gradient; fields: Field[] }

const navy = 'var(--art-navy)'
const cobalt = 'var(--art-cobalt)'
const powder = 'var(--art-powder)'
const yellow = 'var(--art-yellow)'
const cream = 'var(--art-cream)'
const lilac = 'var(--art-lilac)'
const seafoam = 'var(--art-seafoam)'

const compositions: Record<IdeaVisual, Composition> = {
  platforms: {
    background: { kind: 'linear', points: [0, 0, 0, 1000], stops: [[0, cream], [.23, yellow], [.42, powder], [.61, cobalt], [1, navy]] },
    fields: [
      {
        path: 'M-400 650 C-40 560 110 695 340 605 S650 630 860 510 S1250 600 1460 460 L2000 340 V1500 H-400Z',
        gradient: { kind: 'linear', points: [0, 470, 160, 1160], stops: [[0, navy], [.24, navy], [.55, cobalt], [.78, powder], [1, lilac]] },
      },
      {
        path: 'M-400 210 C100 70 170 320 570 225 S1170 180 1450 235 L2000 110 V-500 H-400Z',
        gradient: { kind: 'linear', points: [0, -80, 0, 380], stops: [[0, cream], [.54, yellow], [1, powder, 0]] },
        soft: true,
      },
      {
        path: 'M-400 1400 V950 C100 850 380 990 820 850 S1400 920 2000 660 V1400Z',
        gradient: { kind: 'linear', points: [0, 780, 0, 1240], stops: [[0, powder, 0], [.42, powder, .8], [1, cream]] },
        soft: true,
      },
    ],
  },
  email: {
    background: { kind: 'radial', points: [360, 310, 1200], stops: [[0, cream], [.24, yellow], [.44, powder], [.64, lilac], [.84, cobalt], [1, navy]] },
    fields: [
      {
        path: 'M-400 1250 C-50 650 760 1170 1040 470 C1200 70 840 -80 2000 -400 V1600 H-400Z',
        gradient: { kind: 'radial', points: [630, 280, 1130], stops: [[0, powder], [.4, lilac], [.55, powder], [.65, cobalt], [.76, navy], [1, powder]] },
      },
      {
        path: 'M-400 -400 H1450 C1060 -10 1000 550 750 595 S260 490 -400 870Z',
        gradient: { kind: 'radial', points: [380, 225, 750], stops: [[0, cream], [.32, yellow], [.69, yellow, .8], [1, powder, 0]] },
        soft: true,
      },
      {
        path: 'M340 1400 C250 1050 880 830 1120 780 S1450 690 2000 840 V1400Z',
        gradient: { kind: 'radial', points: [1070, 1160, 700], stops: [[0, powder], [.45, lilac, .8], [1, lilac, 0]] },
        soft: true,
      },
    ],
  },
  audit: {
    background: { kind: 'linear', points: [250, 0, 1300, 1000], stops: [[0, navy], [.35, cobalt], [.53, powder], [.61, cream], [.69, powder], [1, cobalt]] },
    fields: [
      {
        path: 'M-400 -450 H2000 V160 C1470 260 1470 470 1100 500 S590 760 390 1020 L-400 1600Z',
        gradient: { kind: 'linear', points: [500, 130, 1150, 870], stops: [[0, navy], [.46, navy], [.62, cobalt], [.77, powder], [.87, yellow], [1, cobalt]] },
      },
      {
        path: 'M-400 -400 H2000 V-180 C1300 -100 1270 220 950 245 S510 480 210 660 L-400 1020Z',
        gradient: { kind: 'linear', points: [300, -200, 800, 610], stops: [[0, navy], [.44, cobalt], [.74, powder], [.87, lilac], [1, navy]] },
      },
      {
        path: 'M450 1450 C720 940 1040 790 2000 460 V1500Z',
        gradient: { kind: 'linear', points: [650, 720, 1360, 1310], stops: [[0, powder, 0], [.45, cobalt, .65], [1, navy]] },
        soft: true,
      },
    ],
  },
  reviews: {
    background: { kind: 'linear', points: [100, 0, 1500, 1000], stops: [[0, cream], [.32, yellow], [.55, powder], [.7, cobalt], [1, powder]] },
    fields: [
      {
        path: 'M700 -500 C1030 -40 640 290 760 485 S1220 860 550 1500 H2200 V-500Z',
        gradient: { kind: 'linear', points: [700, 300, 1700, 850], stops: [[0, navy], [.19, navy], [.36, cobalt], [.65, powder], [1, cream]] },
      },
      {
        path: 'M-400 -500 H700 C1190 -60 590 230 630 485 S1180 1080 500 1500 H-400Z',
        gradient: { kind: 'linear', points: [0, 280, 850, 540], stops: [[0, cream], [.5, yellow], [.78, seafoam], [.94, powder], [1, cobalt]] },
      },
      {
        path: 'M900 -500 H2000 V1500 H1050 C1630 1060 1440 600 1220 470 S1280 160 900 -500Z',
        gradient: { kind: 'radial', points: [1540, 650, 900], stops: [[0, cream, .7], [.4, powder, .7], [1, powder, 0]] },
        soft: true,
      },
    ],
  },
  sitemap: {
    background: { kind: 'linear', points: [0, 0, 1250, 1000], stops: [[0, cream], [.28, yellow], [.62, seafoam], [1, powder]] },
    fields: [
      {
        path: 'M380 -500 C1100 90 -100 420 340 660 S1190 760 900 1500 H1410 C1660 780 500 840 660 470 S1330 0 900 -500Z',
        gradient: { kind: 'linear', points: [370, 50, 1100, 1000], stops: [[0, powder], [.3, cobalt], [.48, navy], [.65, cobalt], [.82, powder], [1, seafoam]] },
      },
      {
        path: 'M2000 -300 C1290 60 1590 280 1170 410 S500 720 -400 1000 V680 C500 660 580 380 1100 285 S1250 -60 1500 -400Z',
        gradient: { kind: 'linear', points: [1400, -100, 460, 940], stops: [[0, seafoam], [.27, powder], [.5, powder], [.62, cobalt], [.78, powder], [1, cream]] },
      },
      {
        path: 'M-400 -300 H2000 V170 C1320 0 960 10 610 250 S-40 20 -400 320Z',
        gradient: { kind: 'radial', points: [430, -60, 900], stops: [[0, yellow], [.54, yellow, .9], [1, seafoam, 0]] },
        soft: true,
      },
    ],
  },
  performance: {
    background: { kind: 'linear', points: [150, 0, 1450, 1000], stops: [[0, navy], [.38, cobalt], [.65, powder], [.72, yellow], [.8, powder], [1, navy]] },
    fields: [
      {
        path: 'M-400 30 C180 620 1160 450 2000 1070 V1500 H-400Z',
        gradient: { kind: 'linear', points: [700, 220, 660, 1260], stops: [[0, powder], [.29, cobalt], [.45, navy], [.62, navy], [.8, cobalt], [1, powder]] },
      },
      {
        path: 'M-400 -100 C220 250 700 180 2000 960 V-500 H-400Z',
        gradient: { kind: 'linear', points: [750, -20, 590, 720], stops: [[0, navy], [.32, cobalt], [.57, powder], [.68, cream], [.74, yellow], [.86, cobalt], [1, navy]] },
      },
      {
        path: 'M-400 820 C280 1130 630 580 2000 1410 V1700 H-400Z',
        gradient: { kind: 'linear', points: [600, 770, 500, 1280], stops: [[0, powder, 0], [.38, powder], [.6, cobalt], [1, navy]] },
        soft: true,
      },
    ],
  },
}

function GradientDefinition({ id, gradient }: { id: string; gradient: Gradient }) {
  const stops = gradient.stops.map(([offset, color, opacity = 1], index) => (
    <stop key={index} offset={offset} stopColor={color} stopOpacity={opacity} />
  ))

  if (gradient.kind === 'radial') {
    const [cx, cy, r] = gradient.points
    return <radialGradient id={id} gradientUnits="userSpaceOnUse" cx={cx} cy={cy} r={r}>{stops}</radialGradient>
  }

  const [x1, y1, x2, y2] = gradient.points
  return <linearGradient id={id} gradientUnits="userSpaceOnUse" x1={x1} y1={y1} x2={x2} y2={y2}>{stops}</linearGradient>
}

export function EditorialArtwork({ visual, variant = 'cover' }: { visual: IdeaVisual; variant?: 'cover' | 'hero' | 'background' }) {
  const frameRef = useRef<HTMLDivElement>(null)
  const id = `editorial-${useId().replace(/:/g, '')}`
  const composition = compositions[visual]

  useEffect(() => {
    const frame = frameRef.current
    if (!frame || !('IntersectionObserver' in window)) return

    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    let visible = false
    const sync = () => {
      frame.dataset.running = String(visible && !document.hidden && !preference.matches)
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      sync()
    })

    observer.observe(frame)
    preference.addEventListener('change', sync)
    document.addEventListener('visibilitychange', sync)
    sync()
    return () => {
      observer.disconnect()
      preference.removeEventListener('change', sync)
      document.removeEventListener('visibilitychange', sync)
      delete frame.dataset.running
    }
  }, [])

  return (
    <div ref={frameRef} className={styles.artwork} data-visual={visual} data-variant={variant} aria-hidden="true">
      <svg className={styles.artworkField} viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" focusable="false">
        <defs>
          <GradientDefinition id={`${id}-base`} gradient={composition.background} />
          {composition.fields.map((field, index) => <GradientDefinition key={index} id={`${id}-field-${index}`} gradient={field.gradient} />)}
          <filter id={`${id}-ripple`} x="-20%" y="-30%" width="140%" height="160%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency=".009 .024" numOctaves="2" seed="8" result="texture" />
            <feDisplacementMap in="SourceGraphic" in2="texture" scale="32" xChannelSelector="R" yChannelSelector="G" />
            <feGaussianBlur stdDeviation="9" />
          </filter>
          <filter id={`${id}-soft`} x="-20%" y="-30%" width="140%" height="160%" colorInterpolationFilters="sRGB">
            <feGaussianBlur stdDeviation="32" />
          </filter>
          <filter id={`${id}-grain`} x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency=".72" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>
        <rect x="-400" y="-500" width="2400" height="2000" fill={`url(#${id}-base)`} />
        {composition.fields.map((field, index) => (
          <g key={index} className={styles.artworkLayer} data-layer={index}>
            <path d={field.path} fill={`url(#${id}-field-${index})`} filter={`url(#${id}-${field.soft ? 'soft' : 'ripple'})`} />
          </g>
        ))}
        <rect className={styles.artworkGrain} width="1600" height="1000" filter={`url(#${id}-grain)`} />
      </svg>
    </div>
  )
}
