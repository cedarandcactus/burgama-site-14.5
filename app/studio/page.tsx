import type { Metadata } from 'next'
import { ModularButton } from '@/components/modular-button'
import { PageHero } from '@/components/page-hero'
import { Reveal } from '@/components/reveal'
import { SiteFooter } from '@/components/site-footer'

export const metadata: Metadata = {
  title: 'Studio',
  description: 'Burgama brings strategy, design, development, and marketing into one senior creative team.',
}

const CAPABILITIES = [
  {
    title: 'Brand systems',
    body: 'Positioning, naming, identity, voice, art direction, and the rules that make the whole thing recognizable.',
  },
  {
    title: 'Web & product',
    body: 'Websites, commerce, and digital tools designed to work hard without becoming hard to run.',
  },
  {
    title: 'Campaigns & content',
    body: 'Photography, production, and flexible creative systems built for more than one launch day.',
  },
  {
    title: 'Ongoing marketing',
    body: 'Search, social, and creative support that keeps the brand moving without turning up the noise.',
  },
]

const PRINCIPLES = [
  {
    title: 'Work with the makers',
    body: 'The people in the room are the people doing the work. Nothing gets diluted in transit.',
  },
  {
    title: 'Find the point',
    body: 'Before we design, we decide what matters. Every choice answers to that.',
  },
  {
    title: 'Build the system',
    body: 'A logo is not a brand. A page is not a website. We make the parts work together.',
  },
  {
    title: 'Stay useful',
    body: 'Launch is a checkpoint, not a vanishing act. We leave clear tools and can keep building.',
  },
]

const APPROACH = [
  {
    title: 'Find the point',
    body: 'Get the right people together. Ask the hard questions. Agree on what the work needs to do before deciding how it should look.',
  },
  {
    title: 'Make the system',
    body: 'Turn the direction into identity, type, layout, motion, code, and content that belong to the same idea.',
  },
  {
    title: 'Put it to work',
    body: 'Launch it, document it, and make sure the people carrying it forward can use it without us in the room.',
  },
]

export default function StudioPage() {
  return (
    <>
      <PageHero
        wordmark="Studio"
        intro={[
          'Some studios sell process. We stay close enough that the work gets better.',
          'Burgama brings strategy, design, development, and marketing into one senior team. No relay race. No account layer. Just direct collaboration from the first question to launch.',
        ]}
      />

      <section aria-label="How we work" className="wide">
        <div className="page-hero-columns">
          {PRINCIPLES.map(item => (
            <div key={item.title}>
              <h2 className="page-hero-column-title">{item.title}</h2>
              <p className="page-hero-column-body">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="wide case">
        <section id="capabilities" aria-labelledby="capabilities-title" className="scroll-mt-28">
          <Reveal className="case-module">
            <h2 id="capabilities-title" className="case-module-title">What we bring to the table.</h2>
            <div className="page-hero-columns columns-bare">
              {CAPABILITIES.map(item => (
                <div key={item.title}>
                  <h3 className="page-hero-column-title">{item.title}</h3>
                  <p className="page-hero-column-body">{item.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        <section id="approach" aria-labelledby="approach-title" className="scroll-mt-28">
          <Reveal className="case-module">
            <h2 id="approach-title" className="case-module-title">How an idea gets out into the world.</h2>
            <div className="case-spec">
              {APPROACH.map(step => (
                <div key={step.title} className="case-spec-row">
                  <span className="case-spec-label">{step.title}</span>
                  <span className="case-spec-value">{step.body}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        <section aria-label="Elsewhere" className="contact-actions">
          <ModularButton href="/work">See the work</ModularButton>
          <ModularButton href="/contact">Start a project</ModularButton>
        </section>
      </div>

      <SiteFooter />
    </>
  )
}
