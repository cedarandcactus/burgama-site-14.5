import { HomeIndex } from '@/components/home-index'
import { SiteFooter } from '@/components/site-footer'
import { projects } from '@/lib/projects'

export default function HomePage() {
  return (
    <>
      <HomeIndex projects={projects} />
      <SiteFooter />
    </>
  )
}
