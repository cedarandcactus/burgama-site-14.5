import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { EditorialDetail } from '@/components/editorial-detail'
import { getIdea, ideas } from '@/lib/editorial'

export const dynamicParams = false

export function generateStaticParams() {
  return ideas.map((idea) => ({ slug: idea.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const idea = getIdea(slug)

  if (!idea) return { title: 'Idea not found', robots: { index: false } }

  return {
    title: { absolute: idea.metaTitle },
    description: idea.metaDescription,
    keywords: [idea.targetKeyword, ...idea.categories],
    openGraph: {
      title: idea.metaTitle,
      description: idea.metaDescription,
      type: 'article',
    },
  }
}

export default async function IdeaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const idea = getIdea(slug)

  if (!idea) notFound()

  return <EditorialDetail idea={idea} />
}
