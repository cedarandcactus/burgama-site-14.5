import Link from 'next/link'
import { type Project, toneClass } from '@/lib/projects'

type Size = 'feature' | 'medium' | 'wide' | 'compact'
export type ModuleShape =
  | 'arch'
  | 'leaf-right'
  | 'leaf-left'
  | 'quarter'
  | 'bulb'
  | 'capsule'
  | 'terminal'
  | 'opposed'

const HEIGHT: Record<Size, string> = {
  feature: 'min-h-[62svh] md:min-h-[560px]',
  medium: 'min-h-[40svh] md:min-h-[420px]',
  wide: 'min-h-[34svh] md:min-h-[360px]',
  compact: 'min-h-[26svh] md:min-h-[300px]',
}

const TITLE: Record<Size, string> = {
  feature: 't-display',
  medium: 't-title',
  wide: 't-title',
  compact: 't-section',
}

export function ProjectCard({
  project,
  size = 'medium',
  shape = 'opposed',
  className = '',
  style,
}: {
  project: Project
  size?: Size
  shape?: ModuleShape
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <Link
      href={`/work/${project.slug}`}
      style={style}
      className={`sculptural-module shape-${shape} group relative flex flex-col justify-between overflow-hidden p-5 transition-colors duration-300 ease-module md:p-7 ${
        toneClass[project.heroMedia.tone ?? 'surface-1']
      } focus-visible:ring-2 focus-visible:ring-periwinkle ${HEIGHT[size]} ${className}`}
    >
      {project.heroMedia.src ? (
        project.heroMedia.mediaType === 'video' ? (
          <video
            src={project.heroMedia.src}
            poster={project.heroMedia.poster}
            muted
            loop
            autoPlay
            playsInline
            preload="metadata"
            aria-hidden="true"
            className="project-card-parallax absolute inset-x-0 -top-[15%] h-[130%] w-full object-cover transition-[filter] duration-700 ease-module motion-reduce:hidden"
          />
        ) : (
          <img
            src={project.heroMedia.src}
            alt=""
            className="project-card-parallax absolute inset-x-0 -top-[15%] h-[130%] w-full object-cover grayscale transition-[filter] duration-700 ease-module"
          />
        )
      ) : null}
      {project.heroMedia.mediaType === 'video' && project.heroMedia.poster ? (
        <img
          src={project.heroMedia.poster}
          alt=""
          className="project-card-parallax absolute inset-x-0 -top-[15%] hidden h-[130%] w-full object-cover motion-reduce:block"
        />
      ) : null}
      {project.heroMedia.src ? (
        <span className="absolute inset-0 bg-navy/65 transition-colors duration-500 group-hover:bg-navy/52" />
      ) : null}

      <span aria-hidden="true" />

      <span className="relative z-10 flex flex-col gap-3">
        <span className={`${TITLE[size]} block`}>{project.title}</span>
        {size !== 'compact' ? (
          <span className="t-body block max-w-[40ch]">{project.summary}</span>
        ) : null}
      </span>
    </Link>
  )
}
