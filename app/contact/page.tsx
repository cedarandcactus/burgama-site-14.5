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
      <PageHero wordmark="contact" intro={['Tell us what you are making, what needs to change, and when it matters.']} nextSurface="navy" actions={<Link href="#start-a-project" className="pill">start a project</Link>} />
      <section className="studio-band" data-surface="navy" aria-label="Email the studio">
        <div className="studio-width"><LiquidEmail /></div>
        <SectionRise surface="powder-deep" direction="left" />
      </section>
      <SiteFooter enquiryHeading="let’s talk about your project" />
    </div>
  )
}
