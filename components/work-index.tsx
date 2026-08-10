'use client'

import { useMemo, useState } from 'react'
import { ProjectCard } from '@/components/project-card'
import { type Discipline, disciplines, type Project } from '@/lib/projects'

const RHYTHM = [
  { size: 'feature', basis: '100%' },
  { size: 'medium', basis: '56%' },
  { size: 'medium', basis: '42%' },
  { size: 'wide', basis: '100%' },
  { size: 'compact', basis: '48%' },
  { size: 'compact', basis: '50%' },
] as const

export function WorkIndex({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Discipline | 'All'>('All')

  const visible = useMemo(
    () =>
      filter === 'All'
        ? projects
        : projects.filter((project) => project.disciplines.includes(filter)),
    [filter, projects],
  )

  const options: (Discipline | 'All')[] = ['All', ...disciplines]

  return (
    <div className="rail mx-auto flex flex-col gap-module">
      <div
        className="mb-6 flex flex-wrap gap-module"
        role="group"
        aria-label="Filter by discipline"
      >
        {options.map((option) => {
          const active = option === filter
          return (
            <button
              key={option}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(option)}
              className={`t-ui h-control rounded-module px-4 transition-colors duration-300 ease-module hover:bg-periwinkle hover:text-navy focus-visible:bg-periwinkle focus-visible:text-navy ${
                active ? 'bg-periwinkle text-navy' : 'bg-surface-1 text-foreground'
              }`}
            >
              {option}
            </button>
          )
        })}
      </div>

      <div className="flex flex-wrap gap-module">
        {visible.map((project, index) => {
          const rhythm = RHYTHM[index % RHYTHM.length]
          return (
            <ProjectCard
              key={project.id}
              project={project}
              size={rhythm.size}
              className="min-w-[260px]"
              style={{ flexBasis: rhythm.basis, flexGrow: 1 }}
            />
          )
        })}
      </div>

      {visible.length === 0 ? (
        <p className="t-body rounded-module bg-surface-1 p-6">
          No projects in this discipline yet.
        </p>
      ) : null}
    </div>
  )
}
