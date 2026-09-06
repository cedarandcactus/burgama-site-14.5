import Link from '@/components/transition-link'
import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  tone?: 'default' | 'strong'
  className?: string
  wide?: boolean
} & (
  | { href: string; onClick?: never; type?: never }
  | { href?: never; onClick: () => void; type?: 'button' | 'submit' }
)

export function ModularButton({ children, className = '', wide = false, href, onClick, type = 'button' }: Props) {
  const cls = `pill ${wide ? 'pill-wide' : ''} ${className}`
  if (href) return href.startsWith('mailto:') || href.startsWith('http')
    ? <a href={href} className={cls}>{children}</a>
    : <Link href={href} className={cls}>{children}</Link>
  return <button type={type} onClick={onClick} className={cls}>{children}</button>
}
