import type { Metadata } from 'next'
import Image from 'next/image'
import { ModularButton } from '@/components/modular-button'
import { Reveal } from '@/components/reveal'
import { SiteFooter } from '@/components/site-footer'
import { PageHero } from '@/components/page-hero'
import { SectionRise } from '@/components/home/section-rise'
import styles from './studio.module.css'

export const metadata: Metadata = {
  title: 'About',
  description: 'Meet the small, multidisciplinary team behind Burgama—an independent creative and marketing studio in Austin, Texas.',
}

const TEAM = [
  {
    name: 'Deniz',
    role: 'Founder',
    description: 'Sets the direction, shapes the strategy, and stays close to every part of the work.',
    image: '/team/deniz.jpg',
    alt: 'Deniz, founder of Burgama',
  },
  {
    name: 'Amanda',
    role: 'Brand & Growth',
    description: 'Connects positioning, campaigns, and digital growth into a clear path forward.',
    image: '/team/amanda.jpg',
    alt: 'Amanda, Brand and Growth at Burgama',
  },
  {
    name: 'Josiah',
    role: 'Design & Direction',
    description: 'Turns strategy into visual systems and digital experiences with a distinct point of view.',
    image: '/team/josiah.jpg',
    alt: 'Josiah, Design and Direction at Burgama',
  },
]

export default function StudioPage() {
  return (
    <div className="studio-page">
      <PageHero variant="centered" wordmark="about burgama: a small team, close to the work." titleId="about-title" intro={['Burgama is a small, multidisciplinary team bringing strategy, design, digital, and growth into one connected practice. We work directly with the people behind every project, from the first question to the final detail.']} nextSurface="blue-slate" />

      <section className="studio-band" data-surface="blue-slate" aria-labelledby="team-title">
        <div className="studio-width">
        <Reveal className={styles.sectionHeading}>
          <h2 id="team-title" className="font-serif">the people in the room make the work.</h2>
        </Reveal>

        <ul className={styles.teamGrid}>
          {TEAM.map((person, index) => (
            <Reveal as="li" className={styles.person} delay={index * 90} key={person.name}>
              <figure className={styles.portrait}>
                <Image
                  src={person.image}
                  alt={person.alt}
                  width={3712}
                  height={4608}
                  sizes="(max-width: 699px) 100vw, (max-width: 999px) 50vw, 33vw"
                />
              </figure>
              <div className={styles.personHeading}>
                <h3 className="font-serif">{person.name}</h3>
                <p>{person.role}</p>
              </div>
              <p className={styles.personDescription}>{person.description}</p>
            </Reveal>
          ))}
        </ul>
        </div>
        <SectionRise surface="navy" direction="left" />
      </section>

      <section className="studio-band" data-surface="navy" aria-labelledby="small-title">
        <div className="studio-width">
        <Reveal className={styles.smallSection}>
          <h2 id="small-title" className="font-serif">
            ideas stay sharper when they do not get passed down a line.
          </h2>
          <p>
            The same people who frame the problem carry the work through strategy, design, build, and growth. No account layer. No handoff to a separate delivery team.
          </p>
        </Reveal>
        <nav className={`studio-actions ${styles.smallActions}`} aria-label="Next steps">
          <ModularButton href="/work">see the work</ModularButton>
          <ModularButton href="#start-a-project">start a project</ModularButton>
        </nav>
        </div>
        <SectionRise surface="powder-deep" />
      </section>

      <SiteFooter />
    </div>
  )
}
