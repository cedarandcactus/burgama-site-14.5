import { EntryPreferences } from '@/components/entry-preferences'
import { HeroEntrance } from '@/components/hero-entrance'
import { HomepageFusedStack } from '@/components/homepage-fused-stack'
import { featuredProjects } from '@/lib/projects'

export default function HomePage() {
  return (
    <>
      <EntryPreferences />
      <HeroEntrance videoSrc="/video/backlit-prickly-pear.mov" />

      <HomepageFusedStack projects={featuredProjects} />
    </>
  )
}
