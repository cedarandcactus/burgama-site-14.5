import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { EditorialDetail } from '@/components/editorial-detail'
import { getIdea, ideas } from '@/lib/editorial'
import { absoluteUrl, breadcrumbJsonLd, JsonLd, siteUrl } from '@/lib/seo'

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

  const title = `${idea.metaTitle} — Burgama Research`
  const canonicalPath = `/research/${idea.slug}`
  const image = { url: `${canonicalPath}/share-image`, width: 1200, height: 630, alt: idea.title }

  return {
    title: { absolute: title },
    description: idea.metaDescription,
    keywords: [idea.targetKeyword, ...idea.categories],
    alternates: { canonical: canonicalPath },
    authors: [{ name: 'Burgama', url: absoluteUrl('/studio') }],
    openGraph: { title, description: idea.metaDescription, siteName: 'Burgama Research', type: 'article', url: canonicalPath, authors: [absoluteUrl('/studio')], section: idea.categories[0], images: [image] },
    twitter: { card: 'summary_large_image', title, description: idea.metaDescription, images: [image] },
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
    url: canonicalUrl,
    inLanguage: 'en',
    wordCount: idea.body.join(' ').trim().split(/\s+/).length,
    articleBody: idea.body.join('\n\n'),
    citation: idea.sources.map(source => source.href),
    isAccessibleForFree: true,
    isPartOf: { '@type': 'CollectionPage', '@id': absoluteUrl('/research'), name: 'Burgama Research' },
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
    author: { '@type': 'Organization', '@id': `${siteUrl}/#organization`, name: 'Burgama', url: absoluteUrl('/studio') },
    publisher: { '@id': `${siteUrl}/#organization` },
    image: { '@type': 'ImageObject', url: absoluteUrl(`${canonicalPath}/share-image`), width: 1200, height: 630, caption: idea.title },
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
