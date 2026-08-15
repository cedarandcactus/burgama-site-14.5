import { EntryPreferences } from '@/components/entry-preferences'
import { HeroEntrance } from '@/components/hero-entrance'
import { HomeEditorial } from '@/components/home-editorial'
import { SiteFooter } from '@/components/site-footer'
import { featuredProjects } from '@/lib/projects'

export default function HomePage() {
  return (
    <>
      <EntryPreferences />
      <HeroEntrance videoSrc="/video/backlit-prickly-pear.mov" />

      <HomeEditorial projects={featuredProjects} />
      <SiteFooter />
    </>
  )
}
