import type { Metadata } from 'next'
import { EditorialIndex } from '@/components/editorial-index'
import { ideas } from '@/lib/editorial'
import { absoluteUrl, defaultSocialImage, JsonLd } from '@/lib/seo'

export const metadata: Metadata = {
  title: { absolute: 'Burgama Research — Design, Technology & Digital Work' },
  description: 'Practical research and observations from Burgama\'s work across websites, ecommerce, search, content, and digital decision-making.',
  alternates: { canonical: '/research' },
  openGraph: { title: 'Burgama Research — Design, Technology & Digital Work', siteName: 'Burgama Research', description: 'Practical research and observations from Burgama\'s work across websites, ecommerce, search, content, and digital decision-making.', url: '/research', type: 'website', images: [{ url: defaultSocialImage, width: 1080, height: 1080, alt: 'Burgama — research and observations on design and technology' }] },
  twitter: { card: 'summary_large_image', title: 'Burgama Research — Design, Technology & Digital Work', description: 'Research and observations on design, technology and digital work.', images: [defaultSocialImage] },
}

export default function ResearchPage() {
  return <>
    <JsonLd data={{
      '@context': 'https://schema.org', '@type': 'CollectionPage',
      '@id': absoluteUrl('/research'), url: absoluteUrl('/research'), name: 'Burgama Research',
      mainEntity: { '@type': 'ItemList', itemListElement: ideas.map((idea, index) => ({
        '@type': 'ListItem', position: index + 1, name: idea.title, url: absoluteUrl(`/research/${idea.slug}`),
      })) },
    }} />
    <EditorialIndex />
  </>
}
