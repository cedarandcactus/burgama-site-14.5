import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { EditorialDetail } from '@/components/editorial-detail'
import { getIdea, ideas } from '@/lib/editorial'

export function generateStaticParams() {
  return ideas.map((idea) => ({ slug: idea.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const idea = getIdea(slug)
  if (!idea) return { title: 'Research' }

  return {
    title: { absolute: `${idea.metaTitle} — Burgama Research` },
    description: idea.metaDescription,
    alternates: { canonical: `/research/${idea.slug}` },
    robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  }
}

export default async function EditionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const idea = getIdea(slug)
  if (!idea) notFound()
  return <EditorialDetail idea={idea} />
}
