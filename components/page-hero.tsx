import type { ReactNode } from 'react'
import { ArtifactSlot } from '@/components/artifact-slot'
import { Reveal } from '@/components/reveal'

/**
 * The interior-page hero, built from the two-column reference spread.
 *
 * Left column runs top to bottom: dot mark, body copy, then an oversized
 * wordmark on the floor. Right column is one ink panel holding the artifact,
 * contained rather than cropped.
 *
 * There is deliberately NO eyebrow or label above the wordmark. Per the
 * typography system the page carries only display, body, and small utility
 * text that is functionally necessary — and a caps "Studio" label sitting
 * above a giant "Studio" wordmark is the redundant subtitle that rule names.
 * The page title lives in one place: the wordmark.
 *
 * Every interior page uses this — /work, /studio, /contact and each case
 * study. The homepage keeps its own poster hero.
 */
export function PageHero({
  wordmark,
  intro = [],
  introAsTagline = false,
  artifactId,
  panel,
  headingLevel: Heading = 'h1',
}: {
  /** The large display word. Set as the page heading. */
  wordmark: string
  /** Paragraphs of body copy, set above the wordmark. */
  intro?: string[]
  /**
   * Set `true` when `intro` is a short display tagline rather than prose.
   * Project intros are two-line statements ("One workforce. / Every side of
   * the work.") — setting those as tiny tracked caps read as a caption, not
   * as the line the project is about.
   */
  introAsTagline?: boolean
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

        {intro.length > 0 ? (
          <Reveal className={introAsTagline ? 'spread-tagline' : 'spread-copy'}>
            {intro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Reveal>
        ) : null}

        {/*
          `spread-wordmark-anchor` goes on the Reveal wrapper, not the heading.
          The wrapper is the flex child of `.spread-left`, so it is the only
          element whose `margin-top: auto` can push to the column floor —
          measured, an auto margin on the heading inside this block wrapper
          did nothing at all.
        */}
        <Reveal delay={80} className="spread-wordmark-anchor">
          <Heading className="spread-wordmark">{wordmark}</Heading>
        </Reveal>
      </div>

      <Reveal delay={140} className="spread-panel">
        {panel ?? (artifactId ? <ArtifactSlot id={artifactId} /> : null)}
      </Reveal>
    </section>
  )
}
