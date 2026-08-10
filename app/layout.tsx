import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Archivo } from 'next/font/google'
import { SiteNav } from '@/components/site-nav'
import './globals.css'

const archivo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  display: 'swap',
  variable: '--font-archivo',
})

export const metadata: Metadata = {
  title: {
    default: 'Burgama — Design-led creative studio',
    template: '%s — Burgama',
  },
  description:
    'Burgama builds identities and experiences that can move, change and remain recognizable. The work begins with a point of view, then becomes a system.',
  generator: 'v0.app',
  openGraph: {
    title: 'Burgama — Design-led creative studio',
    description:
      'Identities, digital experiences, campaigns and systems. Burgama is a design-led creative studio.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#081132',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${archivo.variable} bg-background`}>
      <body className="bg-background text-foreground font-sans antialiased">
        <a
          href="#main"
          className="t-ui sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-2 focus-visible:left-2 focus-visible:z-100 focus-visible:rounded-module focus-visible:px-4 focus-visible:py-3"
        >
          Skip to content
        </a>
        <SiteNav />
        <main id="main">{children}</main>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
