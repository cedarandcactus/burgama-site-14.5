import Link from 'next/link'
import type { Project } from '@/lib/projects'

export function HomeEditorial({ projects }: { projects: Project[] }) {
  const work = projects.slice(0, 5)

  return (
    <div className="ed-page">
      <section className="ed-hero" aria-labelledby="ed-hero-title">
        <h1 id="ed-hero-title" className="ed-display">
          Identity systems made for what comes next
        </h1>

        <p className="ed-lede">
          Burgama is a design-led studio in Austin, Texas. We build identities, sites and
          campaigns that can move, change and stay recognizable — a point of view first, then
          the system that carries it.
        </p>

        <div className="ed-actions">
          <Link href="/work" className="ed-button ed-button-solid">
            See the work
          </Link>
          <Link href="/contact" className="ed-button ed-button-quiet">
            Start a project
          </Link>
        </div>
      </section>

      <section className="ed-work" aria-labelledby="ed-work-title">
        <div className="ed-work-head">
          <p className="ed-label">Selected work</p>
          <h2 id="ed-work-title" className="ed-work-title">
            Six years of systems, campaigns and launches
          </h2>
        </div>

        <ul className="ed-list">
          {work.map((project) => (
            <li key={project.slug} className="ed-row">
              <Link href={`/work/${project.slug}`} className="ed-row-link">
                <span className="ed-row-name">{project.client}</span>
                <span className="ed-row-meta">{project.disciplines.join(' · ')}</span>
              </Link>
            </li>
          ))}
        </ul>

        <Link href="/work" className="ed-button ed-button-quiet ed-work-cta">
          All work
        </Link>
      </section>
    </div>
  )
}
