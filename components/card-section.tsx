'use client'

import { useId, useLayoutEffect, useRef, type CSSProperties } from 'react'
import imageMetadata from '@/lib/card-image-metadata.json'
import { ArrowUpRight } from 'lucide-react'
import Link from '@/components/transition-link'
import { SectionRise } from '@/components/home/section-rise'
import { ParallaxImage } from '@/components/parallax-image'
import { RevealHeading } from '@/components/reveal-heading'
import { usePortfolioMotion } from '@/components/use-portfolio-motion'
import styles from './card-section.module.css'

export type CardSectionItem = { title: string; href: string; image: string; alt: string }
type Props = { heading: string; subline?: string; items: CardSectionItem[]; columns?: 2 | 3; cta?: { label: string; href: string }; id?: string }

function imageStyle(image: string): CSSProperties {
  const dimensions = (imageMetadata as Record<string, { width: number; height: number }>)[image]
  if (!dimensions) throw new Error(`Missing card image dimensions: ${image}`)
  return { '--card-aspect': dimensions.width / dimensions.height, '--card-source-width': `${dimensions.width}px` } as CSSProperties
}

export function CardSection({ heading, subline, items, columns = 3, cta, id }: Props) {
  const root = useRef<HTMLElement>(null)
  const titleId = useId()
  const instructionsId = useId()
  usePortfolioMotion(root, items.map(item => item.href).join('|'))
  useLayoutEffect(() => {
    const nav = document.querySelector<HTMLElement>('.cyan-menu-trigger')
    const section = root.current
    if (!nav || !section) return
    const measure = () => {
      const style = getComputedStyle(nav)
      section.style.setProperty('--card-pill-border', style.borderTopWidth)
      section.style.setProperty('--card-pill-radius', style.borderTopLeftRadius)
      section.style.setProperty('--card-pill-height', style.height)
      section.style.setProperty('--card-pill-label', style.fontSize)
      section.style.setProperty('--card-pill-font', style.fontFamily)
      section.style.setProperty('--card-pill-padding', style.paddingInlineStart)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(nav)
    return () => observer.disconnect()
  }, [])
  if (!items.length) return null
  return <section ref={root} id={id} className={styles.section} aria-labelledby={titleId} data-card-section="" data-motion-scope="" data-nav-surface="ink">
    <div className={styles.entry} aria-hidden="true"><div className={styles.band}><SectionRise surface="navy" direction="left" /></div></div>
    <div className={styles.body}>
      <div className={styles.inner}>
        <header className={styles.head}>
          <RevealHeading id={titleId} text={heading} className={`${styles.heading} font-serif`} />
          {subline && <p className={styles.subline} data-cs-reveal="body">{subline}</p>}
        </header>
        <p id={instructionsId} className="sr-only">Use the arrow keys to scroll the cards, or Tab to visit each link.</p>
        <nav className={styles.grid} data-columns={items.length === 2 ? 2 : columns} aria-label={`${heading.replace(/\.$/, '')} cards`} aria-describedby={instructionsId} tabIndex={0} onKeyDown={event => {
          if (event.target !== event.currentTarget || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return
          event.preventDefault()
          const card = event.currentTarget.firstElementChild as HTMLElement | null
          event.currentTarget.scrollBy({ left: (event.key === 'ArrowRight' ? 1 : -1) * ((card?.offsetWidth ?? 250) + 16), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
        }}>
          {items.map((item, index) => <Link key={item.href} href={item.href} className={styles.card} data-cs-reveal="card" data-cs-index={index}>
            <span className={styles.media} style={imageStyle(item.image)} data-cs-reveal="media" data-cs-index={index}>
              <ParallaxImage src={item.image} alt={item.alt} strength={0} sizes="(max-width: 640px) 78vw, (max-width: 1024px) 50vw, 400px" />
            </span>
            <span className={`${styles.title} font-serif`} title={item.title}>{item.title}</span>
          </Link>)}
        </nav>
        {cta && <div className={styles.cta} data-cs-reveal="body"><Link href={cta.href} className={`pill ${styles.ctaLink}`}><span>{cta.label}</span><ArrowUpRight aria-hidden="true" /></Link></div>}
      </div>
    </div>
    <div className={styles.exit} aria-hidden="true"><div className={styles.band}><SectionRise surface="powder-deep" /></div></div>
  </section>
}
