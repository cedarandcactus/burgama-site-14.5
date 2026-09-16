'use client'

import { useEffect, useId, useRef, useState } from 'react'
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
  const dialogRef = useRef<HTMLDivElement>(null)
  const acceptRef = useRef<HTMLButtonElement>(null)
  const [state, setState] = useState<BannerState>('hidden')

  useEffect(() => {
    if (!getCookieConsent()) setState('visible')
  }, [])

  useEffect(() => {
    if (state !== 'visible') return

    const frame = window.requestAnimationFrame(() => acceptRef.current?.focus({ preventScroll: true }))

    function containFocus(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        return
      }
      if (event.key !== 'Tab') return

      const controls = dialogRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
      if (!controls?.length) return
      const first = controls[0]
      const last = controls[controls.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', containFocus)
    return () => {
      window.cancelAnimationFrame(frame)
      document.removeEventListener('keydown', containFocus)
    }
  }, [state])

  function choose(value: CookieConsent) {
    setCookieConsent(value)
    if (value === 'necessary') clearHeadlinePreference()
    window.dispatchEvent(new CustomEvent<CookieConsent>(COOKIE_CONSENT_EVENT, { detail: value }))
    setState('leaving')
    window.setTimeout(() => setState('hidden'), 180)
  }

  if (state === 'hidden') return null

  return (
    <div className={styles.overlay} data-state={state}>
      <div
        ref={dialogRef}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
      >
        <div className={styles.copy}>
          <h2 id={titleId}>Your cookie choice</h2>
          <p id={descriptionId}>We use one optional cookie to vary the homepage message. Choose whether to allow it; necessary storage only remembers your choice.</p>
          <Link href="/cookies" target="_blank" rel="noopener noreferrer" aria-label="Read the cookie policy (opens in a new tab)">Read the cookie policy</Link>
        </div>
        <div className={styles.actions}>
          <button ref={acceptRef} className={styles.accept} type="button" onClick={() => choose('accepted')}>Accept</button>
          <button className={styles.necessary} type="button" onClick={() => choose('necessary')}>Only necessary</button>
        </div>
      </div>
    </div>
  )
}
