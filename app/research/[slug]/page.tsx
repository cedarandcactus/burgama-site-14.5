import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { EditorialDetail } from '@/components/editorial-detail'
import { getIdea, ideas } from '@/lib/editorial'
import { absoluteUrl, breadcrumbJsonLd, defaultSocialImage, JsonLd, siteUrl } from '@/lib/seo'

export function generateStaticParams() {
  return ideas.map((idea) => ({ slug: idea.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const idea = getIdea(slug)

  if (!idea) return { title: 'Research' }

  const title = `${idea.metaTitle} — Burgama`
  const canonicalPath = `/research/${idea.slug}`

  return {
    title: { absolute: title },
    description: idea.metaDescription,
    keywords: [idea.targetKeyword, ...idea.categories],
    alternates: { canonical: canonicalPath },
    openGraph: { title, description: idea.metaDescription, type: 'article', url: canonicalPath, images: [{ url: defaultSocialImage, alt: `${idea.title} — Burgama Research` }] },
    twitter: { card: 'summary_large_image', images: [defaultSocialImage] },
  }
}

export default async function ResearchDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const idea = getIdea(slug)

  if (!idea) notFound()

  const canonicalPath = `/research/${idea.slug}`
  const canonicalUrl = absoluteUrl(canonicalPath)
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${canonicalUrl}#article`,
    headline: idea.title,
    description: idea.metaDescription,
    keywords: idea.targetKeyword,
    articleSection: idea.categories,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${canonicalUrl}#webpage` },
    author: { '@id': `${siteUrl}/#organization` },
    publisher: { '@id': `${siteUrl}/#organization` },
    image: [defaultSocialImage],
  }
  const breadcrumbs = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Research', path: '/research' },
    { name: idea.title, path: canonicalPath },
  ])

  return (
    <>
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbs} />
      <EditorialDetail idea={idea} />
    </>
  )
}
