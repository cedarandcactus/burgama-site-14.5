import type { Viewport } from 'next'
import './portfolio.css'

export const viewport: Viewport = { themeColor: '#95bce5', colorScheme: 'light' }

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return children
}
