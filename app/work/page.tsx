import type { Metadata } from 'next'
import { PageHero } from '@/components/page-hero'
import { SectionRise } from '@/components/home/section-rise'
import { ProjectCard } from '@/components/project-card'
import { SiteFooter } from '@/components/site-footer'
import Link from '@/components/transition-link'
import { WorkIndex } from '@/components/work-index'
import { featuredProjects, getPublishedProjects } from '@/lib/projects'

export const metadata: Metadata = {
  title: 'Selected Work',
  description: 'Packaging redesign, photography, branding, websites, and marketing work by Burgama.',
}

export default function WorkPage() {
  const studies = getPublishedProjects('case-study')
  const archive = getPublishedProjects('archive')

  return (
    <div className="studio-page">
      <div className="portfolio">
        <PageHero wordmark="selected work." intro={['Packaging, photography, branding, websites, and marketing for organizations with something worth saying.']} nextSurface="blue-slate" actions={
          <nav className="studio-actions" aria-label="Work collections">
            <Link href="#featured" className="pill">featured</Link>
            <Link href="#studies" className="pill">focused studies</Link>
            <Link href="#archive" className="pill">archive</Link>
          </nav>
        } />
        <section id="featured" className="studio-band" data-surface="blue-slate" aria-labelledby="featured-title">
          <div className="studio-width">
            <h2 id="featured-title" className="studio-heading">full systems, built together.</h2>
            <div className="portfolio-featured-grid">
              {featuredProjects.map(project => <ProjectCard key={project.slug} project={project} showArrow={false} />)}
            </div>
          </div>
          <SectionRise surface="navy" direction="left" />
        </section>
        <section id="studies" className="studio-band" data-surface="navy" aria-labelledby="studies-title">
          <div className="studio-width">
            <h2 id="studies-title" className="studio-heading">focused studies.</h2>
            <div className="portfolio-study-grid">
              {studies.map(project => (
                <Link href={`/work/${project.slug}`} className="portfolio-study" key={project.slug}>
                  <div className="archive-categories" aria-label="Project categories">{(project.categories ?? project.disciplines).map(discipline => <span key={discipline}>{discipline.toLowerCase()}</span>)}</div>
                  <h3>{project.title}</h3>
                  <p>{project.summary}</p>
                </Link>
              ))}
            </div>
          </div>
          <SectionRise surface="powder" />
        </section>
        <section id="archive" className="studio-band" data-surface="powder" aria-labelledby="archive-title">
          <div className="studio-width">
            <h2 id="archive-title" className="studio-heading">the wider archive.</h2>
            <WorkIndex projects={archive} />
          </div>
          <SectionRise surface="powder-deep" direction="left" />
        </section>
      </div>
      <SiteFooter enquiryHeading="what could we make together?" />
    </div>
  )
}
