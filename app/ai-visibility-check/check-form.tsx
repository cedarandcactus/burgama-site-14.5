'use client'

import { useRouter } from 'next/navigation'
import { useRef, useState, type FormEvent } from 'react'
import { measureLead } from '@/components/openai-pixel'
import { getCookieConsent } from '@/lib/cookie-consent'
import {
  leadLimits, thanksPath, trackingKeys, turnaround, validateLead,
  type LeadDraft, type LeadErrors, type Tracking,
} from '@/lib/ai-visibility'
import styles from './page.module.css'

const fields: { key: keyof LeadDraft; label: string; type: string; autoComplete: string; placeholder?: string; inputMode?: 'url' | 'email' }[] = [
  { key: 'name', label: 'Your name', type: 'text', autoComplete: 'name' },
  { key: 'business', label: 'Business name', type: 'text', autoComplete: 'organization' },
  { key: 'website', label: 'Website', type: 'text', autoComplete: 'url', placeholder: 'example.com', inputMode: 'url' },
  { key: 'city', label: 'City you serve', type: 'text', autoComplete: 'address-level2', placeholder: 'e.g. Austin, TX' },
  { key: 'email', label: 'Email', type: 'email', autoComplete: 'email', inputMode: 'email' },
]

/* Read once at submit: the landing URL carries the UTMs and the ad click ID. */
function readAttribution() {
  const params = new URLSearchParams(window.location.search)
  const tracking: Tracking = {}
  for (const key of trackingKeys) {
    const value = params.get(key)
    if (value) tracking[key] = value.slice(0, 200)
  }
  return { tracking, oppref: params.get('oppref')?.slice(0, 500) ?? '', landingUrl: window.location.href.slice(0, 1000) }
}

function newEventId() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function CheckForm() {
  const router = useRouter()
  const [draft, setDraft] = useState<LeadDraft>({ name: '', business: '', website: '', email: '', city: '' })
  const [errors, setErrors] = useState<LeadErrors>({})
  const [state, setState] = useState<'idle' | 'sending' | 'failed'>('idle')
  const honeypot = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (state === 'sending') return

    const found = validateLead(draft)
    setErrors(found)
    const first = Object.keys(found)[0]
    if (first) {
      formRef.current?.querySelector<HTMLInputElement>(`[name="${first}"]`)?.focus()
      return
    }

    setState('sending')
    const eventId = newEventId()
    const { tracking, oppref, landingUrl } = readAttribution()

    try {
      const response = await fetch('/api/visibility-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...draft,
          tracking,
          oppref,
          landingUrl,
          eventId,
          consent: getCookieConsent() === 'accepted',
          company: honeypot.current?.value ?? '',
        }),
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) {
        if (result.errors) setErrors(result.errors)
        setState('failed')
        return
      }
      measureLead(eventId)
      /* Give the pixel a moment to send before the route changes. */
      await new Promise(resolve => setTimeout(resolve, 250))
      router.push(thanksPath)
    } catch {
      setState('failed')
    }
  }

  return (
    <form ref={formRef} id="check" className={styles.form} onSubmit={submit} noValidate aria-describedby="check-promise">
      <div className={styles.formGrid}>
        {fields.map(field => {
          const id = `check-${field.key}`
          const error = errors[field.key]
          return (
            <div key={field.key} className={styles.field} data-wide={field.key === 'email' ? '' : undefined}>
              <label htmlFor={id}>{field.label}</label>
              <input
                id={id}
                name={field.key}
                type={field.type}
                inputMode={field.inputMode}
                autoComplete={field.autoComplete}
                placeholder={field.placeholder}
                maxLength={leadLimits[field.key]}
                value={draft[field.key]}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? `${id}-error` : undefined}
                onChange={event => {
                  const value = event.target.value
                  setDraft(current => ({ ...current, [field.key]: value }))
                  if (error) setErrors(current => ({ ...current, [field.key]: undefined }))
                }}
              />
              {error && <p id={`${id}-error`} className={styles.error}>{error}</p>}
            </div>
          )
        })}
      </div>
      {/* Honeypot: hidden from people and assistive technology. */}
      <div aria-hidden="true" className={styles.honeypot}>
        <label htmlFor="check-company">Company</label>
        <input ref={honeypot} id="check-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <button type="submit" className={`pill ${styles.submit}`} disabled={state === 'sending'}>
        {state === 'sending' ? 'sending…' : 'get my free check'}
      </button>
      <p id="check-promise" className={styles.formNote}>
        Free, no obligation. Your report arrives by email within {turnaround}.
      </p>
      {state === 'failed' && (
        <p className={styles.error} role="alert">
          That didn’t go through. Please try again, or email <a href="mailto:hello@burgama.com">hello@burgama.com</a> and we’ll run the check from there.
        </p>
      )}
    </form>
  )
}
