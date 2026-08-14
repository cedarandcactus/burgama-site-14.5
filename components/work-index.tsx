'use client'

import { useMemo, useState } from 'react'
import { ProjectCard } from '@/components/project-card'
import { LiquidControl, LiquidGroup } from '@/components/liquid-controls'
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
      <LiquidGroup
        className="mb-6 flex flex-wrap gap-module"
        role="group"
        aria-label="Filter by discipline"
      >
        {options.map((option, index) => {
          const active = option === filter
          return (
            <LiquidControl key={option} delay={index * 24}>
              <button
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(option)}
                className={`liquid-button t-ui h-control px-4 ${active ? 'is-active' : ''}`}
              >
                {option}
              </button>
            </LiquidControl>
          )
        })}
      </LiquidGroup>

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
