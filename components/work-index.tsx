'use client'

import { useState } from 'react'
import Link from '@/components/transition-link'
import type { Discipline, Project } from '@/lib/projects'

type Entry = Pick<Project, 'id' | 'slug' | 'title' | 'disciplines' | 'categories'> & { year?: string; media?: Project['heroMedia'][] }
const filters: (Discipline | 'All')[] = ['All', 'Brand', 'Packaging', 'Web', 'Photography', 'Marketing', 'Content', 'Production', 'Growth']
const labels: Record<string, string> = { All: 'all work', Brand: 'brand', Packaging: 'packaging', Web: 'web', Photography: 'photography', Marketing: 'marketing', Content: 'content', Production: 'production', Growth: 'search' }

export function WorkIndex({ projects }: { projects: Entry[] }) {
  const [discipline, setDiscipline] = useState<Discipline | 'All'>('All')
  const visible = projects.filter(project => discipline === 'All' || (project.disciplines ?? []).includes(discipline))
  return <div className="portfolio-browser">
    <div role="group" aria-label="Filter work by discipline" className="portfolio-filters">
      {filters.filter(filter => filter === 'All' || projects.some(project => project.disciplines.includes(filter))).map(filter => <button key={filter} type="button" aria-pressed={discipline === filter} aria-controls="portfolio-results" className="pill pill-small" onClick={() => setDiscipline(filter)}>{labels[filter]}</button>)}
    </div>
    <p className="sr-only" role="status">{visible.length} projects</p>
    <div id="portfolio-results" className="portfolio-library">
      {visible.map(project => <Link key={project.id} href={`/work/${project.slug}`} className="portfolio-library-entry">
        <div className="portfolio-library-copy"><h3 className="font-sans">{project.title}</h3>{project.year && <span>{project.year}</span>}</div>
        <div className="archive-categories" aria-label="Project categories">{(project.categories ?? project.disciplines ?? []).map(category => <span key={category}>{labels[category] ?? category.toLowerCase()}</span>)}</div>
      </Link>)}
      {visible.length === 0 && <button type="button" className="pill pill-small" onClick={() => setDiscipline('All')}>Show all work</button>}
    </div>
  </div>
}
