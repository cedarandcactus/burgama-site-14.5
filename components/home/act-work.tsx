import { ProjectCard } from '@/components/project-card'
import { ModularButton } from '@/components/modular-button'
import { featuredProjects } from '@/lib/projects'

export function ActWork() {
  return (
    <section id="selected-work" className="home-plate featured-plate" data-home-plate aria-labelledby="featured-title">
      <div className="section-intro">
        <h2 id="featured-title" className="font-serif">a few good<br />collaborations.</h2>
        <p>Different people. Different challenges.<br />The same care from first idea to final detail.</p>
      </div>
      <div className="featured-grid">{featuredProjects.map(project => <ProjectCard key={project.id} project={project} />)}</div>
      <div className="section-outro"><p>A closer look at what we make, and who we make it with.</p><ModularButton href="/work">explore the work</ModularButton></div>
    </section>
  )
}
