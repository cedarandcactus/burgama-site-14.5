'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { BrandMark } from '@/components/brand-mark'

/*
  The reference nav reads `Index ↗ Work ↗ About ↗ Ideas ↗`. Those labels are
  kept only where a real page answers to them: "Index" is the homepage and
  "About" is the studio page. "Ideas" has no route on this site, and adding a
  nav item that goes nowhere is worse than not matching the reference, so the
  fourth slot is Contact — a page that exists.
*/
const LINKS = [
  { label: 'Index', href: '/' },
  { label: 'Work', href: '/work' },
  { label: 'About', href: '/studio' },
  { label: 'Contact', href: '/contact' },
]

export function SiteNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = ''
    }
  }, [open])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href.split('#')[0])

  return (
    <nav aria-label="Primary" className="site-nav">
      {/*
        Two positions only: wordmark left, inline arrow links right. The
        separate "Start a project" pill is gone — Contact is now one of the
        links, and a pill beside them would be a second competing CTA.
      */}
      <div className="site-nav-row">
        <Link href="/" aria-label="Burgama, home" className="site-nav-brand">
          <BrandMark />
        </Link>

        <p className="site-nav-index">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? 'page' : undefined}
              className={isActive(link.href) ? 'site-nav-link is-current' : 'site-nav-link'}
            >
              {link.label}
              {/* Decorative: the arrow is part of the mark, not information. */}
              <span aria-hidden="true" className="site-nav-arrow">
                ↗
              </span>
            </Link>
          ))}
        </p>

        <button
          type="button"
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpen((value) => !value)}
          className="site-nav-toggle"
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </div>

      <div id="site-menu" aria-hidden={!open} data-open={open} className="site-nav-panel">
        <div className="site-nav-panel-inner">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              tabIndex={open ? 0 : -1}
              className="site-nav-panel-link"
            >
              {link.label}
            </Link>
          ))}
          {/*
            The "Start a project" entry was removed: it pointed at /contact,
            which is already the fourth link above, so the mobile menu listed
            the same destination twice under two names.
          */}
        </div>
      </div>
    </nav>
  )
}
