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
        Two action buttons in one group, so per the button-system rules they
        share ONE tone and ONE geometry — the earlier version made "Start a
        project" a larger, paler "primary" beside a recessed secondary, which
        is exactly the per-button differentiation the rules disallow. They now
        differ only in label, and therefore in width.

        Only the link carries the arrow: the glyph signals navigation, and
        putting it on the copy button (which stays on the page) would make it
        decoration. The copy button's label also swaps to "Copied", so its
        width changes on click — correct behaviour for a content-driven width.
      */}
      <div className="contact-actions">
        <button type="button" onClick={copyAddress} className="btn btn-muted">
          {copied ? 'Copied' : 'Copy address'}
        </button>
        <a href={`mailto:${ADDRESS}`} className="btn btn-muted">
          Start a project
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    </div>
  )
}
