'use client'

import { useLayoutEffect, useRef, type ReactNode } from 'react'
import { ArtifactSlot } from '@/components/artifact-slot'
import { SectionRise } from '@/components/home/section-rise'
import { gsap } from '@/lib/motion'

type Surface = 'white' | 'powder' | 'powder-deep' | 'butter' | 'navy' | 'blue-slate' | 'blue-mid'

type PageHeroProps = {
  wordmark: string
  variant?: 'default' | 'centered'
  intro?: string[]
  introAsTagline?: boolean
  artifactId?: string
  panel?: ReactNode
  mediaFullWidth?: boolean
  backgroundMedia?: boolean
  headingLevel?: 'h1' | 'h2'
  titleId?: string
  compact?: boolean
  motion?: 'default' | 'editorial'
  surface?: Surface
  nextSurface?: Surface
  breadcrumb?: ReactNode
  breadcrumbLabel?: string
  metadata?: ReactNode
  actions?: ReactNode
  children?: ReactNode
}

export function PageHero({ wordmark, variant = 'default', intro = [], introAsTagline = false, artifactId, panel, mediaFullWidth = false, backgroundMedia = false, headingLevel: Heading = 'h1', titleId, compact = false, motion = 'default', surface = 'powder', nextSurface = 'blue-slate', breadcrumb, breadcrumbLabel = 'Breadcrumb', metadata, actions, children }: PageHeroProps) {
  const heroRef = useRef<HTMLElement>(null)
  const media = panel ?? (artifactId ? <ArtifactSlot id={artifactId} /> : null)
  const words = wordmark.trim().split(/\s+/)

  useLayoutEffect(() => {
    const hero = heroRef.current
    if (!hero) return

    const animations = gsap.matchMedia(hero)
    animations.add('(prefers-reduced-motion: no-preference)', () => {
      const titleWords = hero.querySelectorAll<HTMLElement>('[data-page-hero-word]')
      const supportingCopy = hero.querySelectorAll<HTMLElement>('[data-page-hero-support]')
      const timeline = gsap.timeline()

      if (motion === 'editorial') {
        timeline.from(titleWords, {
          yPercent: 16,
          clipPath: 'inset(0% 0% 100% 0%)',
          duration: 0.65,
          stagger: 0.035,
          ease: 'power3.out',
          clearProps: 'transform,clipPath',
        }).from(supportingCopy, {
          opacity: 0,
          duration: 0.4,
          stagger: 0.045,
          ease: 'power2.out',
          clearProps: 'opacity',
        }, 0.12)
        return
      }

      timeline.from(titleWords, {
        yPercent: 28,
        opacity: 0,
        filter: 'blur(8px)',
        duration: 1.05,
        stagger: 0.028,
        ease: 'power3.out',
        clearProps: 'transform,opacity,filter',
      })

      if (supportingCopy.length > 0) {
        timeline.from(supportingCopy, {
          y: 18,
          opacity: 0,
          filter: 'blur(5px)',
          duration: 0.78,
          stagger: 0.075,
          ease: 'power3.out',
          clearProps: 'transform,opacity,filter',
        }, 0.2)
      }
    })

    return () => animations.revert()
  }, [wordmark, motion])

  return (
    <header ref={heroRef} className="studio-hero" data-variant={variant} data-surface={surface} data-compact={compact} data-background-media={backgroundMedia || undefined} data-nav-surface={surface === 'navy' || surface === 'blue-mid' ? 'ink' : 'frost'}>
      {media && backgroundMedia && <div className="studio-hero-background">{media}</div>}
      {media && backgroundMedia && <div className="studio-hero-scrim" aria-hidden="true" />}
      <div className="studio-width studio-hero-inner">
        {breadcrumb && <nav className="studio-breadcrumb" aria-label={breadcrumbLabel} data-page-hero-support="">{breadcrumb}</nav>}
        {metadata && <div className="studio-meta" data-page-hero-support="">{metadata}</div>}
        <Heading id={titleId} className="studio-title font-serif" aria-label={wordmark}>
          <span aria-hidden="true">
            {words.map((word, index) => (
              <span className="studio-title-word" data-page-hero-word="" key={`${word}-${index}`}>{word}{index < words.length - 1 ? '\u00a0' : ''}</span>
            ))}
          </span>
        </Heading>
        {intro.length > 0 && <div className="studio-intro" data-tagline={introAsTagline} data-page-hero-support="">{intro.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>}
        {children && <div className="studio-hero-children" data-page-hero-support="">{children}</div>}
        {actions && <div className="studio-actions" data-page-hero-support="">{actions}</div>}
        {media && !backgroundMedia && !mediaFullWidth && <div className="studio-hero-media">{media}</div>}
      </div>
      {media && !backgroundMedia && mediaFullWidth && <div className="studio-hero-media" data-full-width="true">{media}</div>}
      <SectionRise surface={nextSurface} />
    </header>
  )
}
