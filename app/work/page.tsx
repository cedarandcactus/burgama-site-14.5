import type { Metadata } from 'next'
import { PageHero } from '@/components/page-hero'
import { SiteFooter } from '@/components/site-footer'
import { WorkIndex } from '@/components/work-index'
import { projects } from '@/lib/projects'

export const metadata: Metadata = {
  title: 'Work',
  description:
    'Selected brand, web, marketing, content, production and growth work from Burgama.',
}

export default function WorkPage() {
  return (
    <>
      <PageHero
        eyebrow="Burgama — Selected work"
        title="Work"
        artifactId="work-hero"
        columns={[
          {
            title: 'Brand',
            body: 'Marks, type systems, colour and the guidelines that keep them coherent.',
          },
          {
            title: 'Digital',
            body: 'Sites, product surfaces and design systems built as reusable components.',
          },
          {
            title: 'Content',
            body: 'A kit of parts rather than a one-off layout, so every placement holds.',
          },
          {
            title: 'Growth',
            body: 'Search, social and the ongoing work of keeping a system recognizable.',
          },
        ]}
      />

      <section aria-labelledby="work-index-title" className="wide pb-24">
        <h1 id="work-index-title" className="sr-only">
          Work
        </h1>
        <WorkIndex projects={projects} />
      </section>

      <SiteFooter />
    </>
  )
}
