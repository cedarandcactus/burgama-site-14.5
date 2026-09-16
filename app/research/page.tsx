import type { Metadata } from 'next'
import { EditorialIndex } from '@/components/editorial-index'

export const metadata: Metadata = {
  title: 'Research',
  description: 'Practical notes from Burgama on websites, ecommerce, search, and the systems around them.',
  alternates: { canonical: '/research' },
  openGraph: {
    title: 'Research — Burgama',
    description: 'Practical notes on websites, ecommerce, search, and the systems around them.',
    url: '/research',
    type: 'website',
  },
}

export default function ResearchPage() {
  return <EditorialIndex />
}
