import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: { default: 'Burgama Research', template: '%s — Burgama Research' },
  description: 'Research and observations on design, technology, websites and ecommerce, by Burgama.',
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' } },
}

export const viewport: Viewport = { themeColor: '#dce3f3', colorScheme: 'light' }

export default function ResearchLayout({ children }: { children: React.ReactNode }) {
  return children
}
