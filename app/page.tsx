import Link from 'next/link'
import { AnimatedText } from '@/components/animated-text'
import { EntryPreferences } from '@/components/entry-preferences'
import { HeroEntrance } from '@/components/hero-entrance'
import { ModularButtonGroup } from '@/components/modular-buttons'
import { ProjectCard } from '@/components/project-card'
import { SiteFooter } from '@/components/site-footer'
import { SocialPerformanceBand } from '@/components/social-performance-band'
import { featuredProjects } from '@/lib/projects'

export default function HomePage() {
  const [feature, second, third, fourth] = featuredProjects

  return (
    <>
      <EntryPreferences />
      <HeroEntrance videoSrc="/video/backlit-prickly-pear.mov" />

      <section
        aria-labelledby="premise-title"
        className="premise-bridge section-burgundy px-module py-32 md:py-44"
      >
        <div className="rail mx-auto grid gap-module min-[900px]:grid-cols-12">
          <div className="pair-burgundy-invert flex min-h-80 flex-col justify-between rounded-module p-5 md:p-8 min-[900px]:col-span-7 min-[900px]:min-h-[520px]">
            <p className="t-ui">Independent marketing + design studio</p>
            <AnimatedText
              as="h1"
              id="premise-title"
              lines={['Made for', 'what comes next']}
              className="t-display w-full min-[900px]:text-left min-[900px]:text-7xl"
            />
          </div>
          <div className="flex min-h-80 flex-col justify-between rounded-module bg-surface-1 p-5 md:p-8 min-[900px]:col-span-5 min-[900px]:min-h-[520px]">
            <p className="t-body reading-measure max-w-[36ch] text-pretty">
              Burgama builds brands, digital experiences, content and growth systems as one
              connected practice—from the first point of view to every place an audience meets it.
            </p>
            <ModularButtonGroup
              className="premise-actions w-full"
              actions={[
                { label: 'Selected work', href: '/work', basis: '44%', tone: 'periwinkle' },
                { label: 'Start a project', href: '/contact', basis: '56%', tone: 'periwinkle' },
              ]}
            />
          </div>
        </div>
      </section>

      <SocialPerformanceBand />

      <section
        aria-labelledby="work-title"
        className="section-burgundy flex flex-col gap-module px-module py-28 md:py-40"
      >
        <div className="rail mx-auto mb-6 grid gap-4 min-[900px]:grid-cols-12 min-[900px]:items-end">
          <AnimatedText as="h2" id="work-title" lines={['Selected work']} className="t-title min-[900px]:col-span-7 min-[900px]:text-6xl" />
          <p className="t-body reading-measure min-[900px]:col-span-5">
            Curated client stories spanning brand, web, marketing, content, production and
            growth—presented as connected engagements, not isolated deliverables.
          </p>
        </div>

        <div className="rail mx-auto grid w-full gap-module min-[900px]:grid-cols-12">
          <ProjectCard project={feature} size="feature" className="min-[900px]:col-span-7" />
          <ProjectCard project={second} size="feature" className="min-[900px]:col-span-5" />
          <ProjectCard project={third} size="medium" className="min-[900px]:col-span-5" />
          <ProjectCard project={fourth} size="medium" className="min-[900px]:col-span-7" />

          <Link
            href="/work"
            className="t-section pair-burgundy-invert flex h-32 items-end rounded-module p-5 transition-colors duration-300 ease-module hover:bg-surface-1 hover:text-periwinkle focus-visible:bg-surface-1 focus-visible:text-periwinkle md:p-7 min-[900px]:col-span-12"
          >
            All work
          </Link>
        </div>
      </section>

      <SiteFooter />
    </>
  )
}
