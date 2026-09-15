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
        wordmark="contact"
        intro={[
          'Tell us what you are making, what needs to change, and when it matters. We will reply with a straight answer about fit, timing, and next steps.',
        ]}
      />

      <aside className="contact-availability" aria-label="Studio availability">
        <p>Open for new collaborations and brand challenges.</p>
      </aside>

      <div className="wide case">
        <section aria-label="Email the studio">
          <LiquidEmail />
        </section>

        <Reveal as="section" aria-labelledby="include-title" className="case-module contact-prompts">
          <h2 id="include-title" className="case-module-title">what helps us get to the point.</h2>
          <ul className="contact-prompt-list">
            {INCLUDE.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </Reveal>
      </div>

      <SiteFooter />
    </>
  )
}
