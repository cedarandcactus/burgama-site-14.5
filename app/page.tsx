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

      <section
        aria-labelledby="premise-title"
        className="premise-bridge section-burgundy px-module py-32 md:py-44"
      >
        <div className="rail mx-auto grid gap-module min-[900px]:grid-cols-12">
          <div className="pair-burgundy-invert flex min-h-[420px] flex-col justify-between rounded-module p-5 md:p-8 min-[900px]:col-span-8 min-[900px]:min-h-[600px]">
            <div className="flex items-start justify-between gap-6">
              <p className="t-ui max-w-32">Independent marketing + design studio</p>
              <p className="font-mono text-xs uppercase leading-tight tracking-[0.16em] [writing-mode:vertical-rl]">
                Strategy / identity / experience / growth
              </p>
            </div>
            <AnimatedText
              as="h1"
              id="premise-title"
              lines={['Made for', 'what comes next']}
              className="w-full font-serif text-[clamp(3.5rem,8vw,8.5rem)] leading-[0.78] tracking-[-0.075em] min-[900px]:text-left"
            />
          </div>
          <div className="flex min-h-[420px] flex-col justify-between rounded-module bg-surface-1 p-5 md:p-8 min-[900px]:col-span-4 min-[900px]:min-h-[600px]">
            <p className="font-serif text-5xl leading-[0.88] tracking-[-0.06em] min-[900px]:text-6xl">One point of view. Every touchpoint.</p>
            <div className="flex flex-col gap-8">
              <p className="t-body reading-measure max-w-[32ch] text-pretty">
                Burgama builds brands, digital experiences, content and growth systems as one connected practice.
              </p>
              <div className="grid grid-cols-2 gap-module">
                <Link href="/work" className="pair-burgundy-invert t-ui flex min-h-24 items-end rounded-module p-4 transition-transform duration-300 hover:-translate-y-1 focus-visible:-translate-y-1">
                  Selected work
                </Link>
                <Link href="/contact" className="pair-burgundy-invert t-ui flex min-h-24 items-end rounded-module p-4 transition-transform duration-300 hover:-translate-y-1 focus-visible:-translate-y-1">
                  Start a project
                </Link>
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
