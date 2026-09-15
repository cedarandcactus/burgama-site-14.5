import { ProjectCard } from '@/components/project-card'
import { ModularButton } from '@/components/modular-button'
import { featuredProjects } from '@/lib/projects'

export function ActWork() {
  return (
    <section id="selected-work" className="home-plate featured-plate" data-home-plate data-nav-surface="frost" aria-labelledby="featured-title">
      <div className="section-intro">
        <h2 id="featured-title" className="font-serif">A few good<br />collaborations.</h2>
        <p>Different problems. Same standard: make the work clear, useful, and hard to ignore.</p>
      </div>
      <div className="featured-grid">{featuredProjects.map(project => <ProjectCard key={project.id} project={project} />)}</div>
      <div className="section-outro"><ModularButton href="/work">explore the work</ModularButton></div>
    </section>
  )
}
