import { ArrowRight, ArrowUpRight } from 'lucide-react'
import Link from '@/components/transition-link'
import { ProjectImage } from '@/components/media-module'
import { SectionRise } from '@/components/home/section-rise'
import type { Project } from '@/lib/projects'

export function CaseStudyEnding({ project, next, related }: { project: Project; next: Project; related: Project[] }) {
  return <div className="cs-ending">
    <div className="cs-ending__project">
      {project.closingLine && <p className="cs-closing" data-cs-reveal="body">{project.closingLine}</p>}
      {project.links.length > 0 && <nav className="cs-actions" aria-label="Project links">
        {project.links.map((link, index) => {
          const external = /^https?:\/\//.test(link.href)
          const Arrow = external ? ArrowUpRight : ArrowRight
          return <a key={link.href} className={`pill ${external ? 'pill--external' : 'pill--next'}`} href={link.href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined} data-cs-reveal="action" data-cs-index={index}>
            <span>{link.label}</span><Arrow className="pill__icon" aria-hidden="true" />
          </a>
        })}
      </nav>}
      <Link className="cs-next" href={`/work/${next.slug}`} rel="next" aria-label={`Next project: ${next.title}`}>
        <span className="pill pill--next" data-cs-reveal="title" aria-hidden="true"><span>next project</span><ArrowRight className="pill__icon" /></span>
        <span className="cs-next__title font-serif" data-cs-reveal="title">{next.title}</span>
        {next.heroMedia.src && <span className="cs-next__frame" data-cs-reveal="media" data-cs-index="1.5"><ProjectImage item={{ ...next.heroMedia, label: '' }} /></span>}
      </Link>
    </div>
    <div className="cs-more-transition"><SectionRise surface="navy" direction="left" /></div>
    <section className="cs-more" data-nav-surface="ink" aria-labelledby="related-title">
      <h2 id="related-title" className="cs-section__title font-serif" data-cs-reveal="title">More work.</h2>
      <nav className="cs-more__grid" aria-label="More work">
        {related.map((item, index) => <Link className="cs-card" href={`/work/${item.slug}`} key={item.slug} data-cs-reveal="card" data-cs-index={index}>
          <span className="cs-card__frame"><ProjectImage item={{ ...item.heroMedia, label: '' }} sizes="(max-width: 640px) 100vw, (max-width: 1200px) 33vw, 400px" /></span>
          <span className="cs-card__title">{item.title}</span>
        </Link>)}
      </nav>
      <SectionRise surface="powder-deep" />
    </section>
    <div className="cs-global-space" aria-hidden="true" />
  </div>
}
