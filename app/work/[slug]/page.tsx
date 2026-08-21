import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MediaFrame, ProjectModules } from '@/components/media-module'
import { PageHero } from '@/components/page-hero'
import { Reveal } from '@/components/reveal'
import { SiteFooter } from '@/components/site-footer'
import { getProject, projects } from '@/lib/projects'

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) return { title: 'Project' }
  return {
    title: project.title,
    description: project.summary,
    openGraph: project.heroMedia.poster
      ? { images: [{ url: project.heroMedia.poster, alt: project.heroMedia.label }] }
      : undefined,
  }
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) notFound()

  const next = getProject(project.nextProjectSlug) ?? projects[0]

  const spec = [
    { label: 'Client', value: project.client },
    { label: 'Period', value: project.year },
    { label: 'Scope', value: project.services.join(', ') },
    { label: 'Role', value: project.role },
    ...(project.collaborators.length
      ? [{ label: 'Collaborators', value: project.collaborators.join(', ') }]
      : []),
  ]

  return (
    <>
      {/*
        The case study opens on the same spread as every other interior page:
        client and year as labels, the intro copy in small caps, the project
        name as the wordmark, and the hero media contained in the ink panel.
      */}
      <PageHero
        eyebrow={`Burgama — ${project.client}`}
        label={project.year}
        wordmark={project.title}
        intro={project.introCopy}
        panel={<MediaFrame item={project.heroMedia} />}
      />

      {/* `case-lead` trims the section's own nav clearance — the spread above
          already provides it. */}
      <article className="wide case case-lead">
        <Reveal as="section" aria-label="Summary" className="case-module">
          <h2 className="case-module-title">Summary</h2>
          <div className="case-module-body">
            <p>{project.summary}</p>
          </div>
        </Reveal>

        <Reveal as="section" aria-label="Project information" className="case-spec">
          {spec.map((row) => (
            <div key={row.label} className="case-spec-row">
              <span className="case-spec-label">{row.label}</span>
              <span className="case-spec-value">{row.value}</span>
            </div>
          ))}
        </Reveal>

        <ProjectModules modules={project.contentModules} />

        <Reveal as="section" aria-label="Outcome" className="case-module">
          <h2 className="case-module-title">Outcome</h2>
          <div className="case-module-body">
            {project.outcomes.map((outcome) => (
              <p key={outcome}>{outcome}</p>
            ))}
          </div>
        </Reveal>

        <Reveal as="section" aria-label="Credits" className="case-module">
          <h2 className="case-module-title">Credits</h2>
          <div className="case-module-body">
            {project.credits.map((credit) => (
              <p key={credit.role}>
                {credit.role} — {credit.name}
              </p>
            ))}
            {project.externalUrl ? (
              <p>
                <a href={project.externalUrl} target="_blank" rel="noreferrer">
                  {project.externalLabel ?? 'Visit the live work'}
                </a>
              </p>
            ) : null}
          </div>
        </Reveal>

        {/*
          The next project is one more row of the same index used on /work, so
          leaving a case study returns you to the archive language.
        */}
        <section aria-label="Next project" className="artifact-index">
          <Link
            href={`/work/${next.slug}`}
            aria-label={`Next project: ${next.title}`}
            className="artifact-index-row"
          >
            <span className="artifact-index-num">Next</span>
            <span className="artifact-index-client">{next.client}</span>
            <span className="artifact-index-meta">{next.disciplines.join(' · ')}</span>
            <span className="artifact-index-meta artifact-index-year">{next.year}</span>
          </Link>
        </section>
      </article>

      <SiteFooter />
    </>
  )
}
