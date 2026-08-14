'use client'

import { useState } from 'react'

const ADDRESS = 'hello@burgama.com'

export function LiquidEmail() {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(ADDRESS)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${ADDRESS}`
    }
  }

  return (
    <div className="liquid-email rounded-module bg-surface-1 p-6 md:p-10">
      <span className="sr-only" aria-live="polite">{copied ? 'Email address copied' : ''}</span>
      <p className="t-body">
        Write to {ADDRESS}.{' '}
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="inline-action"
        >
          {open ? 'Close actions' : 'Email us'}
        </button>{' '}
        {open ? (
          <>
            <a href={`mailto:${ADDRESS}`} className="inline-action">Compose email</a>{' '}
            <button type="button" onClick={copyAddress} className="inline-action">
              {copied ? 'Copied' : 'Copy address'}
            </button>
          </>
        ) : null}
      </p>
    </div>
  )
}
