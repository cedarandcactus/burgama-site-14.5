import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { EditorialDetail } from '@/components/editorial-detail'
import { getIdea, getPublishedIdeas } from '@/lib/editorial'

export const dynamicParams = false

export function generateStaticParams() {
  return getPublishedIdeas().map(idea => ({ slug: idea.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const idea = getIdea(slug)

  if (!idea) return { title: 'Idea not found', robots: { index: false } }

  return {
    title: idea.title,
    description: idea.dek,
  }
}

export default async function IdeaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const idea = getIdea(slug)

  if (!idea) notFound()

  return <EditorialDetail idea={idea} />
}
