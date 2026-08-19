'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { BrandMark } from '@/components/brand-mark'

const LINKS = [
  { label: 'Work', href: '/work' },
  { label: 'Studio', href: '/studio' },
  { label: 'Capabilities', href: '/studio#capabilities' },
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
      {/* Three fixed positions across the full page width: brand, index, contact. */}
      <div className="site-nav-row">
        <Link href="/" aria-label="Burgama, home" className="site-nav-brand">
          <BrandMark />
        </Link>

        {/* The index reads as one continuous line, comma separated. */}
        <p className="site-nav-index">
          {LINKS.map((link, index) => (
            <span key={link.href}>
              <Link
                href={link.href}
                aria-current={isActive(link.href) ? 'page' : undefined}
                className={isActive(link.href) ? 'site-nav-link is-current' : 'site-nav-link'}
              >
                {link.label}
              </Link>
              {index < LINKS.length - 1 ? ', ' : null}
            </span>
          ))}
        </p>

        <Link href="/contact" className="site-nav-contact">
          Start a project
        </Link>

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
          <Link href="/contact" tabIndex={open ? 0 : -1} className="site-nav-panel-link">
            Start a project
          </Link>
        </div>
      </div>
    </nav>
  )
}
