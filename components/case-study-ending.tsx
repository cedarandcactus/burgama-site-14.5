import { ArrowRight, ArrowUpRight } from 'lucide-react'
import Link from '@/components/transition-link'
import { CardSection } from '@/components/card-section'
import { RevealHeading } from '@/components/reveal-heading'
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
        <span className="pill pill--next" data-cs-reveal="body" aria-hidden="true"><span>next project</span><ArrowRight className="pill__icon" /></span>
        <RevealHeading as="span" text={next.title} className="cs-next__title font-serif" />
      </Link>
    </div>
    <CardSection heading="More work." items={related.map(item => ({ title: item.title, href: `/work/${item.slug}`, image: item.cardImage, alt: item.cardAlt }))} cta={{ label: 'all work', href: '/work' }} />
  </div>
}
