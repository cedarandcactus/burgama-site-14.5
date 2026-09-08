'use client'

import { useState } from 'react'
import Link from '@/components/transition-link'
import type { Discipline, Project } from '@/lib/projects'

type Entry = Pick<Project, 'id' | 'slug' | 'title' | 'disciplines'> & { year?: string; media?: Project['heroMedia'][] }
const filters: (Discipline | 'All')[] = ['All', 'Brand', 'Web', 'Photography', 'Marketing', 'Content', 'Production', 'Growth']
const labels: Record<string, string> = { All: 'all work', Brand: 'branding', Web: 'websites', Photography: 'photography', Marketing: 'marketing', Content: 'content', Production: 'production', Growth: 'search' }

export function WorkIndex({ projects }: { projects: Entry[] }) {
  const [discipline, setDiscipline] = useState<Discipline | 'All'>('All')
  const visible = projects.filter(project => discipline === 'All' || (project.disciplines ?? []).includes(discipline))
  return <div className="portfolio-browser">
    <div role="group" aria-label="Filter work by discipline" className="portfolio-filters">
      {filters.map(filter => <button key={filter} type="button" aria-pressed={discipline === filter} aria-controls="portfolio-results" className="pill pill-small" onClick={() => setDiscipline(filter)}>{labels[filter]}</button>)}
    </div>
    <p className="sr-only" role="status">{visible.length} projects</p>
    <div id="portfolio-results" className="portfolio-library">
      {visible.map(project => <Link key={project.id} href={`/work/${project.slug}`} className="portfolio-library-entry">
        <div className="portfolio-library-copy"><h3 className="font-sans">{project.title.toLowerCase()}</h3>{project.year && <span>{project.year}</span>}</div>
        <ul className="archive-categories" aria-label="Categories">{(project.disciplines ?? []).map(category => <li key={category}>{labels[category] ?? category.toLowerCase()}</li>)}</ul>
        {!!project.media?.length && <div className="archive-thumbnails">{project.media.map(item => <img key={item.src} src={item.src} alt={item.label} loading="lazy" decoding="async" />)}</div>}
      </Link>)}
      {visible.length === 0 && <button type="button" className="pill pill-small" onClick={() => setDiscipline('All')}>show all work</button>}
    </div>
  </div>
}
