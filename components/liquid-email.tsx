'use client'

import { useState } from 'react'
import { ModularButton } from '@/components/modular-button'

const ADDRESS = 'hello@burgama.com'

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

      <div className="contact-actions">
        <ModularButton onClick={copyAddress}>
          {copied ? 'copied' : 'copy address'}
        </ModularButton>
        <ModularButton href={`mailto:${ADDRESS}`}>start a project</ModularButton>
      </div>
    </div>
  )
}
