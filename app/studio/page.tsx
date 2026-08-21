import type { Metadata } from 'next'
import Link from 'next/link'
import { AnimatedText } from '@/components/animated-text'
import { PageHero } from '@/components/page-hero'
import { SiteFooter } from '@/components/site-footer'

export const metadata: Metadata = {
  title: 'Studio',
  description:
    'Burgama is a design-led creative studio working on identities, digital experiences, campaigns and systems.',
}

const CAPABILITIES = [
  {
    title: 'Brand identity and direction',
    body: 'Marks, type systems, colour, art direction and the guidelines that keep them coherent.',
    basis: '58%',
    tone: 'bg-surface-1',
  },
  {
    title: 'Digital design and development',
    body: 'Sites, product surfaces and design systems, built as reusable components.',
    basis: '40%',
    tone: 'bg-surface-2',
  },
  {
    title: 'Campaigns and content systems',
    body: 'A kit of parts rather than a one-off layout, so every placement holds.',
    basis: '42%',
    tone: 'bg-surface-2',
  },
  {
    title: 'Positioning and creative strategy',
    body: 'The sentence the work answers to, agreed before anything is drawn.',
    basis: '56%',
    tone: 'bg-surface-1',
  },
]

const APPROACH = [
  {
    title: 'Discovery and positioning',
    body: 'We start with a point of view. Placeholder copy describing how the studio arrives at it.',
    basis: '38%',
  },
  {
    title: 'Design and build',
    body: 'The point of view becomes a system: modules, spacing, type and motion.',
    basis: '32%',
  },
  {
    title: 'Launch and support',
    body: 'Handover, documentation and the ongoing work of keeping a system recognisable.',
    basis: '28%',
  },
]

export default function StudioPage() {
  return (
    <>
      <PageHero
        eyebrow="Burgama — Independent studio"
        title="Studio"
        artifactId="studio-hero"
        columns={[
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
        ]}
      />

      <section className="wide pb-16">
        <h1 className="sr-only">Studio</h1>
        <p className="page-hero-column-body max-w-[52ch]">
          Burgama shapes identities and digital experiences for people with something
          meaningful to make, staying close from the first conversation through launch.{' '}
          <Link href="/work" className="inline-action">
            Selected work
          </Link>{' '}
          <Link href="/contact" className="inline-action">
            Start a project
          </Link>
        </p>
      </section>

      <section
        id="capabilities"
        aria-labelledby="capabilities-title"
        className="flex flex-col gap-module px-module pb-16 md:scroll-mt-24"
      >
        <AnimatedText
          as="h2"
          id="capabilities-title"
          lines={['Capabilities']}
          className="t-title rail mx-auto mb-6"
        />
        <div className="rail mx-auto flex flex-wrap gap-module">
          {CAPABILITIES.map((item) => (
            <div
              key={item.title}
              style={{ flexBasis: item.basis, flexGrow: 1 }}
              className={`flex min-h-[220px] min-w-[260px] flex-col justify-between gap-8 rounded-module p-6 ${item.tone}`}
            >
              <h3 className="t-section max-w-[18ch]">{item.title}</h3>
              <p className="t-body max-w-[40ch]">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="approach"
        aria-labelledby="approach-title"
        className="flex flex-col gap-module px-module pb-24 md:scroll-mt-24 md:pb-36"
      >
        <AnimatedText
          as="h2"
          id="approach-title"
          lines={['Approach']}
          className="t-title rail mx-auto mb-6"
        />
        <div className="rail mx-auto flex flex-col gap-module md:flex-row">
          {APPROACH.map((step) => (
            <div
              key={step.title}
              style={{ flexBasis: step.basis }}
              className="flex flex-col gap-4 rounded-module bg-surface-1 p-6"
            >
              <h3 className="t-section">{step.title}</h3>
              <p className="t-body">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </>
  )
}
