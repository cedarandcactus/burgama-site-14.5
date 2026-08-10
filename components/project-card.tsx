import Link from 'next/link'
import { type Project, toneClass } from '@/lib/projects'

type Size = 'feature' | 'medium' | 'wide' | 'compact'

const HEIGHT: Record<Size, string> = {
  feature: 'min-h-[62svh] md:min-h-[76svh]',
  medium: 'min-h-[40svh] md:min-h-[46svh]',
  wide: 'min-h-[34svh] md:min-h-[40svh]',
  compact: 'min-h-[26svh] md:min-h-[30svh]',
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
  className = '',
  style,
}: {
  project: Project
  size?: Size
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <Link
      href={`/work/${project.slug}`}
      style={style}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-module p-5 transition-colors duration-300 ease-module md:p-7 ${
        toneClass[project.heroMedia.tone ?? 'surface-1']
      } focus-visible:ring-2 focus-visible:ring-periwinkle ${HEIGHT[size]} ${className}`}
    >
      {project.heroMedia.src ? (
        <img
          src={project.heroMedia.src}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-module group-hover:scale-[1.025]"
        />
      ) : null}
      {project.heroMedia.src ? (
        <span className="absolute inset-0 bg-navy/65 transition-colors duration-500 group-hover:bg-navy/52" />
      ) : null}

      <span className="relative z-10 flex flex-wrap gap-1.5">
        {project.disciplines.slice(0, 3).map((discipline) => (
          <span
            key={discipline}
            className="rounded-sm bg-periwinkle px-2 py-1 font-sans text-[11px] leading-none text-navy"
          >
            {discipline}
          </span>
        ))}
      </span>

      <span className="relative z-10 flex flex-col gap-3">
        <span className={`${TITLE[size]} block`}>{project.title}</span>
        {size !== 'compact' ? (
          <span className="t-body block max-w-[40ch]">{project.summary}</span>
        ) : null}
      </span>
    </Link>
  )
}
