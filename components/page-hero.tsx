import type { ReactNode } from 'react'
import { ArtifactSlot } from '@/components/artifact-slot'
import { Reveal } from '@/components/reveal'

/**
 * The interior-page hero, built from the two-column reference spread.
 *
 * Left column runs top to bottom: dot mark, caps labels, body copy, then an
 * oversized wordmark on the floor. Right column is one ink panel holding the
 * artifact, contained rather than cropped.
 *
 * Every interior page uses this — /work, /studio, /contact and each case
 * study. The homepage keeps its own poster hero.
 */
export function PageHero({
  eyebrow,
  label,
  wordmark,
  intro = [],
  artifactId,
  panel,
  headingLevel: Heading = 'h1',
}: {
  /** Small caps label, first line. */
  eyebrow: string
  /** Small caps label, second line — usually the page or client name. */
  label: string
  /** The large display word. Set as the page heading. */
  wordmark: string
  /** Paragraphs of small caps copy, set above the wordmark. */
  intro?: string[]
  /** Artifact registry id for the panel. Ignored when `panel` is given. */
  artifactId?: string
  /** Custom panel content, for pages whose hero media is not an artifact. */
  panel?: ReactNode
  headingLevel?: 'h1' | 'h2'
}) {
  return (
    <section className="wide spread">
      <div className="spread-left">
        {/* Decorative: three dots, as in the reference. */}
        <div className="spread-dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        <div className="spread-labels">
          <p className="poster-label">{eyebrow}</p>
          <p className="poster-label">{label}</p>
        </div>

        {intro.length > 0 ? (
          <Reveal className="spread-copy">
            {intro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Reveal>
        ) : null}

        <Reveal delay={80}>
          <Heading className="spread-wordmark">{wordmark}</Heading>
        </Reveal>
      </div>

      <Reveal delay={140} className="spread-panel">
        {panel ?? (artifactId ? <ArtifactSlot id={artifactId} /> : null)}
      </Reveal>
    </section>
  )
}
