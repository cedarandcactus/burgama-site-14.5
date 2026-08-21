import { ArtifactSlot } from '@/components/artifact-slot'
import { Reveal } from '@/components/reveal'

/**
 * The interior-page hero, built from NON HOMEPAGE HERO INSPO: two tiny caps
 * labels sharing one hairline rule, a wide artifact beneath them, then a row
 * of short columns.
 *
 * Used by every page except the homepage, which has its own poster hero.
 */
export function PageHero({
  eyebrow,
  title,
  artifactId,
  columns = [],
}: {
  /** Small caps label, top left. */
  eyebrow: string
  /** Small caps label, top right — usually the page name. */
  title: string
  artifactId: string
  /** Short supporting columns set beneath the artifact. */
  columns?: { title: string; body: string }[]
}) {
  return (
    <section className="wide page-hero">
      <div className="poster-masthead">
        <p className="poster-label">{eyebrow}</p>
        <p className="poster-label">{title}</p>
      </div>

      <Reveal className="page-hero-stage">
        <ArtifactSlot id={artifactId} />
      </Reveal>

      {columns.length > 0 ? (
        <div className="page-hero-columns">
          {columns.map((column, index) => (
            <Reveal key={column.title} delay={index * 80}>
              <h2 className="page-hero-column-title">{column.title}</h2>
              <p className="page-hero-column-body">{column.body}</p>
            </Reveal>
          ))}
        </div>
      ) : null}
    </section>
  )
}
