import Link from 'next/link'
import { ArtifactSlot } from '@/components/artifact-slot'
import { Reveal } from '@/components/reveal'
import type { Project } from '@/lib/projects'

/**
 * The homepage is built as a poster, per LAYOUT INSPO: a ruled masthead of
 * tiny caps labels, one large artifact standing in a lot of air with the
 * title set over it, then small justified copy beneath.
 *
 * Every visual is an artifact slot, so the page composes correctly while the
 * assets are still placeholders. Fill them in `lib/artifacts.ts`.
 */
export function HomeIndex({ projects }: { projects: Project[] }) {
  return (
    <div className="page-artifact">
      <section className="wide poster" aria-labelledby="home-title">
        {/* Masthead: the poster's corner labels, sharing one hairline rule. */}
        <div className="poster-masthead">
          <p className="poster-label">Burgama — Independent studio</p>
          <p className="poster-label poster-label-mid">Austin, Texas</p>
          <p className="poster-label">
            {String(projects.length).padStart(2, '0')} projects
          </p>
        </div>

        {/*
          The artifact stage. The title sits over the object rather than
          above it — in the reference the type is carved out of the stone.
        */}
        <div className="poster-stage">
          <p className="poster-margin poster-margin-left">
            Artifact 01 — awaiting asset
          </p>

          <ArtifactSlot id="home-hero" />

          <h1 id="home-title" className="poster-title poster-title-over">
            Burgama
          </h1>

          <p className="poster-margin poster-margin-right">
            Brand systems · Digital · Production
          </p>
        </div>

        <Reveal>
          <p className="poster-body">
            Burgama is an independent creative studio in Austin, Texas. The work
            begins with a point of view, then becomes a system — identities and
            digital experiences built to move, change and stay recognizable. What
            follows is the record: objects, studies and the projects they became.
          </p>
        </Reveal>
      </section>

      {/* Three specimen slots — the vertical artifact row from the references. */}
      <section className="wide specimen-row" aria-label="Specimens">
        {['home-specimen-a', 'home-specimen-b', 'home-specimen-c'].map((id, index) => (
          <Reveal key={id} delay={index * 90}>
            <ArtifactSlot id={id} />
          </Reveal>
        ))}
      </section>

      {/* The one moving artifact, run wide. */}
      <Reveal as="section" className="wide">
        <ArtifactSlot id="home-motion" />
      </Reveal>

      {/* The index: client, disciplines, year — edge to edge. */}
      <section className="wide" aria-labelledby="home-work-title">
        <div className="poster-masthead">
          <h2 id="home-work-title" className="poster-label">
            Selected work
          </h2>
          <p className="poster-label">Index</p>
        </div>

        <ul className="artifact-index">
          {projects.map((project, index) => (
            <Reveal as="li" key={project.slug} delay={index * 60}>
              <Link href={`/work/${project.slug}`} className="artifact-index-row">
                <span className="artifact-index-num">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="artifact-index-client">{project.client}</span>
                <span className="artifact-index-meta">
                  {project.disciplines.join(' · ')}
                </span>
                <span className="artifact-index-meta artifact-index-year">
                  {project.year}
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </section>
    </div>
  )
}
