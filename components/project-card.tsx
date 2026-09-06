import Link from 'next/link'
import Image from 'next/image'
import type { CSSProperties } from 'react'
import type { Project } from '@/lib/projects'

export type ModuleShape = 'arch' | 'leaf-right' | 'leaf-left' | 'quarter' | 'bulb' | 'capsule' | 'terminal' | 'opposed'
export function ProjectCard({ project, className = '', style }: {
  project: Project; size?: 'feature' | 'medium' | 'wide' | 'compact'; shape?: ModuleShape; className?: string; style?: CSSProperties
}) {
  return (
    <Link href={`/work/${project.slug}`} className={`project-tile ${className}`} style={style}>
      {project.heroMedia.src && <div className="project-tile-image"><Image src={project.heroMedia.src} alt={project.heroMedia.label} fill sizes="(min-width: 700px) 46vw, 92vw" /></div>}
      <div className="project-tile-caption"><div><h3 className="font-serif">{project.title.toLowerCase()}</h3><p>{project.disciplines.join(' / ')}</p></div><span className="project-link-arrow" aria-hidden="true">↗</span></div>
    </Link>
  )
}
