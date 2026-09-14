import Link from '@/components/transition-link'
import type { CSSProperties } from 'react'
import type { Project } from '@/lib/projects'

export type ModuleShape = 'arch' | 'leaf-right' | 'leaf-left' | 'quarter' | 'bulb' | 'capsule' | 'terminal' | 'opposed'
export function ProjectCard({ project, className = '', style }: {
  project: Project; size?: 'feature' | 'medium' | 'wide' | 'compact'; shape?: ModuleShape; className?: string; style?: CSSProperties
}) {
  return (
    <Link href={`/work/${project.slug}`} className={`project-tile ${className}`} style={style} data-project={project.slug} data-media-ratio={project.heroMedia.ratio}>
      {project.heroMedia.src && <div className="project-tile-image"><img src={project.heroMedia.src} alt={project.heroMedia.label} loading="lazy" decoding="async" /></div>}
      <div className="project-tile-caption"><div><h3 className="font-serif">{project.title.toLowerCase()}</h3><ul className="project-category-pills" aria-label="Categories">{project.disciplines.map(discipline => <li key={discipline}>{discipline.toLowerCase()}</li>)}</ul></div><span className="project-link-arrow" aria-hidden="true">↗</span></div>
    </Link>
  )
}
