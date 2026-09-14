'use client'

import type { ButtonHTMLAttributes, ReactNode } from 'react'
import Link from '@/components/transition-link'

type Props = {
  children: ReactNode
  href?: string
  onClick?: () => void
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type']
  disabled?: boolean
  tone?: 'dark' | 'light'
  wide?: boolean
}

export function ModularButton({
  children,
  href,
  onClick,
  type = 'button',
  disabled,
  wide = false,
}: Props) {
  const className = `pill modular-button${wide ? ' pill-wide' : ''}`

  if (href) {
    return <Link href={href} className={className}>{children}</Link>
  }

  return <button type={type} className={className} onClick={onClick} disabled={disabled}>{children}</button>
}
