import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: { default: 'Burgama Research', template: '%s — Burgama Research' },
  description: 'Research and observations on design, technology, websites and ecommerce, by Burgama.',
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' } },
}

export default function ResearchLayout({ children }: { children: React.ReactNode }) {
  return children
}
