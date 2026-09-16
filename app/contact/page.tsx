import type { Metadata } from 'next'
import { PageHero } from '@/components/page-hero'
import { SectionRise } from '@/components/home/section-rise'
import { SiteFooter } from '@/components/site-footer'
import { LiquidEmail } from '@/components/liquid-email'
import Link from '@/components/transition-link'

export const metadata: Metadata = { title: 'Contact', description: 'Start a project with Burgama.' }

export default function ContactPage() {
  return (
    <div className="studio-page studio-contact">
      <PageHero variant="centered" wordmark="Tell us what needs to change. We’ll work out what comes next." intro={['Share a little about your business, the challenge, and any timing you have in mind. An early question is as welcome as a detailed brief.']} nextSurface="navy" actions={<Link href="#start-a-project" className="pill">start a project</Link>} />
      <section className="studio-band" data-surface="navy" aria-label="Email the studio">
        <div className="studio-width"><LiquidEmail /></div>
        <SectionRise surface="powder-deep" direction="left" />
      </section>
      <SiteFooter enquiryHeading="Let’s talk about your project" />
    </div>
  )
}
