'use client'

import { useEffect, useState } from 'react'
import { bookingUrl } from '@/lib/ai-visibility'
import styles from '../page.module.css'

/* Inline Calendly, prefilled with the name and email the visitor just typed
   (handed over in sessionStorage by the form, never put in the page URL). */
export function BookingEmbed() {
  const [src, setSrc] = useState('')
  useEffect(() => {
    const url = new URL(bookingUrl)
    url.searchParams.set('embed_domain', window.location.host)
    url.searchParams.set('embed_type', 'Inline')
    url.searchParams.set('hide_gdpr_banner', '1')
    url.searchParams.set('primary_color', '001328')
    url.searchParams.set('utm_source', 'ai-check')
    url.searchParams.set('utm_content', 'thanks')
    try {
      const lead = JSON.parse(sessionStorage.getItem('ai-check-lead') ?? '{}') as { name?: string; email?: string }
      if (lead.name) url.searchParams.set('name', lead.name)
      if (lead.email) url.searchParams.set('email', lead.email)
    } catch { /* storage blocked: the calendar still works, just not prefilled */ }
    setSrc(url.toString())
  }, [])
  return (
    <div className={styles.booking}>
      {src ? <iframe src={src} title="Book a free 30-minute call" className={styles.bookingFrame} loading="lazy" /> : null}
    </div>
  )
}
