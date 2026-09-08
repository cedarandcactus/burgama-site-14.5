import type { Viewport } from 'next'
import './portfolio.css'

export const viewport: Viewport = { themeColor: '#f0f0f5', colorScheme: 'light' }

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return <div className="portfolio font-sans">{children}</div>
}
