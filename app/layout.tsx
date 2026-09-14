import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { CornerShell } from '@/components/corner-shell'
import { SurfaceEffects } from '@/components/surface-effects'
import './globals.css'
import './cyan-shell.css'

const pangram = localFont({
  src: [
    { path: '../public/fonts/pangram-light.otf', weight: '300', style: 'normal' },
    { path: '../public/fonts/pangram-medium.otf', weight: '500', style: 'normal' },
    { path: '../public/fonts/pangram-semibold.otf', weight: '600', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-pangram',
  fallback: ['Arial', 'sans-serif'],
})
const cenura = localFont({
  src: '../public/fonts/cenura.otf',
  weight: '400',
  style: 'normal',
  display: 'swap',
  variable: '--font-cenura',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://burgama.com'),
  icons: { icon: '/burgama-symbol.svg' },
  title: { default: 'Burgama — Creative & marketing studio', template: '%s — Burgama' },
  description: 'An independent creative and marketing studio in Austin, Texas. Brand, digital and campaign work for founders and startups, from the first conversation through the final detail.',
  openGraph: {
    title: 'Burgama — Creative & marketing studio',
    description: 'Brand, digital and campaign work. Based in Austin, working wherever the project leads.',
    type: 'website',
  },
}
export const viewport: Viewport = { colorScheme: 'dark light', themeColor: '#000020' }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${pangram.variable} ${cenura.variable} bg-background`}>
      <body className="bg-background text-foreground font-sans antialiased">
        <>
          <a href="#main" className="skip-link">Skip to content</a>
          <CornerShell />
          <main id="main" tabIndex={-1}>{children}</main>
          <SurfaceEffects />
        </>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
