import type { Metadata } from 'next'
import { AnimatedText } from '@/components/animated-text'
import { PageHero } from '@/components/page-hero'
import { SiteFooter } from '@/components/site-footer'
import { LiquidEmail } from '@/components/liquid-email'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Start a project with Burgama.',
}

const INCLUDE = [
  { label: 'What you are making', basis: '54%' },
  { label: 'Where it needs to go', basis: '44%' },
  { label: 'Timing', basis: '38%' },
  { label: 'Budget range', basis: '32%' },
  { label: 'Who is involved', basis: '28%' },
]

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Burgama — Start a project"
        title="Contact"
        artifactId="contact-hero"
      />

      <section className="wide flex flex-col gap-module pb-16">
        <h1 className="sr-only">Start a project</h1>

        <div className="flex flex-col gap-module md:flex-row">
          <div className="md:basis-[58%]">
            <LiquidEmail />
          </div>

          <div className="flex flex-col gap-module md:basis-[40%]">
            <p className="t-body flex-1 rounded-module bg-surface-2 p-6">
              One conversation, not a form funnel. Write with as much or as little as you have —
              we will reply with a straight answer about fit.
            </p>
            <p className="t-body rounded-module bg-surface-2 p-6">
              Austin, Texas
              <span className="t-ui mt-2 block">Working wherever the project leads</span>
            </p>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="include-title"
        className="flex flex-col gap-module px-module pb-24 md:pb-36"
      >
        <AnimatedText
          as="h2"
          id="include-title"
          lines={['Useful to include']}
          className="t-title rail mx-auto mb-6"
        />
        <div className="rail mx-auto flex flex-wrap gap-module">
          {INCLUDE.map((item) => (
            <p
              key={item.label}
              style={{ flexBasis: item.basis, flexGrow: 1 }}
              className="t-body flex h-24 min-w-[200px] items-end rounded-module bg-surface-1 p-5"
            >
              {item.label}
            </p>
          ))}
        </div>
      </section>

      <SiteFooter />
    </>
  )
}
