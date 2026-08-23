import Link from 'next/link'
import { ArtifactSlot } from '@/components/artifact-slot'
import { CategoryCluster } from '@/components/category-cluster'
import { Dingbat } from '@/components/dingbat'
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
      {/*
        The reference is nothing but wordmark, nav, big copy and controls, so
        this section is now exactly that. Removed as "extra":
        - the ruled masthead label row (studio/location/count) — the nav
          already carries the name and the index below states the count,
        - the empty hero artifact slot and its overlaid title, plus the three
          empty specimen slots. All four had no `src` in the registry, so
          they rendered as labelled grey placeholders occupying the middle of
          the page. Their entries stay in `lib/artifacts.ts`, so dropping a
          file in re-enables any of them.
        The `h1` moves onto the copy block so the page keeps one top heading.
      */}
      {/*
        `data-field` opts this section into the adaptive frost: as it passes
        behind the floating nav, FrostFieldProvider retints the material to
        this section's colour family. Sections that don't opt in simply leave
        the resting tint alone.
      */}
      <section className="wide poster" aria-labelledby="home-title" data-field="paper">
        <h1 id="home-title" className="sr-only">
          Burgama — independent creative studio
        </h1>

        <Reveal>
          <p className="poster-body">
            Burgama is an independent creative studio in Austin, Texas. The work
            begins with a point of view, then becomes a system — identities and
            digital experiences built to move, change and stay recognizable. What
            follows is the record: objects, studies and the projects they became.
          </p>
        </Reveal>
      </section>

      {/* The one moving artifact, run wide. */}
      {/*
        No `data-field` here: `Reveal` takes an explicit prop set and would
        silently drop the attribute. The neighbouring sections carry the
        opt-in instead, which is enough for the tint to track the page.
      */}
      <Reveal as="section" className="wide">
        <ArtifactSlot id="home-motion" />
      </Reveal>

      {/*
        The index: client, disciplines, year — edge to edge. The redundant
        "Index" label opposite the heading is gone; one heading names the
        section, and a ruled list of numbered projects is self-evidently an
        index without being told so twice.
      */}
      <section className="wide" aria-labelledby="home-work-title" data-field="paper">
        <div className="poster-masthead">
          {/*
            "Selected work" is named in the rules as a phrase to avoid. This
            is descriptive language that can live on the page as text rather
            than sit above it as a label.
          */}
          <h2 id="home-work-title" className="poster-label">
            A selection of work across different disciplines
          </h2>
        </div>

        <ul className="artifact-index">
          {projects.map((project, index) => (
            <Reveal as="li" key={project.slug} delay={index * 60}>
              {/* Same ingredients as /work — dingbat, name, cluster. */}
              <Link href={`/work/${project.slug}`} className="artifact-index-row">
                <Dingbat n={index + 1} className="artifact-index-num" />
                <span className="artifact-index-client">{project.client}</span>
                <CategoryCluster items={project.disciplines} />
              </Link>
            </Reveal>
          ))}
        </ul>
      </section>
    </div>
  )
}
