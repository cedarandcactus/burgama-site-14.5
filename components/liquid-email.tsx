'use client'

import { useState } from 'react'
import { LiquidControl, LiquidGroup } from '@/components/liquid-controls'

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
    <div className="liquid-email flex min-h-[36svh] flex-col justify-between gap-8 rounded-module bg-surface-1 p-6 md:p-10">
      <div className="flex items-center justify-between gap-4">
        <span className="t-ui">Direct line</span>
        <span className="sr-only" aria-live="polite">{copied ? 'Email address copied' : ''}</span>
      </div>
      <p className="t-title break-words">{ADDRESS}</p>
      <LiquidGroup className="flex flex-wrap items-center justify-end gap-2">
        <LiquidControl>
          <button
            type="button"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className="liquid-button"
          >
            {open ? 'Close' : 'Email'}
          </button>
        </LiquidControl>
        {open ? (
          <>
            <LiquidControl delay={40}>
              <a href={`mailto:${ADDRESS}`} className="liquid-button">Compose</a>
            </LiquidControl>
            <LiquidControl delay={80}>
              <button type="button" onClick={copyAddress} className="liquid-button">
                {copied ? 'Copied' : 'Copy address'}
              </button>
            </LiquidControl>
          </>
        ) : null}
      </LiquidGroup>
    </div>
  )
}
