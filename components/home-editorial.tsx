import Link from 'next/link'
import type { Project } from '@/lib/projects'

export function HomeEditorial({ projects }: { projects: Project[] }) {
  const work = projects.slice(0, 5)

  return (
    <div className="section-navy px-module pb-12 pt-28 md:pb-20">
      <div className="rail mx-auto flex flex-col gap-module">
        <section className="pair-invert rounded-module p-5 md:p-8" aria-labelledby="home-title">
          <h1 id="home-title" className="t-title max-w-[28ch]">
            Burgama is an independent creative studio in Austin, Texas.
          </h1>
        </section>

        <div className="flex flex-col gap-module min-[700px]:flex-row">
          <Link
            href="/work"
            className="t-ui flex h-control flex-1 items-center justify-center rounded-module bg-periwinkle px-4 text-navy transition-colors duration-300 ease-module hover:bg-surface-3 hover:text-periwinkle focus-visible:bg-surface-3 focus-visible:text-periwinkle"
          >
            Work
          </Link>
          <Link
            href="/contact"
            className="t-ui flex h-control flex-1 items-center justify-center rounded-module bg-surface-1 px-4 transition-colors duration-300 ease-module hover:bg-periwinkle hover:text-navy focus-visible:bg-periwinkle focus-visible:text-navy"
          >
            Start a project
          </Link>
        </div>

        <section className="flex flex-col gap-module" aria-labelledby="home-work-title">
          <h2 id="home-work-title" className="t-section rounded-module bg-surface-1 p-5">
            Selected work
          </h2>

          <ul className="flex flex-col gap-module">
            {work.map((project) => (
              <li key={project.slug}>
                <Link
                  href={`/work/${project.slug}`}
                  className="flex flex-wrap items-baseline justify-between gap-module rounded-module bg-surface-1 p-5 transition-colors duration-300 ease-module hover:bg-periwinkle hover:text-navy focus-visible:bg-periwinkle focus-visible:text-navy"
                >
                  <span className="t-section">{project.client}</span>
                  <span className="t-ui">{project.disciplines.join(', ')}</span>
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href="/work"
            className="t-ui flex h-control items-center justify-center rounded-module bg-surface-1 px-4 transition-colors duration-300 ease-module hover:bg-periwinkle hover:text-navy focus-visible:bg-periwinkle focus-visible:text-navy"
          >
            View all
          </Link>
        </section>
      </div>
    </div>
  )
}
