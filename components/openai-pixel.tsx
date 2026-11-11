'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'
import { COOKIE_CONSENT_EVENT, getCookieConsent, type CookieConsent } from '@/lib/cookie-consent'

/*
  OPENAI ADS MEASUREMENT PIXEL — consent-gated.

  The cookie policy promises that no advertising technology runs before a
  visitor opts in, so the SDK is not even requested until the banner has
  been answered with "Accept all". Choosing "Necessary only" (or ignoring
  the banner) means no OpenAI cookies and no browser events. Leads are
  still counted through the UTM fields on the form, so the test can be
  judged either way.

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

export function OpenAIPixel() {
  const [consent, setConsent] = useState<CookieConsent | null>(null)

  useEffect(() => {
    setConsent(getCookieConsent())
    const onChange = (event: Event) => setConsent((event as CustomEvent<CookieConsent>).detail)
    window.addEventListener(COOKIE_CONSENT_EVENT, onChange)
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, onChange)
  }, [])

  /* Consent withdrawn after load: tell the SDK, which deletes its cookies. */
  useEffect(() => {
    if (consent === 'necessary' && window.oaiq) window.oaiq('consent', false)
  }, [consent])

  if (!pixelId || consent !== 'accepted') return null

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
  Returns quietly when the pixel is not loaded (no consent, no pixel ID).
*/
export function measureLead(eventId: string) {
  if (typeof window === 'undefined' || !window.oaiq || getCookieConsent() !== 'accepted') return
  window.oaiq('measure', 'lead_created', { type: 'customer_action' }, { event_id: eventId })
}
