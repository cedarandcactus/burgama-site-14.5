'use client'

import Link from '@/components/transition-link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { BurgamaMark } from '@/components/burgama-mark'

const destinations = [
  { label: 'Work', href: '/work' },
  { label: 'Studio', href: '/studio' },
  { label: 'Contact', href: '/contact' },
]

export function CornerShell() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const trigger = useRef<HTMLButtonElement>(null)
  const header = useRef<HTMLElement>(null)

  function closeMenu({ restoreFocus = false } = {}) {
    setOpen(false)
    if (restoreFocus) trigger.current?.focus()
  }

  useEffect(() => { setOpen(false) }, [pathname])

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    function update() {
      frame = 0
      header.current?.style.setProperty('--logo-turn', `${media.matches ? 0 : window.scrollY * .04}deg`)
    }
    function scroll() { if (!frame) frame = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', scroll, { passive: true })
    media.addEventListener('change', update)
    return () => {
      window.removeEventListener('scroll', scroll)
      media.removeEventListener('change', update)
      cancelAnimationFrame(frame)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeMenu({ restoreFocus: true })
      }
    }
    function onPointerDown(event: PointerEvent) {
      if (!header.current?.contains(event.target as Node)) closeMenu()
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [open])

  if (pathname.startsWith('/lot-2046')) return null

  return (
    <header ref={header} className="site-header cyan-header" data-home={pathname === '/'} data-menu-open={open} data-work={pathname.startsWith('/work')}>
      <div className="header-inner">
        <Link href="/" aria-label="Burgama home" className="header-brand" onClick={() => closeMenu()}>
          <span className="brand-lockup"><BurgamaMark /></span>
        </Link>
        <div id="primary-navigation" className="header-nav-shell" aria-hidden={!open} inert={!open}>
          <nav aria-label="Primary" className="header-nav">
            {destinations.map(item => (
              <Link key={item.href} href={item.href} onClick={() => closeMenu()} aria-current={pathname.startsWith(item.href) ? 'page' : undefined}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <button
          ref={trigger}
          type="button"
          className="cyan-menu-trigger font-serif"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="primary-navigation"
          onClick={() => setOpen(value => !value)}
        >
          <span className="cyan-menu-labels" aria-hidden="true">
            <span className="cyan-menu-label cyan-menu-label-menu">Menu</span>
            <span className="cyan-menu-label cyan-menu-label-close">Close</span>
          </span>
        </button>
      </div>
    </header>
  )
}
