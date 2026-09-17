import type { Metadata } from 'next'
import { EditorialIndex } from '@/components/editorial-index'

export const metadata: Metadata = {
  title: 'Research & Ideas — Web, Ecommerce & Search — Burgama',
  description: 'Practical research and observations from Burgama\'s work across websites, ecommerce, search, content, and digital decision-making.',
  alternates: { canonical: '/research' },
  openGraph: { title: 'Research & Ideas — Web, Ecommerce & Search — Burgama', description: 'Practical research and observations from Burgama\'s work across websites, ecommerce, search, content, and digital decision-making.', url: '/research', type: 'website' },
}

export default function ResearchPage() {
  return <EditorialIndex />
}
