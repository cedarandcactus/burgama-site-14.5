import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '@/components/page-hero'
import { ProjectCard } from '@/components/project-card'
import { SiteFooter } from '@/components/site-footer'
import { featuredProjects, getPublishedProjects } from '@/lib/projects'

export const metadata: Metadata = { title: 'Work', description: 'Selected collaborations in brand, digital, marketing and content from Burgama.' }

export default function WorkPage() {
  const caseStudies = getPublishedProjects('case-study')
  const archive = getPublishedProjects('archive')
  return <>
    <PageHero wordmark="the work." intro={['A few close collaborations. A range of disciplines. A shared belief that the best work connects the whole picture.', 'Explore our featured projects, from the first strategic decision to the details that bring a brand to life.']} />
    <section className="wide portfolio-section" aria-labelledby="work-featured"><h2 id="work-featured" className="collection-title font-serif">featured collaborations</h2><div className="featured-grid">{featuredProjects.map(project => <ProjectCard key={project.id} project={project} />)}</div></section>
    {caseStudies.length > 0 && <section className="wide portfolio-section" aria-labelledby="work-studies"><h2 id="work-studies" className="collection-title font-serif">case studies</h2><div className="featured-grid">{caseStudies.map(project => <ProjectCard key={project.id} project={project} />)}</div></section>}
    {archive.length > 0 && <section className="wide portfolio-section" aria-labelledby="work-archive"><div className="section-intro"><h2 id="work-archive" className="font-serif">from the archive.</h2><p>More work from across the studio.</p></div><div className="archive-list">{archive.map(project => <Link key={project.id} href={`/work/${project.slug}`}><span className="font-serif archive-name">{project.title.toLowerCase()}</span><span>{project.disciplines.join(' / ')}</span><span aria-hidden="true">↗</span></Link>)}</div></section>}
    <SiteFooter />
  </>
}
