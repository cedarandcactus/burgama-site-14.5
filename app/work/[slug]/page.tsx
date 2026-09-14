import type { Metadata } from 'next'
import Link from '@/components/transition-link'
import { notFound } from 'next/navigation'
import { MediaFrame, ProjectModules } from '@/components/media-module'
import { SiteFooter } from '@/components/site-footer'
import { getProject, getPublishedProjects, getRelatedProjects } from '@/lib/projects'

function sentenceCase(value: string) {
  return value ? `${value[0].toUpperCase()}${value.slice(1)}` : value
}

export const dynamicParams = false
export function generateStaticParams() {
  return getPublishedProjects().map(project => ({ slug: project.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) return { title: 'Project not found', robots: { index: false } }
  return {
    title: project.title,
    description: project.summary,
    openGraph: project.heroMedia.src ? { images: [{ url: project.heroMedia.src, alt: project.heroMedia.label }] } : undefined,
  }
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) notFound()
  const related = getRelatedProjects(project)
  const parent = project.parentSlug ? getProject(project.parentSlug) : undefined

  return <div className="portfolio-detail">
    <header className="portfolio-width portfolio-detail-heading">
      <nav className="portfolio-breadcrumb" aria-label="Breadcrumb">
        <ol>
          <li><Link href="/work">All work</Link></li>
          {parent && <li><span className="portfolio-breadcrumb-separator" aria-hidden="true">/</span><Link href={`/work/${parent.slug}`}>{parent.title}</Link></li>}
          <li><span className="portfolio-breadcrumb-separator" aria-hidden="true">/</span><span aria-current="page">{project.title}</span></li>
        </ol>
      </nav>
      <h1 className="font-serif text-balance">{project.title}</h1>
      <div className="portfolio-detail-intro"><p className="portfolio-tagline">{project.tagline}</p><div><p>{project.summary}</p><p className="portfolio-scope">{project.services.join(' · ')}</p></div></div>
      {(project.status || project.period) && <div className="portfolio-meta">{project.status && <p>{project.status}</p>}{project.period && <p>{project.period}</p>}</div>}
    </header>

    <article className="portfolio-width portfolio-story">
      {project.heroMedia.src && <div className="portfolio-detail-hero"><MediaFrame item={project.heroMedia} priority /></div>}
      <ProjectModules modules={project.contentModules} />
      {(project.source || project.note || project.credits.length > 0) && <section className="portfolio-source" aria-label="Project notes and attribution">
        {project.source && <div><h2 className="font-serif">Sources & context.</h2><p>{project.source}</p></div>}
        {project.note && <p>{project.note}</p>}
        {project.credits.map(credit => <p key={credit.role}>{credit.role}: {credit.name}</p>)}
      </section>}
      {project.links.length > 0 && <nav aria-label="Live project and film links" className="portfolio-external-links">{project.links.map(link => <a key={link.href} className="pill pill-small" href={link.href} target="_blank" rel="noopener noreferrer">{sentenceCase(link.label)}<span className="sr-only"> (opens in a new tab)</span></a>)}</nav>}
    </article>

    <section className="portfolio-width portfolio-related" aria-labelledby="related-title">
      <div className="portfolio-section-heading"><h2 id="related-title" className="font-serif">Keep looking.</h2><Link href="/work" className="pill pill-small">Back to all work</Link></div>
      <div className="portfolio-related-grid">{related.map(item => <Link key={item.id} href={`/work/${item.slug}`} className="portfolio-related-link"><h3 className="font-serif">{item.title}</h3><span aria-hidden="true">↗</span></Link>)}</div>
    </section>
    <SiteFooter work />
  </div>
}
