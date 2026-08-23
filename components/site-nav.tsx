'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { BrandMark } from '@/components/brand-mark'

/*
  FLOATING FROSTED NAVIGATION MODULE (desktop)

  This replaced a conventional full-width sticky header that held a
  horizontal row of four arrow links and a bottom hairline. All three of
  those are explicitly ruled out: no full-width header bar, no long
  horizontal row of links, no lines. What is wanted instead is ONE compact
  rectangular object floating in the upper-left, containing almost nothing.

  So the module holds two things only: the wordmark and `Menu`. Everything
  else lives inside the expansion.

  The expansion is the same physical object getting bigger — not a dropdown,
  not a sidebar, not a modal. That is why `width`/`height` are animated on
  the module itself rather than a child panel being revealed: the eye has to
  read it as one thing changing size.

  MOBILE: this module is hidden entirely. The bottom console owns mobile
  navigation, and shipping both would mean two competing nav systems on the
  same screen.
*/

const DESTINATIONS = [
  /*
    Deliberately DIFFERENT widths, set per item via `--w`. A menu of
    identical stacked rows is the generic pattern; a tight cluster of unequal
    blocks reads as an assembled composition. `Work` is the widest because it
    is the primary destination.

    `Ideas` is NOT here despite appearing in the reference menu: no such
    route exists, and a nav entry that 404s is worse than an imperfect match
    to the reference. These four are the pages that actually exist.
  */
  { label: 'Index', href: '/', w: '9.5rem' },
  { label: 'Work', href: '/work', w: '13rem' },
  { label: 'About', href: '/studio', w: '10.5rem' },
  { label: 'Contact', href: '/contact', w: '11.5rem' },
]

export function SiteNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const moduleRef = useRef<HTMLElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  /* Route change closes the module — the destination has been reached. */
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  /*
    While open: Escape closes and focus is kept inside the module. The page
    is NOT scroll-locked — the expansion is a small object in the corner, not
    a takeover, and freezing the whole document for it would be wrong.
  */
  useEffect(() => {
    if (!open) return

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
        return
      }

      if (event.key !== 'Tab') return

      const focusables = moduleRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      )
      if (!focusables || focusables.length === 0) return

      const first = focusables[0]
      const last = focusables[focusables.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <nav
      ref={moduleRef}
      aria-label="Primary"
      data-open={open}
      className="nav-module frost"
    >
      {/* The permanently visible bar: wordmark + trigger, nothing else. */}
      <div className="nav-module-head">
        <Link href="/" aria-label="Burgama, home" className="nav-module-brand">
          <BrandMark />
        </Link>

        <button
          ref={triggerRef}
          type="button"
          aria-expanded={open}
          aria-controls="nav-expansion"
          onClick={() => setOpen((value) => !value)}
          className="nav-module-trigger"
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </div>

      {/*
        The expansion's contents. `inert` when closed so the links are
        genuinely unreachable rather than merely invisible — tabIndex={-1}
        alone still leaves them in the a11y tree.
      */}
      <div
        id="nav-expansion"
        className="nav-expansion"
        {...(!open ? { inert: true as unknown as boolean } : {})}
      >
        <div className="nav-expansion-cluster">
          {DESTINATIONS.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
              /* Stagger index drives the blur-to-sharp resolve. */
              style={{ '--i': index, '--w': item.w } as React.CSSProperties}
              className={
                isActive(item.href) ? 'nav-dest is-current' : 'nav-dest'
              }
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/*
          The one weighted control in the expansion, and the reason the
          cluster above can stay quiet. Uses the shared button system with a
          proportion variant rather than a bespoke nav-only style.
        */}
        <Link
          href="/contact"
          style={{ '--i': DESTINATIONS.length } as React.CSSProperties}
          className="nav-dest-cta btn btn-strong btn--wide"
        >
          <span className="btn-shape" aria-hidden="true">
            <i className="btn-bar" />
            <i className="btn-bar-tab" />
            <i className="btn-bar-fil" />
            <i className="btn-chip-tongue" />
            <i className="btn-chip-fil" />
            <i className="btn-chip" />
          </span>
          <span className="btn-label">Start a Project</span>
          <span className="btn-arrow" aria-hidden="true">
            <svg viewBox="0 0 22 12" role="presentation">
              <path d="M1 6h19M15 1l5 5-5 5" />
            </svg>
          </span>
        </Link>
      </div>
    </nav>
  )
}
