import Link from 'next/link'
import { AnimatedText } from '@/components/animated-text'
import { EntryPreferences } from '@/components/entry-preferences'
import { HeroEntrance } from '@/components/hero-entrance'
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

      <section aria-labelledby="premise-title" className="premise-bridge">
        <div className="premise-atmosphere">
          <div className="rail mx-auto flex min-h-[100svh] flex-col justify-between gap-16 px-5 pb-16 pt-28 md:px-10 md:pb-20 md:pt-36 min-[900px]:px-14 min-[900px]:pb-24">
            <AnimatedText
              as="h1"
              id="premise-title"
              lines={['Made for', 'what comes next']}
              className="max-w-5xl font-serif text-[clamp(3.25rem,8.5vw,8rem)] leading-[0.84] tracking-[-0.065em]"
            />
            <div className="flex flex-col gap-8 min-[760px]:flex-row min-[760px]:items-end min-[760px]:justify-between">
              <p className="max-w-xl text-base leading-relaxed text-pretty md:text-lg">
                Burgama builds brands, digital experiences, content and growth systems as one connected practice—from the first point of view to every place an audience meets it.
              </p>
              <div className="flex flex-wrap gap-module">
                <Link href="/work" className="premise-link">Selected work</Link>
                <Link href="/contact" className="premise-link">Start a project</Link>
              </div>
            </div>
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
