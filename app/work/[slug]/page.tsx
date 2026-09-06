import type { Metadata } from 'next'
import Link from '@/components/transition-link'
import { notFound } from 'next/navigation'
import { CategoryCluster } from '@/components/category-cluster'
import { Dingbat } from '@/components/dingbat'
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
    openGraph: project.heroMedia.src
      ? { images: [{ url: project.heroMedia.src, alt: project.heroMedia.label }] }
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
  /* Its position in the archive, so its dingbat matches the /work index. */
  const nextIndex = projects.findIndex((p) => p.id === next.id)

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
    /*
      THE PROJECT'S OWN GROUND.

      One `data-field` on the wrapper is the whole mechanism. Every component
      inside already reads `--field-bg` / `--field-ink` rather than a global
      colour, so the hero, spec rows, media frames, buttons and footer all
      retune themselves — and because `FrostFieldProvider` reads the active
      field's resolved tokens rather than a hardcoded map, the shell and the
      mobile console pick up the same palette with no per-project code.

      `data-field-page` marks this as the element that paints the page ground,
      not just a section within one.
    */
    <div className="project-page" data-field={project.field} data-field-page>
      {/*
        The case study opens on the same spread as every other interior page:
        the intro copy, the project name as the wordmark, and the hero media
        contained in the ink panel. Client and year are NOT repeated as
        labels here — they are already stated as rows in the spec list below.
      */}
      <PageHero
        wordmark={project.title}
        intro={project.introCopy}
        introAsTagline
        panel={project.heroMedia.src ? <MediaFrame item={project.heroMedia} /> : undefined}
      />

      {/* `case-lead` trims the section's own nav clearance — the spread above
          already provides it. */}
      <article className="wide case case-lead">
        {/* The summary is a paragraph, not a titled section. */}
        <Reveal as="section" aria-label="Summary" className="case-module-body">
          <p>{project.summary}</p>
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
          <h2 className="case-module-title">What changed once the work was live</h2>
          <div className="case-module-body">
            {project.outcomes.map((outcome) => (
              <p key={outcome}>{outcome}</p>
            ))}
          </div>
        </Reveal>

        <Reveal as="section" aria-label="Credits" className="case-module">
          <h2 className="case-module-title">The people who made it</h2>
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
            {/*
              Rebuilt to match the /work row exactly, which the comment above
              already claimed but was no longer true: it still had the word
              "Next" in the dingbat slot (now glyph-sized), dot-joined
              disciplines and a year. The dingbat carries this project's real
              position in the archive, so the row is literally the same row.
              "Next project" is still announced via the section and link
              aria-labels, so nothing is lost by dropping the word.
            */}
            <Dingbat n={nextIndex + 1} className="artifact-index-num" />
            <span className="artifact-index-client">{next.client}</span>
            <CategoryCluster items={next.disciplines} />
          </Link>
        </section>
      </article>

      <SiteFooter />
    </div>
  )
}
