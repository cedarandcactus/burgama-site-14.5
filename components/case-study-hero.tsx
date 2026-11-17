import { ArrowLeft } from 'lucide-react'
import Link from '@/components/transition-link'
import { SectionRise } from '@/components/home/section-rise'
import type { Project } from '@/lib/projects'

export function CaseStudyHero({ project, backHref }: { project: Project; backHref: string }) {
  return <div className="cs-opening" data-nav-surface="frost">
    <header className="cs-hero" data-title-length={project.title.length > 28 ? 'long' : 'short'}>
      <Link href={backHref} className="pill pill--back" aria-label="Back to all work">
        <ArrowLeft className="pill__icon" aria-hidden="true" /><span>work</span>
      </Link>
      <h1 id="project-title" className="cs-hero__title font-serif">{project.title}</h1>
      <p className="cs-hero__deck">{project.summary}</p>
      <ul className="cs-hero__tags" aria-label="Services">
        {project.services.map(service => <li className="pill pill--tag" key={service}>{service}</li>)}
      </ul>
      {project.period && <p className="cs-hero__meta"><span>Timeline</span> {project.period}</p>}
    </header>
    <SectionRise surface="white" />
  </div>
}
