import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { EditorialDetail } from '@/components/editorial-detail'
import { getIdea, ideas } from '@/lib/editorial'

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

  return {
    title: idea.metaTitle,
    description: idea.metaDescription,
    keywords: [idea.targetKeyword, ...idea.categories],
    alternates: { canonical: `/research/${idea.slug}` },
    openGraph: {
      title: idea.metaTitle,
      description: idea.metaDescription,
      type: 'article',
      url: `/research/${idea.slug}`,
    },
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

  const canonicalUrl = `https://burgama.com/research/${idea.slug}`
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: idea.title,
    description: idea.metaDescription,
    keywords: idea.targetKeyword,
    articleSection: idea.categories,
    mainEntityOfPage: canonicalUrl,
    author: {
      '@type': 'Organization',
      name: 'Burgama',
      url: 'https://burgama.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Burgama',
      url: 'https://burgama.com',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <EditorialDetail idea={idea} />
    </>
  )
}
