import Link from '@/components/transition-link'
import { CategoryCluster } from '@/components/category-cluster'
import { Dingbat } from '@/components/dingbat'
import { Reveal } from '@/components/reveal'
import { type Project } from '@/lib/projects'

/**
 * The project list as an index rather than a grid of cards.
 *
 * Rebuilt to the sanctioned ingredients — dingbat, project name, category
 * cluster — and away from the `01 / title / dot-joined metadata / year /
 * hairline` row, which is the exact structure the rules call out as generic
 * CMS UI. The hairline is gone (see `--rule`), the number is a dingbat glyph,
 * and the disciplines are a tight cluster of category buttons.
 *
 * The year was dropped. It is a CMS field that was being rendered only
 * because it exists: it did not help navigation, understanding or
 * storytelling in a list this short, and removing it lets the client name
 * hold the authority the rules want it to have. It is still on the project
 * record and still shown on the case-study page.
 */
export function WorkIndex({ projects }: { projects: Project[] }) {
  return (
    <div className="artifact-index">
      {projects.map((project, index) => (
        <Reveal key={project.id} delay={index * 60}>
          <Link href={`/work/${project.slug}`} className="artifact-index-row">
            <Dingbat n={index + 1} className="artifact-index-num" />

            <span className="artifact-index-client">{project.client}</span>

            <CategoryCluster items={project.disciplines} />
          </Link>
        </Reveal>
      ))}
    </div>
  )
}
