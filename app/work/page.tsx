import type { Metadata } from 'next'
import Link from '@/components/transition-link'
import { ProjectCard } from '@/components/project-card'
import { SiteFooter } from '@/components/site-footer'
import { WorkIndex } from '@/components/work-index'
import { featuredProjects, getPublishedProjects } from '@/lib/projects'

export const metadata: Metadata = {
  title: 'Work',
  description: 'Explore Burgama’s portfolio: brand identities, websites, photography, production, and focused marketing case studies.',
}

export default function WorkPage() {
  const studies = getPublishedProjects('case-study')
  const archive = getPublishedProjects('archive')
  return <>
    <header className="portfolio-intro portfolio-width">
      <p className="portfolio-eyebrow">Burgama / portfolio</p>
      <div className="portfolio-intro-heading">
        <h1 className="font-serif">the work.</h1>
        <p>Different businesses. Different beginnings.<br />A shared attention to the whole picture.</p>
      </div>
      <nav className="portfolio-jumps" aria-label="Work collections">
        <a className="pill pill-small" href="#featured-title">featured collaborations</a>
        <a className="pill pill-small" href="#studies-title">case studies</a>
        <a className="pill pill-small" href="#archive-title">more work</a>
      </nav>
    </header>

    <section id="featured" className="portfolio-width portfolio-section" aria-labelledby="featured-title">
      <div className="portfolio-section-heading"><h2 id="featured-title" className="font-serif">close collaborations.</h2><p>Identity, image, and experience.<br />Four projects, seen up close.</p></div>
      <div className="featured-grid portfolio-featured-grid">{featuredProjects.map(project => <ProjectCard key={project.id} project={project} />)}</div>
    </section>

    <section id="case-studies" className="portfolio-studies" aria-labelledby="studies-title">
      <div className="portfolio-width">
        <div className="portfolio-section-heading"><h2 id="studies-title" className="font-serif">a closer look.</h2><p>The brief, the decisions, and what<br />the evidence actually shows.</p></div>
        <div className="portfolio-study-grid">
          {studies.map(study => <Link key={study.id} href={`/work/${study.slug}`} className="portfolio-study">
            <div className="portfolio-study-top"><p>{study.services[0]}</p><span aria-hidden="true" className="project-link-arrow">↗</span></div>
            <h3 className="font-serif">{study.title}</h3>
            <p className="portfolio-study-summary">{study.tagline}</p>
            <span className="portfolio-study-status">{study.status ?? 'Read the case study'}</span>
          </Link>)}
        </div>
      </div>
    </section>

    <section id="more-work" className="portfolio-width portfolio-archive" aria-labelledby="archive-title">
      <div className="portfolio-section-heading"><h2 id="archive-title" className="font-serif">more of the picture.</h2><p>Websites, campaigns, photographs,<br />and the smaller pieces between.</p></div>
      <WorkIndex projects={archive.map(({ id, slug, title, disciplines, heroMedia, summary, services }) => ({ id, slug, title, disciplines, heroMedia, summary, services }))} />
    </section>
    <SiteFooter work />
  </>
}
