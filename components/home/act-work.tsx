import { ProjectCard } from '@/components/project-card'
import { ModularButton } from '@/components/modular-button'
import { featuredProjects } from '@/lib/projects'

export function ActWork() {
  return (
    <section id="selected-work" className="home-plate featured-plate" data-home-plate aria-labelledby="featured-title">
      <div className="section-intro">
        <h2 id="featured-title" className="font-serif">a few good<br />collaborations.</h2>
        <p>Four projects, four different needs. Each presentation uses only the identity, product, or digital work made for that collaboration.</p>
      </div>
      <div className="featured-grid">{featuredProjects.map(project => <ProjectCard key={project.id} project={project} />)}</div>
      <div className="section-outro"><ModularButton href="/work">explore the work</ModularButton></div>
    </section>
  )
}
