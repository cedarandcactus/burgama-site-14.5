'use client'

import { useState } from 'react'
import { ModularButton } from '@/components/modular-button'

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
        Two action buttons in one group, so they share ONE tone and ONE
        geometry and differ only in label, and therefore in width.

        Both now carry the arrow region — it is structural to the button, not
        a navigation signal, so the copy control gets it too. The copy label
        swaps to "Copied", so its width changes on click, which is correct
        behaviour for a content-driven width.
      */}
      <div className="contact-actions">
        <ModularButton onClick={copyAddress}>
          {copied ? 'Copied' : 'Copy address'}
        </ModularButton>
        <ModularButton href={`mailto:${ADDRESS}`}>Start a project</ModularButton>
      </div>
    </div>
  )
}
