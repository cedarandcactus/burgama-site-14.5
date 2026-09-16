import { PageHero } from '@/components/page-hero'
import { SiteFooter } from '@/components/site-footer'
import Link from '@/components/transition-link'

export default function NotFound() {
  return (
    <div className="studio-page">
      <PageHero wordmark="Not here." intro={['We couldn’t find that page.']} nextSurface="powder-deep" actions={<><Link href="/" className="pill">back home</Link><Link href="/work" className="pill">see the work</Link></>} />
      <SiteFooter />
    </div>
  )
}
