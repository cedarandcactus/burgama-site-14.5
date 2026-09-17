import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MediaFrame, ProjectModules } from '@/components/media-module'
import { PageHero } from '@/components/page-hero'
import { SectionRise } from '@/components/home/section-rise'
import { SiteFooter } from '@/components/site-footer'
import Link from '@/components/transition-link'
import { DirectionLink } from '@/components/direction-link'
import { getProject, getProjectNavigation, getPublishedProjects, getRelatedProjects } from '@/lib/projects'
import { absoluteUrl, breadcrumbJsonLd, JsonLd, primaryImageUrl, siteUrl } from '@/lib/seo'

export function generateStaticParams() {
  return getPublishedProjects().map(project => ({ slug: project.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) return { title: 'Work' }
  const primaryWork = project.services[0] ?? project.disciplines[0]
  const title = `${project.title} — ${primaryWork} — Burgama`
  const canonicalPath = `/work/${project.slug}`
  const image = primaryImageUrl(project.heroMedia.src)

  return {
    title: { absolute: title },
    description: project.summary,
    alternates: { canonical: canonicalPath },
    openGraph: { title, description: project.summary, url: canonicalPath, type: 'website', images: [{ url: image, alt: project.heroMedia.label || `${project.title} project by Burgama` }] },
    twitter: { card: 'summary_large_image', images: [image] },
  }
}

export default async function WorkDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) notFound()
  const relatedProjects = getRelatedProjects(project)
  const { previous, next, backHref } = getProjectNavigation(project)
  const hasFacts = project.services.length > 0 || project.period || project.status
  const canonicalPath = `/work/${project.slug}`
  const canonicalUrl = absoluteUrl(canonicalPath)
  const projectJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    '@id': `${canonicalUrl}#work`,
    name: project.title,
    url: canonicalUrl,
    description: project.summary,
    image: primaryImageUrl(project.heroMedia.src),
    creator: { '@id': `${siteUrl}/#organization` },
  }
  const breadcrumbs = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Work', path: '/work' },
    { name: project.title, path: canonicalPath },
  ])

  return (
    <>
      <JsonLd data={projectJsonLd} />
      <JsonLd data={breadcrumbs} />
      <div className="studio-page">
      <article className="portfolio portfolio-detail" aria-labelledby="project-title">
        <PageHero wordmark={project.title} titleId="project-title" compact intro={[project.summary]} nextSurface="white" breadcrumbLabel="Back to work" breadcrumb={
          <DirectionLink href={backHref} direction="left" label="work" />
        }>
          {hasFacts && <dl className="portfolio-facts">
            {project.services.length > 0 && <div><dt>Services</dt><dd>{project.services.join(', ')}</dd></div>}
            {project.period && <div><dt>Timeline</dt><dd>{project.period}</dd></div>}
            {project.status && <div><dt>Status</dt><dd>{project.status}</dd></div>}
          </dl>}
        </PageHero>
        <div className="studio-band" data-surface="white">
          <div className="portfolio-story studio-width">
            {project.heroMedia.src && <MediaFrame item={project.heroMedia} className="portfolio-detail-hero" priority />}
            <ProjectModules modules={project.contentModules} />
            {(project.links.length > 0 || project.source || project.note || project.credits.length > 0) && <footer className="portfolio-project-ending">
              {project.links.length > 0 && <nav className="studio-actions portfolio-project-links" aria-label="Project links">
                {project.links.map(link => <a href={link.href} className="pill" key={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a>)}
              </nav>}
              {(project.source || project.note || project.credits.length > 0) && <aside className="portfolio-footnotes" aria-label="Project sources and credits">
                {project.source && <p><strong>Source:</strong> {project.source}</p>}
                {project.note && <p>{project.note}</p>}
                {project.credits.map(credit => <p key={`${credit.role}-${credit.name}`}><strong>{credit.role}:</strong> {credit.name}</p>)}
              </aside>}
            </footer>}
            {(previous || next) && <nav className="studio-sequence portfolio-sequence" aria-label="Browse projects">
              {previous && <DirectionLink href={`/work/${previous.slug}`} rel="prev" direction="left" eyebrow="previous" label={previous.title} />}
              {next && <DirectionLink href={`/work/${next.slug}`} rel="next" eyebrow="next" label={next.title} />}
            </nav>}
          </div>
          <SectionRise surface={relatedProjects.length > 0 ? 'navy' : 'powder-deep'} direction="left" />
        </div>
        {relatedProjects.length > 0 && <section className="studio-band" data-surface="navy" aria-labelledby="related-title">
          <div className="studio-width">
            <h2 id="related-title" className="studio-heading">More work.</h2>
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
      <SiteFooter enquiryHeading="What could we make together?" />
      </div>
    </>
  )
}
