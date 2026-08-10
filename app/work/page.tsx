import type { Metadata } from 'next'
import { AnimatedText } from '@/components/animated-text'
import { SiteFooter } from '@/components/site-footer'
import { WorkIndex } from '@/components/work-index'
import { projects } from '@/lib/projects'

export const metadata: Metadata = {
  title: 'Work',
  description:
    'Identities, digital platforms, campaigns, motion and positioning work from Burgama.',
}

export default function WorkPage() {
  return (
    <>
      <section
        aria-labelledby="work-index-title"
        className="flex flex-col gap-module px-module pt-[92px] pb-16 md:pt-[140px]"
      >
        <div className="rail mx-auto mb-6 flex flex-col gap-4">
          <AnimatedText
            as="h1"
            id="work-index-title"
            lines={['Work']}
            className="t-display"
          />
          <p className="t-body">
            The archive runs on one project template. Size and placement carry the hierarchy,
            not labels.
          </p>
        </div>

        <WorkIndex projects={projects} />
      </section>

      <SiteFooter />
    </>
  )
}
