import Link from 'next/link'
import type { ReactNode } from 'react'

/**
 * ModularButton — the site's ONE action button.
 *
 * A label body joined to a distinct arrow region by the same stepped seam the
 * large fields use, so the control is a micro version of the page
 * architecture rather than a generic CTA.
 *
 * There is exactly one size. Width follows the label; height, text size,
 * radius, arrow region and visual mass never change. Do not add size props.
 *
 * The six shape pieces live here so no page assembles them by hand — getting
 * the fillet count or seam side wrong produces a visibly broken joint.
 */

const ARROW = (
  <span className="btn-arrow" aria-hidden="true">
    {/*
      A drawn arrow module, not the ↗ text glyph. It fills the arrow region as
      a piece of geometry and scales with the region rather than with the font.
    */}
    <svg viewBox="0 0 26 12" role="presentation">
      <path d="M1 6h23M20.5 2.2 24.3 6 20.5 9.8" />
    </svg>
  </span>
)

function Shape() {
  return (
    <span className="btn-shape" aria-hidden="true">
      <i className="btn-bar" />
      <i className="btn-bar-tab" />
      <i className="btn-bar-fil" />
      <i className="btn-chip-tongue" />
      <i className="btn-chip-fil" />
      <i className="btn-chip" />
    </span>
  )
}

type Common = {
  children: ReactNode
  /** Page-level tonal treatment. Apply to a whole group, never one button. */
  tone?: 'default' | 'strong'
  className?: string
}

type ModularButtonProps = Common &
  (
    | { href: string; onClick?: never; type?: never }
    | { href?: never; onClick: () => void; type?: 'button' | 'submit' }
  )

export function ModularButton({
  children,
  tone = 'default',
  className = '',
  href,
  onClick,
  type = 'button',
}: ModularButtonProps) {
  const cls = `btn ${tone === 'strong' ? 'btn-strong' : ''} ${className}`.trim()

  const inner = (
    <>
      <Shape />
      <span className="btn-label">{children}</span>
      {ARROW}
    </>
  )

  /*
    The arrow region is STRUCTURAL, so it is present on every action button
    including ones that do not navigate. This reverses an earlier reading in
    which the arrow was treated as a navigation-only signal and omitted from
    the copy-to-clipboard control: under the button rules the region is part
    of what makes the component a button at all, and a button missing it
    would be a second, inconsistent design.
  */
  if (href) {
    const external = href.startsWith('mailto:') || href.startsWith('http')
    return external ? (
      <a href={href} className={cls}>
        {inner}
      </a>
    ) : (
      <Link href={href} className={cls}>
        {inner}
      </Link>
    )
  }

  return (
    <button type={type} onClick={onClick} className={cls}>
      {inner}
    </button>
  )
}
