import Link from 'next/link'
import type { Project } from '@/lib/projects'

export function HomeIndex({ projects }: { projects: Project[] }) {
  return (
    <main className="page">
      {/* Intro: a left marker against a right-hand statement, per the reference. */}
      <section className="page-intro" aria-labelledby="home-title">
        <p className="page-intro-marker">
          All projects <span className="page-intro-count">{projects.length}</span>
        </p>
        <h1 id="home-title" className="page-intro-statement">
          Burgama is an independent creative studio in Austin, Texas.
        </h1>
      </section>

      {/* The index runs edge to edge: client, disciplines, year. */}
      <section aria-labelledby="home-work-title">
        <h2 id="home-work-title" className="sr-only">
          Selected work
        </h2>

        <ul className="index">
          {projects.map((project) => (
            <li key={project.slug}>
              <Link href={`/work/${project.slug}`} className="index-row">
                <span className="index-client">
                  {project.heroMedia.src?.endsWith('.png') ? (
                    <img
                      src={project.heroMedia.src}
                      alt=""
                      className="index-thumb"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : null}
                  {project.client}
                </span>
                <span className="index-meta">{project.disciplines.join(', ')}</span>
                <span className="index-meta index-meta-end">{project.year}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
