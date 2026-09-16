'use client'

import { useEffect, useId, useState } from 'react'
import Link from '@/components/transition-link'
import {
  COOKIE_CONSENT_EVENT,
  clearHeadlinePreference,
  getCookieConsent,
  setCookieConsent,
  type CookieConsent,
} from '@/lib/cookie-consent'
import styles from './cookie-banner.module.css'

type BannerState = 'hidden' | 'visible' | 'leaving'

export function CookieBanner() {
  const titleId = useId()
  const descriptionId = useId()
  const [state, setState] = useState<BannerState>('hidden')

  useEffect(() => {
    if (!getCookieConsent()) setState('visible')
  }, [])

  function choose(value: CookieConsent) {
    setCookieConsent(value)
    if (value === 'necessary') clearHeadlinePreference()
    window.dispatchEvent(new CustomEvent<CookieConsent>(COOKIE_CONSENT_EVENT, { detail: value }))
    setState('leaving')
    window.setTimeout(() => setState('hidden'), 620)
  }

  if (state === 'hidden') return null

  return (
    <>
      <svg className={styles.filter} width="0" height="0" aria-hidden="true">
        <defs>
          <filter id="cookie-glass-distortion" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.012" numOctaves="2" seed="92" result="noise" />
            <feGaussianBlur in="noise" stdDeviation="1.4" result="blurred" />
            <feDisplacementMap in="SourceGraphic" in2="blurred" scale="112" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>
      <div className={styles.overlay} data-state={state} aria-hidden={state === 'leaving'} inert={state === 'leaving'}>
        <aside
          className={styles.dialog}
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
        >
          <div className={styles.copy}>
            <h2 id={titleId}>A small cookie, your call.</h2>
            <p id={descriptionId}>
              One optional cookie keeps our homepage hello fresh. <Link href="/cookies">See details.</Link>
            </p>
          </div>
          <div className={styles.actions}>
            <button className={styles.necessary} type="button" onClick={() => choose('necessary')}>Necessary only</button>
            <button className={styles.accept} type="button" onClick={() => choose('accepted')}>Accept</button>
          </div>
        </aside>
      </div>
    </>
  )
}
