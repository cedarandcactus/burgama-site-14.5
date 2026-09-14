import type { Metadata } from 'next'
import { ArrowRight } from 'lucide-react'
import { ProjectCard } from '@/components/project-card'
import { SiteFooter } from '@/components/site-footer'
import Link from '@/components/transition-link'
import { WorkIndex } from '@/components/work-index'
import {
  featuredProjects,
  getPublishedProjects,
} from '@/lib/projects'

export const metadata: Metadata = {
  title: 'Selected Work',
  description: 'Brand, web, content, growth, and production work by Burgama.',
}

export default function WorkPage() {
  const studies = getPublishedProjects('case-study')
  const archive = getPublishedProjects('archive')

  return (
    <>
      <main id="main">
        <header className="portfolio-intro portfolio-width">
          <div className="portfolio-intro-heading">
            <h1 className="font-serif">Selected work.</h1>
            <p>
              Brand, web, content, growth, and production for organizations with
              something worth saying.
            </p>
          </div>
          <nav className="portfolio-jumps" aria-label="Work collections">
            <Link href="#featured" className="pill pill-small">Featured</Link>
            <Link href="#studies" className="pill pill-small">Focused studies</Link>
            <Link href="#archive" className="pill pill-small">Archive</Link>
          </nav>
        </header>

        <section id="featured" className="portfolio-section portfolio-width" aria-labelledby="featured-title">
          <div className="portfolio-section-heading">
            <h2 id="featured-title" className="font-serif">Full systems, built together.</h2>
          </div>
          <div className="portfolio-featured-grid">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </section>

        <section id="studies" className="portfolio-studies" aria-labelledby="studies-title">
          <div className="portfolio-width">
            <div className="portfolio-section-heading">
              <h2 id="studies-title" className="font-serif">Focused studies.</h2>
              <p>Closer looks at a channel, campaign, or problem inside the wider work.</p>
            </div>
            <div className="portfolio-study-grid">
              {studies.map((project) => (
                <Link href={`/work/${project.slug}`} className="portfolio-study" key={project.slug}>
                  <div className="portfolio-study-top">
                    <div className="archive-categories" aria-label="Project categories">
                      {project.disciplines.map((discipline) => (
                        <span key={discipline}>{discipline}</span>
                      ))}
                    </div>
                    <span className="project-link-arrow" aria-hidden="true">
                      <ArrowRight strokeWidth={1.25} />
                    </span>
                  </div>
                  <h3 className="font-serif">{project.title}</h3>
                  <p className="portfolio-study-summary">{project.summary}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section id="archive" className="portfolio-archive portfolio-width" aria-labelledby="archive-title">
          <div className="portfolio-section-heading">
            <h2 id="archive-title" className="font-serif">The wider archive.</h2>
            <p>Filter the published collection by discipline.</p>
          </div>
          <WorkIndex projects={archive} />
        </section>
      </main>
      <SiteFooter work />
    </>
  )
}
