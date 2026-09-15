import type { Viewport } from 'next'
import './portfolio.css'

export const viewport: Viewport = { themeColor: '#afc8f2', colorScheme: 'light' }

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return <div className="portfolio font-sans">{children}</div>
}
