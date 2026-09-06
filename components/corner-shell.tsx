'use client'

import Link from '@/components/transition-link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { BurgamaMark } from '@/components/burgama-mark'

const destinations = [
  { label: 'work', href: '/work' },
  { label: 'studio', href: '/studio' },
  { label: 'contact', href: '/contact' },
]

export function CornerShell() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const trigger = useRef<HTMLButtonElement>(null)
  const header = useRef<HTMLElement>(null)

  useEffect(() => { setOpen(false) }, [pathname])
  useEffect(() => {
    if (!open) return
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') { setOpen(false); trigger.current?.focus() }
    }
    function onOutside(event: PointerEvent) {
      if (!header.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onOutside)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onOutside)
    }
  }, [open])

  if (pathname.startsWith('/lot-2046')) return null

  return (
    <header ref={header} className="site-header" data-menu-open={open}>
      <div className="header-inner">
        <Link href="/" aria-label="Burgama home" className="header-brand"><span className="brand-lockup"><BurgamaMark /></span></Link>
        <nav className="desktop-nav" aria-label="Primary">
          {destinations.slice(0, 2).map(item => <Link key={item.href} href={item.href} aria-current={pathname.startsWith(item.href) ? 'page' : undefined}>{item.label}</Link>)}
          <Link href="/contact" className="pill pill-small" aria-current={pathname === '/contact' ? 'page' : undefined}>let&apos;s talk</Link>
        </nav>
        <button ref={trigger} type="button" className="pill pill-small mobile-menu-trigger" aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>{open ? 'close' : 'menu'}</button>
      </div>
      <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile primary" hidden={!open} onBlur={event => {
        if (!header.current?.contains(event.relatedTarget as Node | null)) setOpen(false)
      }}>
        {destinations.map(item => <Link key={item.href} href={item.href} onClick={() => setOpen(false)} aria-current={pathname.startsWith(item.href) ? 'page' : undefined}>{item.label}</Link>)}
      </nav>
    </header>
  )
}
