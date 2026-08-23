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

/* The disciplines, set as a ruled column row beneath the hero spread. */
const DISCIPLINES = [
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
]

export default function WorkPage() {
  return (
    <>
      {/* No `artifactId` — `work-hero` is an empty placeholder slot. */}
      <PageHero
        wordmark="Work"
        intro={[
          /* No longer promises a year — the index stopped rendering that field. */
          'A record of what the studio has made, kept as an archive rather than a showcase. Each entry names the client and the disciplines involved, and opens into the full account of how it was built.',
          'The work spans identity, digital product, content systems and growth. What it has in common is that every piece was made to survive contact with the real world — to be extended by other people, on other surfaces, long after we handed it over.',
        ]}
      />

      {/*
        The four discipline titles ARE the content here — each is a real
        heading with its own copy, not a label decorating a section. So the
        row carries no "Disciplines" title above it; that would be the
        section label the typography system rules out.
      */}
      <section aria-label="Disciplines" className="wide">
        <div className="page-hero-columns">
          {DISCIPLINES.map((item) => (
            <div key={item.title}>
              <h2 className="page-hero-column-title">{item.title}</h2>
              <p className="page-hero-column-body">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-label="Project index" className="wide pt-16 pb-24">
        <WorkIndex projects={projects} />
      </section>

      <SiteFooter />
    </>
  )
}
