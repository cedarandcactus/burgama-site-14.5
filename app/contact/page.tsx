import type { Metadata } from 'next'
import { PageHero } from '@/components/page-hero'
import { Reveal } from '@/components/reveal'
import { SiteFooter } from '@/components/site-footer'
import { LiquidEmail } from '@/components/liquid-email'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Start a project with Burgama.',
}

const INCLUDE = [
  'What you are making',
  'What needs to change',
  'When it matters',
  'Budget range',
  'Who is involved',
]

export default function ContactPage() {
  return (
    <>
      <PageHero
        wordmark="Contact"
        intro={[
          'Have a project in mind? Send the unfinished version.',
          'Tell us what you are making, what needs to change, and when it matters. We will reply with a straight answer about fit, timing, and next steps.',
        ]}
      />

      <div className="wide case">
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

        <Reveal as="section" aria-labelledby="include-title" className="case-module">
          <h2 id="include-title" className="case-module-title">What helps us get to the point.</h2>
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
