import { ProjectCard } from '@/components/project-card'
import { ModularButton } from '@/components/modular-button'
import { featuredProjects } from '@/lib/projects'
import { BevelText } from '@/components/bevel-definitions'

export function ActWork() {
  return (
    <section id="selected-work" className="home-plate featured-plate" data-home-plate data-scroll-palette="work" aria-labelledby="featured-title">
      <div className="section-intro">
        <h2 id="featured-title" className="font-serif"><BevelText text={'a few good\ncollaborations.'} /></h2>

      </div>
      <div className="featured-grid">{featuredProjects.map(project => <ProjectCard key={project.id} project={project} />)}</div>
      <div className="section-outro"><ModularButton href="/work">explore the work</ModularButton></div>
    </section>
  )
}
