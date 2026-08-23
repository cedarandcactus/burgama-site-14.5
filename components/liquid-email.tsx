'use client'

import { useState } from 'react'

const ADDRESS = 'hello@burgama.com'

/*
  The address itself is the signature element of this page, so it is set large
  and unadorned rather than sitting inside a filled card. Actions are inline
  text buttons; a copy failure falls back to a mailto.
*/
export function LiquidEmail() {
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
    <div className="contact-address">
      <span className="sr-only" aria-live="polite">
        {copied ? 'Email address copied' : ''}
      </span>

      <a href={`mailto:${ADDRESS}`} className="contact-address-line">
        {ADDRESS}
      </a>

      {/*
        These were an inline text button inside `.case-module-body`, which is
        now the big justified body treatment — a control stretched inside a
        40px justified paragraph. They are rectangular blocks in their own
        row instead.

        Starting a project is the primary action on this page, so it is the
        BIG FAT variant: same rectangle and same slight radius as the
        secondary beside it, much more mass, large label, plus the
        established arrow. The copy button stays at default size and the
        recessed tone, so emphasis comes from scale and fill rather than from
        shrinking the quieter label.
      */}
      <div className="contact-actions">
        <button type="button" onClick={copyAddress} className="btn btn-muted">
          {copied ? 'Copied' : 'Copy address'}
        </button>
        <a href={`mailto:${ADDRESS}`} className="btn btn-big btn-strong">
          Start a project
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    </div>
  )
}
