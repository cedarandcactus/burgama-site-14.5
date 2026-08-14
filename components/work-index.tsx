import { ProjectCard, type ModuleShape } from '@/components/project-card'
import { type Project } from '@/lib/projects'

const SHAPES: ModuleShape[] = [
  'arch',
  'leaf-right',
  'leaf-left',
  'quarter',
  'bulb',
  'capsule',
  'terminal',
  'opposed',
]

const RHYTHM = [
  { size: 'feature', basis: '100%' },
  { size: 'medium', basis: '56%' },
  { size: 'medium', basis: '42%' },
  { size: 'wide', basis: '100%' },
  { size: 'compact', basis: '48%' },
  { size: 'compact', basis: '50%' },
] as const

export function WorkIndex({ projects }: { projects: Project[] }) {
  return (
    <div className="rail mx-auto">
      <div className="flex flex-wrap gap-module">
        {projects.map((project, index) => {
          const rhythm = RHYTHM[index % RHYTHM.length]
          return (
            <ProjectCard
              key={project.id}
              project={project}
              size={rhythm.size}
              shape={SHAPES[index % SHAPES.length]}
              className="min-w-[260px]"
              style={{ flexBasis: rhythm.basis, flexGrow: 1 }}
            />
          )
        })}
      </div>
    </div>
  )
}
