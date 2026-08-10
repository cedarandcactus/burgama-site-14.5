import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AnimatedText } from '@/components/animated-text'
import { MediaFrame, ProjectModules } from '@/components/media-module'
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

  const meta: { label: string; value: string; basis: string }[] = [
    { label: 'Client', value: project.client, basis: '58%' },
    { label: 'Period', value: project.year, basis: '40%' },
    { label: 'Scope', value: project.services.join(', '), basis: '58%' },
    { label: 'Role', value: project.role, basis: '40%' },
    ...(project.collaborators.length
      ? [{ label: 'Collaborators', value: project.collaborators.join(', '), basis: '100%' }]
      : []),
  ]

  return (
    <>
      <article className={`rail mx-auto flex flex-col gap-16 px-module pt-[92px] md:gap-24 md:pt-[140px] ${project.slug === 'wurqly' ? 'wurqly-case-study' : ''}`}>
        {project.slug === 'wurqly' ? (
          <header className="wurqly-hero relative flex min-h-[78svh] items-center justify-center overflow-hidden rounded-module p-4 md:min-h-[680px] md:p-8">
            <video
              src={project.heroMedia.src}
              poster={project.heroMedia.poster}
              muted
              loop
              autoPlay
              playsInline
              preload="metadata"
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
            />
            {project.heroMedia.poster ? (
              <img
                src={project.heroMedia.poster}
                alt=""
                className="absolute inset-0 hidden h-full w-full object-cover motion-reduce:block"
              />
            ) : null}
            <div className="wurqly-hero-wash absolute inset-0" />
            <div className="wurqly-hero-glass relative z-10 flex w-full max-w-4xl flex-col items-center gap-7 rounded-module p-7 text-center md:p-12">
              <AnimatedText as="h1" lines={[project.title]} className="t-display" />
              <AnimatedText lines={project.introCopy} className="t-section max-w-[18ch]" delay={120} />
              <p className="t-body max-w-[54ch] text-pretty">{project.summary}</p>
            </div>
          </header>
        ) : (
          <header className="flex flex-col gap-module">
            <div className="rail mx-auto mb-6 flex flex-col gap-6">
              <AnimatedText as="h1" lines={[project.title]} className="t-display" />
              <AnimatedText lines={project.introCopy} className="t-section" delay={120} />
              <p className="t-body">{project.summary}</p>
            </div>
            <MediaFrame item={project.heroMedia} />
          </header>
        )}

        <section aria-label="Project information" className="flex flex-wrap gap-module">
          {meta.map((row) => (
            <div
              key={row.label}
              style={{ flexBasis: row.basis, flexGrow: 1 }}
              className={`flex min-w-[220px] flex-col gap-2 rounded-module bg-surface-1 p-5 ${project.slug === 'wurqly' ? 'wurqly-bordered-module' : ''}`}
            >
              <span className="t-body">{row.label}</span>
              <span className="t-body">{row.value}</span>
            </div>
          ))}
        </section>

        <ProjectModules modules={project.contentModules} />

        <section aria-label="Outcome and credits" className="flex flex-col gap-module md:flex-row">
          <div className="flex flex-col gap-4 rounded-module bg-surface-2 p-6 md:basis-[44%]">
            <h2 className="t-section">Outcome</h2>
            {project.outcomes.map((outcome) => (
              <p key={outcome} className="t-body">
                {outcome}
              </p>
            ))}
          </div>
          <div className="flex flex-col gap-3 rounded-module bg-surface-1 p-6 md:basis-[54%]">
            <h2 className="t-section">Credits</h2>
            {project.credits.map((credit) => (
              <p key={credit.role} className="t-body">
                {credit.role} — {credit.name}
              </p>
            ))}
            {project.externalUrl ? (
              <a
                href={project.externalUrl}
                target="_blank"
                rel="noreferrer"
                className="t-body mt-2 flex h-control items-center rounded-module bg-surface-3 px-4 transition-colors duration-300 ease-module hover:bg-periwinkle hover:text-navy focus-visible:bg-periwinkle focus-visible:text-navy"
              >
                {project.externalLabel ?? 'Visit the live work'}
              </a>
            ) : null}
          </div>
        </section>

        <Link
          href={`/work/${next.slug}`}
          aria-label={`Next project: ${next.title}`}
          className="flex min-h-[46svh] flex-col justify-between gap-8 rounded-module bg-surface-2 p-6 transition-colors duration-300 ease-module hover:bg-periwinkle hover:text-navy focus-visible:bg-periwinkle focus-visible:text-navy md:p-10"
        >
          <span className="t-ui">Next project</span>
          <span className="flex flex-col gap-4">
            <span className="t-display block">{next.title}</span>
            <span className="t-body block max-w-[42ch]">{next.summary}</span>
          </span>
        </Link>
      </article>

      <SiteFooter />
    </>
  )
}
