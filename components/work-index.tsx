import Link from 'next/link'
import { Reveal } from '@/components/reveal'
import { type Project } from '@/lib/projects'

/**
 * The project list as a ruled index rather than a grid of cards.
 *
 * The reworked direction treats work as an archive: one hairline row per
 * project, numbered, with the disciplines and year set as tiny caps. Hover
 * fills the whole row with ink (see `.artifact-index-row`), so the list reads
 * as a set of plates being pulled rather than as a wall of thumbnails.
 */
export function WorkIndex({ projects }: { projects: Project[] }) {
  return (
    <div className="artifact-index">
      {projects.map((project, index) => (
        <Reveal key={project.id} delay={index * 60}>
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
    </div>
  )
}
