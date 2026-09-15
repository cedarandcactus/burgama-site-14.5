'use client'

import Link from '@/components/transition-link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

const destinations = [
  { label: 'work', href: '/work' },
  { label: 'about', href: '/studio' },
  { label: 'ideas', href: '/ideas' },
  { label: 'start a project', href: '/contact', action: true },
]

export function CornerShell() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [condensed, setCondensed] = useState(pathname !== '/')
  const condensedRef = useRef(pathname !== '/')
  const trigger = useRef<HTMLButtonElement>(null)
  const header = useRef<HTMLElement>(null)

  function closeMenu({ restoreFocus = false } = {}) {
    const navigationHasFocus = header.current
      ?.querySelector('.header-nav')
      ?.contains(document.activeElement)

    if (restoreFocus || (condensedRef.current && navigationHasFocus)) {
      trigger.current?.focus({ preventScroll: true })
    }
    setOpen(false)
  }

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    const compactViewport = window.matchMedia('(max-width: 699px)')
    const compactLandscape = window.matchMedia('(max-width: 900px) and (max-height: 520px)')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0

    function commitCondensed(next: boolean) {
      if (condensedRef.current === next) return
      const activeElement = document.activeElement
      const navigationHasFocus = header.current?.querySelector('.header-nav')?.contains(activeElement)
      if ((next && navigationHasFocus) || (!next && activeElement === trigger.current)) {
        header.current?.querySelector<HTMLAnchorElement>('.cyan-header-mark-link')?.focus({ preventScroll: true })
      }
      condensedRef.current = next
      setCondensed(next)
      setOpen(false)
    }

    function update() {
      frame = 0
      const forcedCompact = pathname !== '/' || compactViewport.matches || compactLandscape.matches
      const next = forcedCompact
        ? true
        : condensedRef.current
          ? window.scrollY > 24
          : window.scrollY > 72

      commitCondensed(next)
      header.current?.style.setProperty(
        '--logo-turn',
        `${reducedMotion.matches || !next ? 0 : window.scrollY * 0.04}deg`,
      )
    }

    function scheduleUpdate() {
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate, { passive: true })
    compactViewport.addEventListener('change', scheduleUpdate)
    compactLandscape.addEventListener('change', scheduleUpdate)
    reducedMotion.addEventListener('change', scheduleUpdate)

    return () => {
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      compactViewport.removeEventListener('change', scheduleUpdate)
      compactLandscape.removeEventListener('change', scheduleUpdate)
      reducedMotion.removeEventListener('change', scheduleUpdate)
      window.cancelAnimationFrame(frame)
    }
  }, [pathname])

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

  const navigationVisible = !condensed || open

  return (
    <header
      ref={header}
      className="site-header cyan-header"
      data-home={pathname === '/'}
      data-condensed={condensed}
      data-menu-open={open}
      data-work={pathname.startsWith('/work')}
    >
      <div className="header-inner">
        <Link className="cyan-header-mark-link" href="/" aria-label="Home">
          <span className="cyan-header-mark" aria-hidden="true" />
        </Link>
        <button
          ref={trigger}
          type="button"
          className="cyan-menu-trigger font-serif"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="primary-navigation"
          aria-hidden={!condensed}
          tabIndex={condensed ? 0 : -1}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="cyan-menu-labels" aria-hidden="true">
            <span className="cyan-menu-label cyan-menu-label-menu">Menu</span>
            <span className="cyan-menu-label cyan-menu-label-close">Close</span>
          </span>
        </button>
        <div
          id="primary-navigation"
          className="header-nav-shell"
          aria-hidden={!navigationVisible}
          inert={!navigationVisible}
        >
          <nav aria-label="Primary" className="header-nav">
            {destinations.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={item.action ? 'header-contact' : undefined}
                onClick={() => closeMenu()}
                aria-current={pathname.startsWith(item.href) ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
