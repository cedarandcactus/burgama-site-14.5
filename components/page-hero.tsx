import type { ReactNode } from 'react'
import { ArtifactSlot } from '@/components/artifact-slot'

export function PageHero({ wordmark, intro = [], introAsTagline = false, artifactId, panel, headingLevel: Heading = 'h1' }: {
  wordmark: string; intro?: string[]; introAsTagline?: boolean; artifactId?: string; panel?: ReactNode; headingLevel?: 'h1' | 'h2'
}) {
  const media = panel ?? (artifactId ? <ArtifactSlot id={artifactId} /> : null)
  return <section className="wide editorial-page-hero">
    <div className="editorial-page-heading"><Heading className="font-serif">{wordmark.toLowerCase()}</Heading><div className={introAsTagline ? 'page-intro is-tagline' : 'page-intro'}>{intro.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div></div>
    {media && <div className="editorial-page-media">{media}</div>}
  </section>
}
