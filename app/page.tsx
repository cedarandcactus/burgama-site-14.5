import Link from 'next/link'
import { AnimatedText } from '@/components/animated-text'
import { HeroOrigin } from '@/components/hero-origin'
import { ModularButtonGroup } from '@/components/modular-buttons'
import { ProjectCard } from '@/components/project-card'
import { SiteFooter } from '@/components/site-footer'
import { featuredProjects } from '@/lib/projects'

export default function HomePage() {
  const [feature, second, third] = featuredProjects

  return (
    <>
      <HeroOrigin />

      <section aria-labelledby="premise-title" className="px-module py-24 md:py-36">
        <div className="rail mx-auto flex flex-col gap-8 md:mx-0 md:ml-[max(0px,calc(50vw-540px))]">
          <AnimatedText
            as="h1"
            id="premise-title"
            lines={['Made for', 'what comes next']}
            className="t-display"
          />
          <p className="t-body">
            Burgama builds identities and experiences that can move, change and remain
            recognizable. The work begins with a point of view, then becomes a system.
          </p>
          <ModularButtonGroup
            actions={[
              { label: 'Selected work', href: '/work', basis: '44%', tone: 'surface-1' },
              { label: 'Start a project', href: '/contact', basis: '56%', tone: 'surface-2' },
            ]}
          />
        </div>
      </section>

      <section
        aria-labelledby="work-title"
        className="flex flex-col gap-module px-module pb-24 md:pb-36"
      >
        <div className="flex flex-col gap-module md:flex-row md:items-end">
          <AnimatedText
            as="h2"
            id="work-title"
            lines={['Selected work']}
            className="t-title md:basis-[58%]"
          />
          <p className="t-body md:basis-[42%]">
            Five working entries. Each one runs on the same template system, sized by what the
            project needs.
          </p>
        </div>

        <div className="flex flex-col gap-module md:flex-row">
          <ProjectCard project={feature} size="feature" className="md:basis-[58%]" />
          <div className="flex flex-col gap-module md:basis-[42%]">
            <ProjectCard project={second} size="medium" className="flex-1" />
            <ProjectCard project={third} size="medium" className="flex-1" />
          </div>
        </div>

        <Link
          href="/work"
          className="t-section flex h-32 items-end rounded-module bg-surface-2 p-5 transition-colors duration-300 ease-module hover:bg-periwinkle hover:text-navy focus-visible:bg-periwinkle focus-visible:text-navy md:p-7"
        >
          All work
        </Link>
      </section>

      <SiteFooter />
    </>
  )
}
