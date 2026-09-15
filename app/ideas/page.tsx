import type { Metadata } from 'next'
import { EditorialIndex } from '@/components/editorial-index'

export const metadata: Metadata = {
  title: 'Ideas',
  description: 'Practical notes from Burgama on websites, ecommerce, search, and the systems around them.',
  alternates: { canonical: '/ideas' },
  openGraph: {
    title: 'Ideas — Burgama',
    description: 'Practical notes on websites, ecommerce, search, and the systems around them.',
    url: '/ideas',
    type: 'website',
  },
}

export default function IdeasPage() {
  return <EditorialIndex />
}
