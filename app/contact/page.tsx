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
        wordmark="Contact"
        artifactId="contact-hero"
        intro={[
          'Tell us what you are making and where it needs to go. One conversation, not a form funnel — write with as much or as little as you have and we will reply with a straight answer about fit.',
          'We take on a small number of projects at a time so that each one gets the studio rather than a queue position. If the timing is wrong we will say so, and point you somewhere useful.',
        ]}
      />

      <div className="wide case">
        {/*
          No "Write to us" label: the email address is the largest thing in
          this section and states its own purpose. The explanatory sentence
          that sat under it is gone too — the hero copy already says it.
        */}
        <section aria-label="Email the studio">
          <LiquidEmail />
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

        {/*
          This heading STAYS. "What you are making / Where it needs to go /
          Timing…" is a list of fragments that means nothing without it —
          it carries information rather than labelling a section.
        */}
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
