import Link from '@/components/transition-link'
import type { CSSProperties } from 'react'
import type { MediaRatio, Project } from '@/lib/projects'

const fallbackAspectRatios: Record<MediaRatio, number> = {
  wide: 3 / 2,
  landscape: 16 / 9,
  tall: 3 / 4,
  square: 1,
  full: 16 / 10,
}

export type ModuleShape = 'arch' | 'leaf-right' | 'leaf-left' | 'quarter' | 'bulb' | 'capsule' | 'terminal' | 'opposed'
export function ProjectCard({ project, className = '', style }: {
  project: Project; size?: 'feature' | 'medium' | 'wide' | 'compact'; shape?: ModuleShape; className?: string; style?: CSSProperties
}) {
  const media = project.heroMedia
  const aspectRatio = media.width && media.height
    ? media.width / media.height
    : fallbackAspectRatios[media.ratio]
  const intrinsicMediaStyle = {
    '--project-media-aspect': aspectRatio,
    '--project-media-width-viewport': `${(aspectRatio * 72).toFixed(3)}svh`,
    '--project-media-width-cap': `${Math.round(aspectRatio * 680)}px`,
  } as CSSProperties

  return (
    <Link
      href={`/work/${project.slug}`}
      className={`project-tile ${className}`}
      style={{ ...intrinsicMediaStyle, ...style }}
      data-project={project.slug}
      data-media-ratio={media.ratio}
    >
      <div className="project-tile-content">
        {media.src && (
          <div className="project-tile-image">
            <img
              src={media.src}
              alt={media.label}
              width={media.width}
              height={media.height}
              loading="lazy"
              decoding="async"
            />
          </div>
        )}
        <div className="project-tile-caption">
          <div className="project-tile-copy">
            <p className="project-tile-discipline">{project.disciplines.join(' · ')}</p>
            <h3 className="font-serif">{project.title}</h3>
            <p className="project-tile-summary">{project.summary}</p>
          </div>
          <span className="project-link-arrow" aria-hidden="true">↗</span>
        </div>
      </div>
    </Link>
  )
}
