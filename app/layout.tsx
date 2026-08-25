import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { CornerShell } from '@/components/corner-shell'
import { FrostFieldProvider } from '@/components/frost-field'
import './globals.css'

/* Licensed GT Pressura files, mapped to the roles in the Burgama font reference. */
const pressuraStandard = localFont({
  src: '../public/fonts/GT-Pressura-LCGV-Standard-Light.otf',
  weight: '400',
  style: 'normal',
  display: 'swap',
  variable: '--font-standard',
  fallback: ['Helvetica Neue', 'Arial', 'sans-serif'],
})

const pressuraExtended = localFont({
  src: '../public/fonts/GT-Pressura-LCGV-Extended-Regular.otf',
  weight: '400',
  style: 'normal',
  display: 'swap',
  variable: '--font-wordmark',
})

const pressuraMono = localFont({
  src: '../public/fonts/GT-Pressura-LCGV-Mono-Light.otf',
  weight: '400',
  style: 'normal',
  display: 'swap',
  variable: '--font-mono-pressura',
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

/*
  Both values were left over from the light palette (`#e8e9f0` was the old
  off-white ground). The site is deep navy now, so the browser was being told
  the opposite of what it renders — which affects the mobile address-bar
  colour and form-control rendering. `themeColor` matches `--paper`.
*/
export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#161c40',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${pressuraStandard.variable} ${pressuraExtended.variable} ${pressuraMono.variable} bg-background`}
    >
      <body className="bg-background text-foreground font-sans antialiased">
        <a
          href="#main"
          className="t-ui sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-2 focus-visible:left-2 focus-visible:z-100 focus-visible:rounded-module focus-visible:px-4 focus-visible:py-3"
        >
          Skip to content
        </a>
        {/*
          Publishes --frost-face/--frost-fg from whichever [data-field]
          section is currently behind the chrome. Renders nothing; the four
          shell corners and the console all read the same variables, so they
          can never disagree about the current tint.
        */}
        <FrostFieldProvider />
        {/*
          The site's only navigation system, at every breakpoint. A separate
          `MobileConsole` used to take over below 760px; it is gone, because
          two navigation systems meant two sets of behaviour to keep in sync
          and the mobile one had already drifted from this one.
        */}
        <CornerShell />
        <main id="main">{children}</main>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
