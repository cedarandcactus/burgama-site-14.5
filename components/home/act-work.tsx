import { CardSection } from '@/components/card-section'
import { featuredProjects } from '@/lib/projects'

export function ActWork() {
  return <CardSection id="selected-work" heading="Selected work." items={featuredProjects.map(project => ({ title: project.title, href: `/work/${project.slug}`, image: project.cardImage, alt: project.cardAlt }))} cta={{ label: 'all work', href: '/work' }} />
}
