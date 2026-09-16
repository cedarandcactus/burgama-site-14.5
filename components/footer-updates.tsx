'use client'

import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { Check, Pencil, RotateCcw } from 'lucide-react'
import { CircularArrowIcon } from '@/components/circular-arrow-icon'
import styles from '@/components/site-footer.module.css'

export function FooterUpdates() {
  const id = useId()
  const [email, setEmail] = useState('')
  const [step, setStep] = useState<'email' | 'terms' | 'complete'>('email')
  const [error, setError] = useState('')
  const input = useRef<HTMLInputElement>(null)
  const confirm = useRef<HTMLButtonElement>(null)
  const completion = useRef<HTMLSpanElement>(null)
  const focusNext = useRef(false)

  useEffect(() => {
    if (!focusNext.current) return
    focusNext.current = false
    const target = step === 'email' ? input.current : step === 'terms' ? confirm.current : completion.current
    target?.focus({ preventScroll: true })
  }, [step])

  function advance(next: typeof step) {
    focusNext.current = true
    setError('')
    setStep(next)
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
              <button ref={confirm} className={styles.updatesAction} type="button" aria-label="Agree to terms and continue" onClick={() => advance('complete')}><span className="arrow-capsule"><Check aria-hidden="true" /></span></button>
            </>
          ) : (
            <>
              <span ref={completion} tabIndex={-1} className={styles.updatesCompletion}>signup unavailable</span>
              <button className={styles.updatesAction} type="button" aria-label="Try another email address" onClick={() => { setEmail(''); advance('email') }}><span className="arrow-capsule"><RotateCcw aria-hidden="true" /></span></button>
            </>
          )}
        </div>
      </form>
      <noscript><style>{`.${styles.updatesPill} { display: none; }`}</style></noscript>
      <p id={`${id}-status`} className={styles.updatesStatus} role="status" aria-live="polite" aria-atomic="true">{error || (step === 'complete' ? 'signup isn’t connected yet. your email hasn’t been saved.' : '')}</p>
    </div>
  )
}
