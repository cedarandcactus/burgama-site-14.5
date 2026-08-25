import Link from 'next/link'
import type { ReactNode } from 'react'

/**
 * IconControl — a substantial icon-only utility control.
 *
 * The whole point is the ratio: a 56–60px surface carrying a ~20px glyph, so
 * the control reads as a small physical module inside a large architectural
 * interface rather than as a tiny icon button. The icon is deliberately much
 * smaller than its container — spacious, not filled.
 *
 * Rounded to ~18px, NOT circular and NOT a pill, per the control rules.
 *
 * `label` is required and always rendered for assistive tech. That is the
 * trade for omitting visible text: an icon-only control with no accessible
 * name is invisible to a screen reader, so the type makes it impossible to
 * forget rather than leaving it to review.
 */
type Props = {
  label: string
  children: ReactNode
  href?: string
  onClick?: () => void
  /** `strong` inverts to the ink fill for the one primary action per act. */
  tone?: 'quiet' | 'strong'
  className?: string
}

export function IconControl({
  label,
  children,
  href,
  onClick,
  tone = 'quiet',
  className = '',
}: Props) {
  const cls = `icontrol icontrol--${tone} ${className}`.trim()

  const inner = (
    <>
      <span className="icontrol-glyph" aria-hidden="true">
        {children}
      </span>
      <span className="sr-only">{label}</span>
    </>
  )

  if (href) {
    const external = href.startsWith('http') || href.startsWith('mailto:')
    if (external) {
      return (
        <a
          href={href}
          className={cls}
          {...(href.startsWith('http')
            ? { target: '_blank', rel: 'noreferrer' }
            : {})}
        >
          {inner}
        </a>
      )
    }
    return (
      <Link href={href} className={cls}>
        {inner}
      </Link>
    )
  }

  return (
    <button type="button" className={cls} onClick={onClick}>
      {inner}
    </button>
  )
}
