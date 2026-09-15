import { ProjectCard } from '@/components/project-card'
import { ModularButton } from '@/components/modular-button'
import { Reveal } from '@/components/reveal'
import { WorkReel } from '@/components/home/work-reel'
import { featuredProjects } from '@/lib/projects'
import styles from './home-page.module.css'

export function ActWork() {
  return (
    <section id="selected-work" className={styles.selectedWork} data-nav-surface="ink" aria-labelledby="featured-title">
      <Reveal className={styles.workIntro}>
        <h2 id="featured-title" className="font-serif">a few things<br />we&apos;ve put into the world.</h2>
      </Reveal>
      <WorkReel count={featuredProjects.length}>
        {featuredProjects.map(project => <ProjectCard key={project.id} project={project} concise />)}
      </WorkReel>
      <div className={styles.workAction}><ModularButton href="/work">all our work</ModularButton></div>
    </section>
  )
}
