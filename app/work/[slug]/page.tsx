import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MediaLayouts, ProjectModules } from '@/components/media-module'
import { CaseStudyMotion } from '@/components/case-study-motion'
import { CaseStudyHero } from '@/components/case-study-hero'
import { CaseStudyEnding } from '@/components/case-study-ending'
import { SiteFooter } from '@/components/site-footer'
import { getProject, getProjectNavigation, getPublishedProjects, getRelatedProjects } from '@/lib/projects'
import { absoluteUrl, breadcrumbJsonLd, JsonLd, primaryImageUrl, siteUrl } from '@/lib/seo'
import { getServicesForLabels } from '@/lib/services'
import Link from '@/components/transition-link'
import './case-study.css'

export function generateStaticParams() {
  return getPublishedProjects().map(project => ({ slug: project.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) return { title: 'Work' }
  const primaryWork = project.services[0] ?? project.disciplines[0]
  const title = `${project.title} | ${primaryWork} | Burgama`
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
  const { next, backHref } = getProjectNavigation(project)
  const relatedServices = getServicesForLabels(project.services)
  const canonicalPath = `/work/${project.slug}`
  const canonicalUrl = absoluteUrl(canonicalPath)
  const projectJsonLd = {
    '@context': 'https://schema.org', '@type': 'CreativeWork', '@id': `${canonicalUrl}#work`,
    name: project.title, url: canonicalUrl, description: project.summary,
    image: primaryImageUrl(project.heroMedia.src), creator: { '@id': `${siteUrl}/#organization` },
  }
  const breadcrumbs = breadcrumbJsonLd([
    { name: 'Home', path: '/' }, { name: 'Work', path: '/work' }, { name: project.title, path: canonicalPath },
  ])
  return <>
    <JsonLd data={projectJsonLd} /><JsonLd data={breadcrumbs} />
    <div className="studio-page cs-page">
      <CaseStudyMotion key={project.slug} slug={project.slug}>
        <CaseStudyHero project={project} backHref={backHref} />
        <div className="cs-story" data-nav-surface="frost">
          {project.heroMedia.src && <div className="cs-hero-media"><MediaLayouts items={[project.heroMedia]} priority /></div>}
          <div className="cs-sections"><ProjectModules modules={project.contentModules} slug={project.slug} /></div>
          {(project.note || project.credits.length > 0 || relatedServices.length > 0) && <aside className="cs-notes" aria-label="Project notes and credits">
            {relatedServices.length > 0 && <p>Related services: {relatedServices.map((service, index) => <span key={service.slug}>{index > 0 && ', '}<Link href={`/services/${service.slug}`}>{service.name}</Link></span>)}</p>}
            {project.note && <p>{project.note}</p>}
            {project.credits.map(credit => <p key={`${credit.role}-${credit.name}`}>{credit.role}: {credit.name}</p>)}
          </aside>}
          <CaseStudyEnding project={project} next={next} related={getRelatedProjects(project)} />
        </div>
      </CaseStudyMotion>
      <SiteFooter enquiryHeading="What could we make together?" />
    </div>
  </>
}
