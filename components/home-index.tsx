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

      {/*
        Two-column statement block taken from the Eleken reference: heading,
        muted body, small solid action. Sits inside the contained measure
        while the index above it runs full-bleed.
      */}
      <section className="split" aria-labelledby="home-approach-title">
        <div className="split-copy">
          <h2 id="home-approach-title" className="split-title">
            Most studios hand you a deck. We hand you the thing itself.
          </h2>
          <p className="split-body">
            Brand systems and websites for companies that have outgrown their first
            attempt. We work in small, senior teams — no account layer, no handoff
            between the people who plan the work and the people who make it.
          </p>
          <p className="split-body">
            Every engagement starts with the same question: what does this need to do,
            and for whom. The design follows from the answer.
          </p>
          <Link href="/studio" className="action">
            How we work
            <span aria-hidden="true" className="action-arrow">
              &rarr;
            </span>
          </Link>
        </div>

        <dl className="split-facts">
          <div className="split-fact">
            <dt className="split-fact-label">Founded</dt>
            <dd className="split-fact-value">2019, Austin</dd>
          </div>
          <div className="split-fact">
            <dt className="split-fact-label">Practice</dt>
            <dd className="split-fact-value">Brand, digital, editorial</dd>
          </div>
          <div className="split-fact">
            <dt className="split-fact-label">Engagements</dt>
            <dd className="split-fact-value">{projects.length} shipped</dd>
          </div>
        </dl>
      </section>
    </main>
  )
}
