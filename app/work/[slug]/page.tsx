import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MediaFrame, ProjectModules } from '@/components/media-module'
import { PageHero } from '@/components/page-hero'
import { SectionRise } from '@/components/home/section-rise'
import { SiteFooter } from '@/components/site-footer'
import Link from '@/components/transition-link'
import { getProject, getPublishedProjects, getRelatedProjects } from '@/lib/projects'

export function generateStaticParams() {
  return getPublishedProjects().map(project => ({ slug: project.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) return { title: 'Work' }
  return { title: project.title, description: project.summary }
}

export default async function WorkDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) notFound()
  const relatedProjects = getRelatedProjects(project)
  const hasFacts = project.services.length > 0 || project.period || project.status

  return (
    <div className="studio-page">
      <article className="portfolio" aria-labelledby="project-title">
        <PageHero wordmark={project.title} titleId="project-title" compact intro={[project.summary]} nextSurface="powder-deep" breadcrumb={
          <ol><li><Link href="/work">Work</Link></li><li aria-hidden="true">/</li><li aria-current="page">{project.title}</li></ol>
        }>
          {hasFacts && <dl className="portfolio-facts">
            {project.services.length > 0 && <div><dt>Services</dt><dd>{project.services.join(', ')}</dd></div>}
            {project.period && <div><dt>Timeline</dt><dd>{project.period}</dd></div>}
            {project.status && <div><dt>Status</dt><dd>{project.status}</dd></div>}
          </dl>}
        </PageHero>
        <div className="studio-band" data-surface="powder-deep">
          <div className="portfolio-story studio-width">
            {project.heroMedia.src && <MediaFrame item={project.heroMedia} className="portfolio-detail-hero" priority />}
            <ProjectModules modules={project.contentModules} />
            {(project.source || project.note || project.credits.length > 0) && <section className="portfolio-source" aria-labelledby="project-notes">
              <h2 id="project-notes">project notes.</h2>
              {project.source && <p><strong>Source:</strong> {project.source}</p>}
              {project.note && <p>{project.note}</p>}
              {project.credits.map(credit => <p key={`${credit.role}-${credit.name}`}><strong>{credit.role}:</strong> {credit.name}</p>)}
            </section>}
            {project.links.length > 0 && <nav className="studio-actions" aria-label="Project links">
              {project.links.map(link => <a href={link.href} className="pill" key={link.href} target="_blank" rel="noreferrer">{link.label}</a>)}
            </nav>}
          </div>
          <SectionRise surface={relatedProjects.length > 0 ? 'navy' : 'powder-deep'} direction="left" />
        </div>
        {relatedProjects.length > 0 && <section className="studio-band" data-surface="navy" aria-labelledby="related-title">
          <div className="studio-width">
            <h2 id="related-title" className="studio-heading">more work.</h2>
            <nav className="portfolio-related-grid" aria-label="More work">
              {relatedProjects.map(related => <Link href={`/work/${related.slug}`} className="portfolio-related-link" key={related.slug}>
                <span>{(related.categories ?? related.disciplines).join(' · ')}</span>
                <h3>{related.title}</h3>
              </Link>)}
            </nav>
          </div>
          <SectionRise surface="powder-deep" />
        </section>}
      </article>
      <SiteFooter enquiryHeading="what could we make together?" />
    </div>
  )
}
