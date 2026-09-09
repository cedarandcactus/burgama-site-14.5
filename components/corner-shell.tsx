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
    <header ref={header} className="site-header cyan-header" data-home={pathname === '/'} data-menu-open={open} data-work={pathname === '/work' || pathname.startsWith('/work/')}>
      <div className="header-inner">
        <Link href="/" aria-label="Burgama home" className="header-brand"><span className="brand-lockup"><BurgamaMark /></span></Link>
        <button ref={trigger} type="button" className="font-serif cyan-menu-trigger" aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>{open ? 'close' : 'menu'}</button>
      </div>
      <nav id="mobile-navigation" className="mobile-nav" aria-label="Primary" hidden={!open} onBlur={event => {
        if (!header.current?.contains(event.relatedTarget as Node | null)) setOpen(false)
      }}>
        {destinations.map(item => <Link key={item.href} href={item.href} onClick={() => setOpen(false)} aria-current={pathname.startsWith(item.href) ? 'page' : undefined}>{item.label}</Link>)}
      </nav>
    </header>
  )
}
