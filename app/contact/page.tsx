import type { Metadata } from 'next'
import { PageHero } from '@/components/page-hero'
import { Reveal } from '@/components/reveal'
import { SiteFooter } from '@/components/site-footer'
import { LiquidEmail } from '@/components/liquid-email'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Start a project with Burgama.',
}

/*
  Previously each item carried a flex `basis` so the cards tiled at uneven
  widths. The ruled column grid handles arrangement now, so these are plain
  strings.
*/
const INCLUDE = [
  'What you are making',
  'Where it needs to go',
  'Timing',
  'Budget range',
  'Who is involved',
]

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Burgama — Start a project"
        title="Contact"
        artifactId="contact-hero"
      />

      <div className="wide case">
        <h1 className="sr-only">Start a project</h1>

        <section aria-label="Email the studio" className="case-module">
          <h2 className="case-module-title">Write to us</h2>
          <div className="case-module-body">
            <LiquidEmail />
            <p>
              One conversation, not a form funnel. Write with as much or as little as you
              have — we will reply with a straight answer about fit.
            </p>
          </div>
        </section>

        <Reveal as="section" aria-label="Location" className="case-spec">
          <div className="case-spec-row">
            <span className="case-spec-label">Studio</span>
            <span className="case-spec-value">Austin, Texas</span>
          </div>
          <div className="case-spec-row">
            <span className="case-spec-label">Availability</span>
            <span className="case-spec-value">Working wherever the project leads</span>
          </div>
        </Reveal>

        <Reveal as="section" aria-labelledby="include-title" className="case-module">
          <h2 id="include-title" className="case-module-title">
            Useful to include
          </h2>
          <div className="case-spec">
            {INCLUDE.map((item) => (
              <div key={item} className="case-spec-row">
                <span className="case-spec-value">{item}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      <SiteFooter />
    </>
  )
}
