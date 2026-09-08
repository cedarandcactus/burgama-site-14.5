'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from '@/components/transition-link'
import type { Discipline, Project } from '@/lib/projects'

type Entry = Pick<Project, 'id' | 'slug' | 'title' | 'disciplines' | 'heroMedia' | 'summary' | 'services'>
const filters: (Discipline | 'All')[] = ['All', 'Brand', 'Web', 'Photography', 'Marketing', 'Content', 'Production', 'Growth']
const labels: Record<string, string> = { All: 'all work', Brand: 'branding', Web: 'websites', Photography: 'photography', Marketing: 'marketing', Content: 'content', Production: 'production', Growth: 'search' }

export function WorkIndex({ projects }: { projects: Entry[] }) {
  const [discipline, setDiscipline] = useState<Discipline | 'All'>('All')
  const [query, setQuery] = useState('')
  const visible = projects.filter(project => (discipline === 'All' || project.disciplines.includes(discipline)) && `${project.title} ${project.services.join(' ')}`.toLowerCase().includes(query.trim().toLowerCase()))
  function reset() { setDiscipline('All'); setQuery('') }

  return <div className="portfolio-browser">
    <div role="group" aria-label="Filter work by discipline" className="portfolio-filters">
      {filters.map(filter => <button key={filter} type="button" aria-pressed={discipline === filter} aria-controls="portfolio-results" className="pill pill-small" onClick={() => setDiscipline(filter)}>{labels[filter]}</button>)}
    </div>
    <div className="portfolio-results-toolbar">
      <p role="status" aria-live="polite">{visible.length} {visible.length === 1 ? 'project' : 'projects'}{discipline !== 'All' ? ` / ${labels[discipline]}` : ''}</p>
      <label className="portfolio-search"><span className="sr-only">Search projects by name or service</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search the collection" /></label>
    </div>
    <div id="portfolio-results" className="portfolio-library">
      {visible.map(project => <Link key={project.id} href={`/work/${project.slug}`} className={`portfolio-library-entry ${!project.heroMedia.src ? 'is-text-led' : ''}`}>
        {project.heroMedia.src && <div className="portfolio-library-image"><Image src={project.heroMedia.src} alt={project.heroMedia.label} fill sizes="(min-width: 700px) 180px, 80px" /></div>}
        <div className="portfolio-library-copy"><h3 className="font-serif">{project.title}</h3><p>{project.summary}</p><span>{project.services.join(' / ')}</span></div>
        <span className="project-link-arrow" aria-hidden="true">↗</span>
      </Link>)}
      {visible.length === 0 && <div className="portfolio-empty"><h3 className="font-serif">nothing here just yet.</h3><p>Try another name or discipline to explore the collection.</p><button type="button" className="pill pill-small" onClick={reset}>show all work</button></div>}
    </div>
    {(discipline !== 'All' || query) && visible.length > 0 && <button type="button" className="pill pill-small portfolio-reset" onClick={reset}>reset filters</button>}
  </div>
}
