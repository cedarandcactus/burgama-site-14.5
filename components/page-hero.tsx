import type { ReactNode } from 'react'
import { ArtifactSlot } from '@/components/artifact-slot'
import { SectionRise } from '@/components/home/section-rise'

type Surface = 'powder' | 'powder-deep' | 'navy' | 'blue-slate' | 'blue-mid'

type PageHeroProps = {
  wordmark: string
  intro?: string[]
  introAsTagline?: boolean
  artifactId?: string
  panel?: ReactNode
  headingLevel?: 'h1' | 'h2'
  titleId?: string
  compact?: boolean
  surface?: Surface
  nextSurface?: Surface
  breadcrumb?: ReactNode
  breadcrumbLabel?: string
  metadata?: ReactNode
  actions?: ReactNode
  children?: ReactNode
}

export function PageHero({ wordmark, intro = [], introAsTagline = false, artifactId, panel, headingLevel: Heading = 'h1', titleId, compact = false, surface = 'powder', nextSurface = 'blue-slate', breadcrumb, breadcrumbLabel = 'Breadcrumb', metadata, actions, children }: PageHeroProps) {
  const media = panel ?? (artifactId ? <ArtifactSlot id={artifactId} /> : null)

  return (
    <header className="studio-hero" data-surface={surface} data-compact={compact} data-nav-surface={surface === 'navy' || surface === 'blue-mid' ? 'ink' : 'frost'}>
      <div className="studio-width studio-hero-inner">
        {breadcrumb && <nav className="studio-breadcrumb" aria-label={breadcrumbLabel}>{breadcrumb}</nav>}
        {metadata && <div className="studio-meta">{metadata}</div>}
        <Heading id={titleId} className="studio-title">{wordmark}</Heading>
        {intro.length > 0 && <div className="studio-intro" data-tagline={introAsTagline}>{intro.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>}
        {children}
        {actions && <div className="studio-actions">{actions}</div>}
        {media && <div className="studio-hero-media">{media}</div>}
      </div>
      <SectionRise surface={nextSurface} />
    </header>
  )
}
