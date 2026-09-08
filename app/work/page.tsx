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
      <div className="portfolio-intro-heading"><h1 className="font-serif">the work.</h1></div>
    </header>
    <section id="featured" className="portfolio-width portfolio-section" aria-label="Featured collaborations">
      <div className="featured-grid portfolio-featured-grid">{featuredProjects.map(project => <ProjectCard key={project.id} project={project} />)}</div>
    </section>
    <section id="case-studies" className="portfolio-studies" aria-labelledby="studies-title">
      <div className="portfolio-width">
        <div className="portfolio-section-heading"><h2 id="studies-title" className="font-serif">case studies.</h2></div>
        <div className="portfolio-study-grid">
          {studies.map(study => <Link key={study.id} href={`/work/${study.slug}`} className="portfolio-study">
            <h3 className="font-serif">{study.title.toLowerCase()}</h3>
            <ul className="project-category-pills" aria-label="Categories">{study.disciplines.map(discipline => <li key={discipline}>{discipline.toLowerCase()}</li>)}</ul>
          </Link>)}
        </div>
      </div>
    </section>
    <section id="more-work" className="portfolio-width portfolio-archive" aria-labelledby="archive-title">
      <div className="portfolio-section-heading"><h2 id="archive-title" className="font-serif">archive of work.</h2></div>
      <WorkIndex projects={archive.map(({ id, slug, title, disciplines, period, heroMedia, contentModules }) => {
        const media = [heroMedia, ...contentModules.flatMap(module => {
          if (module.type === 'media' || module.type === 'mediaSplit') return [module.item]
          if (module.type === 'mediaPair' || module.type === 'mediaGrid') return module.items
          return []
        })].filter((item, index, items) => item.src && items.findIndex(other => other.src === item.src) === index).slice(0, 4)
        return { id, slug, title, disciplines, year: period?.match(/\b(?:19|20)\d{2}\b/g)?.filter((year, index, years) => years.indexOf(year) === index).join('–'), media }
      })} />
    </section>
    <SiteFooter work />
  </>
}
