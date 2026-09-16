'use client'

import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { Check, Pencil, RotateCcw } from 'lucide-react'
import { CircularArrowIcon } from '@/components/circular-arrow-icon'
import styles from '@/components/site-footer.module.css'

/*
  Klaviyo's client endpoint is the one meant for signup forms on public
  pages: it authenticates with the public site ID rather than a private
  API key, so there is no secret to hold, deploy, or rotate. Both values
  below are public by design — the site ID is already published in this
  domain's DNS as a Klaviyo verification record.

  The list has double opt-in enabled, which is what makes a public
  endpoint safe: an address submitted by anyone other than its owner
  never confirms, so it never joins the list or receives anything.
*/
const klaviyoSiteId = 'SHGMTi'
const klaviyoListId = 'YputDN'
const klaviyoEndpoint = `https://a.klaviyo.com/client/subscriptions?company_id=${klaviyoSiteId}`
const klaviyoRevision = '2026-07-15'

export function FooterUpdates() {
  const id = useId()
  const [email, setEmail] = useState('')
  const [step, setStep] = useState<'email' | 'terms' | 'complete'>('email')
  const [error, setError] = useState('')
  const [result, setResult] = useState<'pending' | 'subscribed' | 'failed'>('pending')
  const request = useRef(0)
  const honeypot = useRef<HTMLInputElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const confirm = useRef<HTMLButtonElement>(null)
  const completion = useRef<HTMLSpanElement>(null)
  const focusNext = useRef(false)

  useEffect(() => () => { request.current += 1 }, [])

  useEffect(() => {
    if (!focusNext.current) return
    focusNext.current = false
    const target = step === 'email' ? input.current : step === 'terms' ? confirm.current : completion.current
    target?.focus({ preventScroll: true })
  }, [step])

  function advance(next: typeof step) {
    focusNext.current = true
    setError('')
    if (next !== 'complete') {
      request.current += 1
      setResult('pending')
    }
    setStep(next)
  }

  /*
    Consent is the trigger: the address is only sent once the visitor has
    agreed to the terms, never on the email step. A failure is reported
    rather than swallowed, so nobody is told they subscribed when they did
    not.
  */
  async function subscribe() {
    const ticket = ++request.current
    advance('complete')
    /* Filled means a bot; report success without troubling Klaviyo. */
    if (honeypot.current?.value.trim()) { setResult('subscribed'); return }
    try {
      const response = await fetch(klaviyoEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/vnd.api+json', revision: klaviyoRevision },
        body: JSON.stringify({
          data: {
            type: 'subscription',
            attributes: {
              /* Shows in Klaviyo as the origin of the consent record. */
              custom_source: 'Burgama website footer',
              profile: {
                data: {
                  type: 'profile',
                  attributes: {
                    email: email.trim().toLowerCase(),
                    subscriptions: { email: { marketing: { consent: 'SUBSCRIBED' } } },
                  },
                },
              },
            },
            relationships: { list: { data: { type: 'list', id: klaviyoListId } } },
          },
        }),
      })
      if (ticket !== request.current) return
      setResult(response.ok ? 'subscribed' : 'failed')
    } catch {
      if (ticket === request.current) setResult('failed')
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (step !== 'email') return
    if (!input.current?.validity.valid) {
      setError('enter a valid email')
      input.current?.focus({ preventScroll: true })
      return
    }
    advance('terms')
  }

  return (
    <div className={styles.updates}>
      <h2 id={`${id}-heading`}>Subscribe for updates</h2>
      <form className={styles.updatesPill} aria-labelledby={`${id}-heading`} aria-describedby={`${id}-status`} noValidate onSubmit={submit} onKeyDown={(event) => {
        if (event.key === 'Enter' && (event.nativeEvent.isComposing || event.nativeEvent.keyCode === 229)) event.preventDefault()
      }}>
        {/* Hidden from people and from assistive technology; only a bot fills it. */}
        <div className={styles.honeypot} aria-hidden="true">
          <input ref={honeypot} type="text" name="company" tabIndex={-1} autoComplete="off" defaultValue="" />
        </div>
        <div key={step} className={styles.updatesStep}>
          {step === 'email' ? (
            <>
              <label className="sr-only" htmlFor={`${id}-email`}>Email address</label>
              <input ref={input} id={`${id}-email`} name="email" type="email" autoComplete="email" autoCapitalize="none" spellCheck={false} required maxLength={254} placeholder="your email" value={email} onChange={(event) => { setEmail(event.target.value); setError('') }} aria-invalid={!!error} aria-describedby={`${id}-status`} />
              <button className={styles.updatesAction} type="submit" aria-label="Continue to terms"><span className="arrow-capsule"><CircularArrowIcon /></span></button>
            </>
          ) : step === 'terms' ? (
            <>
              <span className={styles.updatesConsent}>agree to our <a href="/terms" target="_blank" rel="noopener noreferrer" aria-label="Terms (opens in a new tab)">terms</a></span>
              <button className={styles.updatesEdit} type="button" aria-label="Edit email address" onClick={() => advance('email')}><Pencil aria-hidden="true" /></button>
              <button ref={confirm} className={styles.updatesAction} type="button" aria-label="Agree to terms and subscribe" onClick={subscribe}><span className="arrow-capsule"><Check aria-hidden="true" /></span></button>
            </>
          ) : (
            <>
              <span ref={completion} tabIndex={-1} className={styles.updatesCompletion}>{
                result === 'subscribed' ? 'you’re on the list'
                : result === 'pending' ? 'subscribing…'
                : 'that didn’t save'
              }</span>
              <button className={styles.updatesAction} type="button" aria-label={result === 'subscribed' ? 'Subscribe another email address' : 'Try another email address'} onClick={() => { setEmail(''); advance('email') }}><span className="arrow-capsule"><RotateCcw aria-hidden="true" /></span></button>
            </>
          )}
        </div>
      </form>
      <noscript><style>{`.${styles.updatesPill} { display: none; }`}</style></noscript>
      <p id={`${id}-status`} className={styles.updatesStatus} role="status" aria-live="polite" aria-atomic="true">{error || (step !== 'complete' ? ''
        : result === 'pending' ? 'adding you to the list…'
        : result === 'subscribed' ? 'thanks — check your inbox if we ask you to confirm. unsubscribe any time.'
        : 'that didn’t save. please try again, or email hello@burgama.com.')}</p>
    </div>
  )
}
