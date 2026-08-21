import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '@/components/page-hero'
import { Reveal } from '@/components/reveal'
import { SiteFooter } from '@/components/site-footer'

export const metadata: Metadata = {
  title: 'Studio',
  description:
    'Burgama is a design-led creative studio working on identities, digital experiences, campaigns and systems.',
}

/*
  Capabilities and approach carry no per-item `basis`/`tone` any more. Those
  fields existed to size and fill the old sculptural cards; in the archive
  language the grid and the rules do that work, so the data is just content.
*/
const CAPABILITIES = [
  {
    title: 'Brand identity and direction',
    body: 'Marks, type systems, colour, art direction and the guidelines that keep them coherent.',
  },
  {
    title: 'Digital design and development',
    body: 'Sites, product surfaces and design systems, built as reusable components.',
  },
  {
    title: 'Campaigns and content systems',
    body: 'A kit of parts rather than a one-off layout, so every placement holds.',
  },
  {
    title: 'Positioning and creative strategy',
    body: 'The sentence the work answers to, agreed before anything is drawn.',
  },
]

/* The four short principles, set as a ruled column row beneath the hero. */
const PRINCIPLES = [
  {
    title: 'Close collaboration',
    body: 'Small, senior teams. No account layer between planning the work and making it.',
  },
  {
    title: 'A point of view first',
    body: 'The sentence the work answers to, agreed before anything is drawn.',
  },
  {
    title: 'Systems, not one-offs',
    body: 'Every engagement leaves behind something reusable and documented.',
  },
  {
    title: 'Austin, Texas',
    body: 'Working wherever the project leads.',
  },
]

const APPROACH = [
  {
    title: 'Discovery and positioning',
    body: 'We start with a point of view. Placeholder copy describing how the studio arrives at it.',
  },
  {
    title: 'Design and build',
    body: 'The point of view becomes a system: modules, spacing, type and motion.',
  },
  {
    title: 'Launch and support',
    body: 'Handover, documentation and the ongoing work of keeping a system recognisable.',
  },
]

export default function StudioPage() {
  return (
    <>
      <PageHero
        eyebrow="Burgama — Independent studio"
        label="Studio"
        wordmark="Studio"
        artifactId="studio-hero"
        intro={[
          'Burgama shapes identities and digital experiences for people with something meaningful to make, staying close from the first conversation through launch.',
          'We work in small senior teams with no account layer between planning the work and making it. Every engagement starts from a point of view — the sentence the work answers to — and ends with a system somebody else can carry forward.',
        ]}
      />

      <section aria-label="How we work" className="wide">
        <div className="page-hero-columns">
          {PRINCIPLES.map((item) => (
            <div key={item.title}>
              <h2 className="page-hero-column-title">{item.title}</h2>
              <p className="page-hero-column-body">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="wide case">
        <section aria-label="Elsewhere" className="case-module">
          <h2 className="case-module-title">Elsewhere</h2>
          <div className="case-module-body">
            <p>
              <Link href="/work">Selected work</Link> ·{' '}
              <Link href="/contact">Start a project</Link>
            </p>
          </div>
        </section>

        {/*
          The anchor id sits on this plain section, NOT on the Reveal inside it.
          Reveal starts its child translated down, so the browser scrolled to
          that pre-animation position and the element then settled upward,
          leaving the heading above the viewport. An untransformed target keeps
          /studio#capabilities landing correctly.
        */}
        <section
          id="capabilities"
          aria-labelledby="capabilities-title"
          className="scroll-mt-28"
        >
          <Reveal className="case-module">
            <h2 id="capabilities-title" className="case-module-title">
              Capabilities
            </h2>
            <div className="page-hero-columns columns-bare">
              {CAPABILITIES.map((item) => (
                <div key={item.title}>
                  <h3 className="page-hero-column-title">{item.title}</h3>
                  <p className="page-hero-column-body">{item.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        {/*
          The approach is a sequence, so it reads as ruled rows — the same spec
          list used on a case study — rather than as a row of equal cards.
        */}
        <section id="approach" aria-labelledby="approach-title" className="scroll-mt-28">
          <Reveal className="case-module">
            <h2 id="approach-title" className="case-module-title">
              Approach
            </h2>
            <div className="case-spec">
              {APPROACH.map((step) => (
                <div key={step.title} className="case-spec-row">
                  <span className="case-spec-label">{step.title}</span>
                  <span className="case-spec-value">{step.body}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </section>
      </div>

      <SiteFooter />
    </>
  )
}
