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
    description: 'Deniz sets the direction for Burgama and shapes the strategy behind each project. As founder, he stays involved from the first conversation through delivery, keeping the team focused on the problem to solve and the decisions that move the work forward.',
    image: '/team/deniz.jpg',
    alt: 'Deniz, founder of Burgama',
  },
  {
    name: 'Amanda',
    role: 'Brand & Growth',
    description: 'Amanda connects brand positioning with campaigns and digital growth. Her focus is on how a business presents itself, who it needs to reach, and how those choices carry through its marketing. She brings those pieces together into a clear path forward.',
    image: '/team/amanda.jpg',
    alt: 'Amanda, Brand and Growth at Burgama',
  },
  {
    name: 'Josiah',
    role: 'Design & Direction',
    description: 'Josiah translates strategy into visual systems and digital experiences. He shapes the design direction and carries it through the details, connecting how a brand looks with how it works. His role keeps the visual language coherent across the different parts of a project.',
    image: '/team/josiah.jpg',
    alt: 'Josiah, Design and Direction at Burgama',
  },
]

export default function StudioPage() {
  return (
    <div className="studio-page">
      <PageHero variant="centered" wordmark="The people shaping your strategy are the ones bringing it to life." titleId="about-title" intro={['You work directly with a small team across strategy, design, digital, and growth. We make the thinking behind our recommendations clear and stay involved through delivery, so you know who is responsible for the work and why each decision matters.']} nextSurface="blue-slate" />

      <section className="studio-band" data-surface="blue-slate" aria-labelledby="team-title">
        <div className="studio-width">
        <Reveal className={styles.sectionHeading}>
          <h2 id="team-title" className="font-serif">Different disciplines. A shared responsibility for the work.</h2>
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
            Fewer handoffs. More room to get the details right.
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
