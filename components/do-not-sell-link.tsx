'use client'

import { useEffect, useState } from 'react'
import { COOKIE_CONSENT_EVENT, adMeasurementOptedOut, optOutOfAdMeasurement } from '@/lib/cookie-consent'

/*
  "Do not sell or share my personal information" (CCPA/CPRA and similar
  state laws). One click opts the browser out of advertising measurement,
  the same as "Necessary only". Global Privacy Control is honored too.
*/
export function DoNotSellLink({ className }: { className?: string }) {
  const [optedOut, setOptedOut] = useState(false)

  useEffect(() => {
    setOptedOut(adMeasurementOptedOut())
    const onChange = () => setOptedOut(adMeasurementOptedOut())
    window.addEventListener(COOKIE_CONSENT_EVENT, onChange)
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, onChange)
  }, [])

  if (optedOut) {
    return <a className={className} href="/privacy#your-privacy-choices" role="status">Opted out of sale or sharing</a>
  }
  return (
    <button type="button" className={className} onClick={optOutOfAdMeasurement}>
      Do not sell or share my personal information
    </button>
  )
}
