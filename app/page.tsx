import type { Metadata } from 'next'
import { JsonLd, websiteJsonLd } from '@/lib/seo'
import { ActCapabilities } from '@/components/home/act-capabilities'
import { ActClose } from '@/components/home/act-close'
import { ActOpening } from '@/components/home/act-opening'
import { ActIntroduction } from '@/components/home/act-introduction'
import { ActWork } from '@/components/home/act-work'
import { ActResults } from '@/components/home/act-results'
import { ClientTicker } from '@/components/home/client-ticker'
import { FounderAnnouncement } from '@/components/home/founder-announcement'
import styles from '@/components/home/home-page.module.css'

export const metadata: Metadata = {
  title: { absolute: 'Burgama — Creative & Marketing Studio in Austin' },
  description: 'Burgama is an independent creative and marketing studio in Austin working across brand identity, websites, packaging, content, campaigns, and search.',
  alternates: { canonical: '/' },
}

export default function HomePage() {
  return (
    <>
      <JsonLd data={websiteJsonLd} />
      <FounderAnnouncement />
      <div className={styles.page} data-homepage>
        <ActOpening><ClientTicker /></ActOpening>
        <ActIntroduction />
        <ActCapabilities />
        <ActWork />
        <ActResults />
        <ActClose />
      </div>
    </>
  )
}
