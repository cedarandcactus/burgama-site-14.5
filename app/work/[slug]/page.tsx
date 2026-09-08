import type { Metadata } from 'next'
import Link from '@/components/transition-link'
import { notFound } from 'next/navigation'
import { MediaFrame, ProjectModules } from '@/components/media-module'
import { SiteFooter } from '@/components/site-footer'
import { getProject, getPublishedProjects, getRelatedProjects } from '@/lib/projects'

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
      <nav className="portfolio-breadcrumb" aria-label="Breadcrumb"><Link href="/work">← all work</Link>{parent && <><span aria-hidden="true">/</span><Link href={`/work/${parent.slug}`}>{parent.title}</Link></>}</nav>
      <p className="portfolio-eyebrow">{project.collection === 'case-study' ? 'case study' : project.collection === 'featured' ? 'featured collaboration' : 'from the collection'}</p>
      <h1 className="font-serif text-balance">{project.title}</h1>
      <div className="portfolio-detail-intro"><p className="portfolio-tagline">{project.tagline}</p><div><p>{project.summary}</p><p className="portfolio-scope">{project.services.join(' / ')}</p></div></div>
      {project.status && <p className="portfolio-note">{project.status}</p>}
      {project.period && <p className="portfolio-period">{project.period}</p>}
    </header>

    <article className="portfolio-width portfolio-story">
      {project.heroMedia.src && <div className="portfolio-detail-hero"><MediaFrame item={project.heroMedia} priority /></div>}
      <ProjectModules modules={project.contentModules} />
      {(project.source || project.note || project.credits.length > 0) && <section className="portfolio-source" aria-label="Project notes and attribution">
        {project.source && <div><h2 className="font-serif">sources & context.</h2><p>{project.source}</p></div>}
        {project.note && <p>{project.note}</p>}
        {project.credits.map(credit => <p key={credit.role}>{credit.role}: {credit.name}</p>)}
      </section>}
      {project.links.length > 0 && <nav aria-label="Live project and film links" className="portfolio-external-links">{project.links.map(link => <a key={link.href} className="pill pill-small" href={link.href} target="_blank" rel="noopener noreferrer">{link.label} <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></a>)}</nav>}
    </article>

    <section className="portfolio-width portfolio-related" aria-labelledby="related-title">
      <div className="portfolio-section-heading"><h2 id="related-title" className="font-serif">keep looking.</h2><Link href="/work" className="pill pill-small">back to all work</Link></div>
      <div className="portfolio-related-grid">{related.map(item => <Link key={item.id} href={`/work/${item.slug}`} className="portfolio-related-link"><span>{item.collection === 'case-study' ? 'case study' : item.disciplines.join(' / ')}</span><h3 className="font-serif">{item.title}</h3><span aria-hidden="true">↗</span></Link>)}</div>
    </section>
    <SiteFooter work />
  </div>
}
