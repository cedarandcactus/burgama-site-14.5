import type { Metadata } from 'next'
import { FaqContent } from './faq-content'
import { faqJsonLd } from '@/lib/faq-content'
import { JsonLd, breadcrumbJsonLd, defaultSocialImage, websiteJsonLd } from '@/lib/seo'

const title = 'Burgama FAQ and Pricing | Austin Marketing Agency'
const description = 'Answers about working with Burgama: services, pricing, SEO and AI search, approvals, billing and next steps. Based in Austin, working across the US.'

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: '/faq' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  openGraph: { title, description, url: '/faq', type: 'website', images: [defaultSocialImage] },
  twitter: { card: 'summary_large_image', title, description, images: [defaultSocialImage] },
}

export default function FaqPage() {
  return (
    <>
      <JsonLd data={websiteJsonLd} />
      <JsonLd data={faqJsonLd} />
      <JsonLd data={breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'FAQ', path: '/faq' }])} />
      <FaqContent />
    </>
  )
}
