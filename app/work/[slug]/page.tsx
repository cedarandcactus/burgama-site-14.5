import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CircularArrowIcon } from '@/components/circular-arrow-icon'
import { MediaFrame, ProjectModules } from '@/components/media-module'
import { SiteFooter } from '@/components/site-footer'
import Link from '@/components/transition-link'
import {
  getProject,
  getPublishedProjects,
  getRelatedProjects,
} from '@/lib/projects'

export function generateStaticParams() {
  return getPublishedProjects().map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = getProject(slug)

  if (!project) return { title: 'Work' }

  return {
    title: project.title,
    description: project.summary,
  }
}

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = getProject(slug)

  if (!project) notFound()

  const relatedProjects = getRelatedProjects(project)

  return (
    <>
      <div>
        <header className="portfolio-detail-heading portfolio-width">
          <nav className="portfolio-breadcrumb" aria-label="Breadcrumb">
            <ol>
              <li><Link href="/work">Work</Link></li>
              <li className="portfolio-breadcrumb-separator" aria-hidden="true">/</li>
              <li aria-current="page">{project.title}</li>
            </ol>
          </nav>

          <h1 className="font-serif">{project.title}</h1>
          <div className="portfolio-detail-intro">
            <p className="portfolio-tagline">{project.tagline}</p>
            <div>
              <p>{project.summary}</p>
              <p className="portfolio-scope">{project.services.join(' · ')}</p>
              <div className="portfolio-meta">
                <span>{project.disciplines.join(' · ')}</span>
                {project.period ? <span>{project.period}</span> : null}
                {project.status ? <span>{project.status}</span> : null}
              </div>
            </div>
          </div>
        </header>

        {project.heroMedia.src ? (
          <div className="portfolio-width">
            <MediaFrame item={project.heroMedia} className="portfolio-detail-hero" priority />
          </div>
        ) : null}

        <div className="portfolio-story portfolio-width">
          <ProjectModules modules={project.contentModules} />

          {project.source || project.note || project.credits.length > 0 ? (
            <section className="portfolio-source" aria-labelledby="project-notes">
              <h2 id="project-notes" className="font-serif">Project notes.</h2>
              {project.source ? <p><strong>Source:</strong> {project.source}</p> : null}
              {project.note ? <p>{project.note}</p> : null}
              {project.credits.map((credit) => (
                <p key={`${credit.role}-${credit.name}`}>
                  <strong>{credit.role}:</strong> {credit.name}
                </p>
              ))}
            </section>
          ) : null}

          {project.links.length > 0 ? (
            <nav className="portfolio-external-links" aria-label="Project links">
              {project.links.map((link) => (
                <a href={link.href} className="pill pill-small" key={link.href} target="_blank" rel="noreferrer">
                  {link.label}
                </a>
              ))}
            </nav>
          ) : null}
        </div>

        {relatedProjects.length > 0 ? (
          <section className="portfolio-related portfolio-width" aria-labelledby="related-title">
            <div className="portfolio-section-heading">
              <h2 id="related-title" className="font-serif">More work.</h2>
            </div>
            <nav className="portfolio-related-grid" aria-label="More work">
              {relatedProjects.map((related) => (
                <Link href={`/work/${related.slug}`} className="portfolio-related-link" key={related.slug}>
                  <span>{related.disciplines.join(' · ')}</span>
                  <h3 className="font-serif">{related.title}</h3>
                  <span aria-hidden="true">
                    <CircularArrowIcon />
                  </span>
                </Link>
              ))}
            </nav>
          </section>
        ) : null}
      </div>
      <SiteFooter work />
    </>
  )
}
