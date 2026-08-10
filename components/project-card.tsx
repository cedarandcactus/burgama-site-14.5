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
      className={`group flex flex-col justify-between overflow-hidden rounded-module p-5 transition-colors duration-300 ease-module md:p-7 ${
        toneClass[project.heroMedia.tone ?? 'surface-1']
      } hover:bg-periwinkle hover:text-navy focus-visible:bg-periwinkle focus-visible:text-navy ${
        HEIGHT[size]
      } ${className}`}
    >
      <span className="t-ui">{project.disciplines.join(' · ')}</span>

      <span className="flex flex-col gap-3">
        <span className={`${TITLE[size]} block`}>{project.title}</span>
        {size !== 'compact' ? (
          <span className="t-body block max-w-[40ch]">{project.summary}</span>
        ) : null}
      </span>
    </Link>
  )
}
