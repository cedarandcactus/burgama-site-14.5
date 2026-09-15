import type { CSSProperties } from 'react'
import { ArrowUpRight } from 'lucide-react'
import Link from '@/components/transition-link'
import type { MediaRatio, Project } from '@/lib/projects'

const aspectRatios: Record<MediaRatio, string> = {
  wide: '16 / 9',
  landscape: '4 / 3',
  tall: '4 / 5',
  square: '1 / 1',
  full: '16 / 10',
}

const widthCaps: Record<MediaRatio, string> = {
  wide: '1180px',
  landscape: '980px',
  tall: '640px',
  square: '760px',
  full: '1180px',
}

export function ProjectCard({
  project,
  showArrow = true,
  concise = false,
  actionLabel,
}: {
  project: Project
  showArrow?: boolean
  concise?: boolean
  actionLabel?: string
}) {
  const media = project.thumbnailMedia ?? project.heroMedia
  const style = {
    '--project-width': media.ratio === 'tall' ? 'min(76vw, 640px)' : 'min(94vw, 1180px)',
    '--project-media-width-viewport': media.ratio === 'tall' ? '76vw' : '94vw',
    '--project-media-width-cap': widthCaps[media.ratio],
    '--project-media-aspect': aspectRatios[media.ratio],
  } as CSSProperties

  return (
    <Link className="project-tile" href={`/work/${project.slug}`} aria-label={concise ? `${project.title} — ${actionLabel ?? 'view project'}` : undefined}>
      <article className="project-tile-content" style={style}>
        {media.src ? (
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
        ) : null}
        <div className="project-tile-caption">
          <div className="project-tile-copy">
            <ul
              className="project-category-pills project-tile-disciplines"
              aria-label="Project categories"
            >
              {(project.categories ?? project.disciplines).map((discipline) => (
                <li key={discipline}>{discipline.toLowerCase()}</li>
              ))}
            </ul>
            <h3 className="project-tile-title">{project.title}</h3>
            {!concise && <p className="project-tile-summary">{project.summary}</p>}
          </div>
          {actionLabel ? (
            <span className="project-link-prompt">{actionLabel}</span>
          ) : showArrow ? (
            <span className="project-link-arrow" aria-hidden="true">
              <ArrowUpRight size={26} strokeWidth={2.5} aria-hidden="true" focusable="false" />
            </span>
          ) : null}
        </div>
      </article>
    </Link>
  )
}
