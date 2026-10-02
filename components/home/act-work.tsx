import { ProjectCard } from '@/components/project-card'
import { ModularButton } from '@/components/modular-button'
import { Reveal } from '@/components/reveal'
import { SectionRise } from '@/components/home/section-rise'
import { featuredProjects } from '@/lib/projects'
import styles from './home-page.module.css'

export function ActWork() {
  return (
    <section id="selected-work" className={styles.selectedWork} data-nav-surface="ink" aria-labelledby="featured-title">
      <div className={styles.workIntro}>
        <Reveal variant="scroll">
          <h2 id="featured-title" className="font-serif">Selected work</h2>
        </Reveal>
        <Reveal className={styles.workAction}>
          <ModularButton href="/work">all our work</ModularButton>
        </Reveal>
      </div>
      <ul className={styles.workGrid} aria-label="Featured projects">
        {featuredProjects.map(project => (
          <li key={project.id} className={styles.workGridItem}>
            <ProjectCard project={project} concise showTagline />
          </li>
        ))}
      </ul>
      <SectionRise surface="blue-slate" direction="left" />
    </section>
  )
}
