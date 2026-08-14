import { EntryPreferences } from '@/components/entry-preferences'
import { HeroEntrance } from '@/components/hero-entrance'
import { HomepageRailLayout } from '@/components/homepage-rail-layout'
import { featuredProjects } from '@/lib/projects'

export default function HomePage() {
  return (
    <>
      <EntryPreferences />
      <HeroEntrance videoSrc="/video/backlit-prickly-pear.mov" />

      <HomepageRailLayout projects={featuredProjects} />
    </>
  )
}
