'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'
import { COOKIE_CONSENT_EVENT, adMeasurementAllowed, adMeasurementOptedOut } from '@/lib/cookie-consent'

/*
  OPENAI ADS MEASUREMENT PIXEL: US opt-out, opt-in elsewhere.

  US visitors (optOutRegion, from the server's geo header) get the pixel
  unless they chose "Necessary only", used "Do not sell or share", or their
  browser sends Global Privacy Control. Everyone else gets it only after
  "Accept all". Leads are still counted through the UTM fields on the form
  either way.

  The SDK reads the `oppref` click ID from the landing URL at init, which
  is why this component sits in the landing page's layout: the ad lands
  here, and init runs on this page.

  Set NEXT_PUBLIC_OPENAI_PIXEL_ID in Vercel (Ads Manager > Tools >
  Conversions > Data source). Without it the component renders nothing.
*/

type Oaiq = (...args: unknown[]) => void
declare global {
  interface Window { oaiq?: Oaiq }
}

const pixelId = process.env.NEXT_PUBLIC_OPENAI_PIXEL_ID

export function OpenAIPixel({ optOutRegion }: { optOutRegion: boolean }) {
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    setAllowed(adMeasurementAllowed(optOutRegion))
    const onChange = () => setAllowed(adMeasurementAllowed(optOutRegion))
    window.addEventListener(COOKIE_CONSENT_EVENT, onChange)
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, onChange)
  }, [optOutRegion])

  /* Opted out after load: tell the SDK, which deletes its cookies. */
  useEffect(() => {
    if (!allowed && window.oaiq) window.oaiq('consent', false)
  }, [allowed])

  if (!pixelId || !allowed) return null

  return (
    <Script
      id="openai-ads-pixel"
      src="https://bzrcdn.openai.com/sdk/oaiq.min.js"
      strategy="afterInteractive"
      onLoad={() => {
        window.oaiq?.('init', { pixelId, debug: process.env.NODE_ENV !== 'production' })
      }}
    />
  )
}

/*
  Browser half of the lead conversion. The server sends the same event_id
  through the Conversions API, and OpenAI keeps whichever arrives first.
  Returns quietly when the pixel is not loaded or the visitor opted out.
*/
export function measureLead(eventId: string) {
  if (typeof window === 'undefined' || !window.oaiq || adMeasurementOptedOut()) return
  window.oaiq('measure', 'lead_created', { type: 'customer_action' }, { event_id: eventId })
}
