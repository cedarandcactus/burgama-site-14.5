import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { CookieBanner } from '@/components/cookie-banner'
import { CornerShell } from '@/components/corner-shell'
import { PageTransition } from '@/components/page-transition'
import { SmoothScroll } from '@/components/smooth-scroll'
import { DesktopHaptics } from '@/components/desktop-haptics'
import { JsonLd, organizationJsonLd } from '@/lib/seo'
import 'lenis/dist/lenis.css'
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
  metadataBase: new URL('https://www.burgama.com'),
  applicationName: 'Burgama',
  icons: {
    icon: [{ url: '/burgama-symbol.svg', type: 'image/svg+xml' }],
    apple: '/burgama-symbol.svg',
  },
  title: { default: 'Burgama — Creative & Marketing Studio in Austin', template: '%s — Burgama' },
  description: 'Burgama is an independent creative and marketing studio in Austin working across brand identity, websites, packaging, content, campaigns, and search.',
  alternates: { canonical: '/' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' } },
  openGraph: {
    siteName: 'Burgama',
    title: 'Burgama — Creative & Marketing Studio in Austin',
    description: 'Burgama is an independent creative and marketing studio in Austin working across brand identity, websites, packaging, content, campaigns, and search.',
    type: 'website',
    url: '/',
    images: [{ url: '/images/burgama-social-share.png', width: 1080, height: 1080, alt: 'Burgama abstract light-blue line pattern on deep navy' }],
  },
  twitter: { card: 'summary_large_image', images: ['/images/burgama-social-share.png'] },
}
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  colorScheme: 'dark light',
  themeColor: '#95BCE5',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${pangram.variable} ${cenura.variable} bg-background`}>
      <body className="bg-background text-foreground font-sans antialiased">
        <JsonLd data={organizationJsonLd} />
        <noscript><style>{'.reveal { opacity: 1 !important; transform: none !important; }'}</style></noscript>
        <SmoothScroll>
          <PageTransition>
            <a href="#main" className="skip-link">Skip to content</a>
            <CornerShell />
            <main id="main" tabIndex={-1}>{children}</main>
          </PageTransition>
        </SmoothScroll>
        <CookieBanner />
        <DesktopHaptics />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
