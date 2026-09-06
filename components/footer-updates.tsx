'use client'

import { useId, useState } from 'react'

export function FooterUpdates() {
  const id = useId()
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'received' | 'error'>('idle')
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (state === 'sending') return
    setState('sending')
    try {
      const response = await fetch('/api/updates', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) })
      if (!response.ok) throw new Error('Request failed')
      setState('received')
    } catch { setState('error') }
  }
  return <details className="footer-updates">
    <summary>studio updates</summary>
    <div className="updates-content"><p className="caption">The mailing list isn&apos;t live yet. This form checks your address but does not save it or subscribe you. <a href="mailto:hello@burgama.com?subject=Studio%20updates">Email us about updates</a>.</p>
      <form onSubmit={submit}><label htmlFor={id}>Email address</label><input id={id} name="email" type="email" autoComplete="email" required maxLength={254} value={email} onChange={event => { setEmail(event.target.value); setState('idle') }} /><button className="pill pill-small" disabled={state === 'sending'}>{state === 'sending' ? 'checking…' : 'check address'}</button><p role="status">{state === 'received' ? 'Address checked. You have not been subscribed.' : state === 'error' ? 'Unable to check your address. Please try again.' : ''}</p></form>
    </div>
  </details>
}
