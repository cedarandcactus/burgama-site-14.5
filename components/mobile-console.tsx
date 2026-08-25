'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { projects } from '@/lib/projects'
import { UpdatesSignup } from '@/components/corner-shell'
import { useScrollVelocity } from '@/components/use-scroll-velocity'

/*
  MOBILE BOTTOM CONTROL CONSOLE

  Mobile navigation is a dense frosted console anchored to the bottom of the
  screen — deliberately NOT a thin tab bar of tiny icon-and-label pairs, and
  not a hamburger. It is the primary control surface on the primary surface.

  Four behaviours make it what it is, and each is easy to lose:

  1. CONTEXT-AWARE. The modules change per route, so the console is about the
     page you are on rather than being a fixed global bar.
  2. MASS REDISTRIBUTION. Pressing a module makes it grow while its
     neighbours contract. The console's total width never changes — a fixed
     amount of material is reallocated. That is why this is `flex-grow` on
     siblings rather than a transform or a width animation.
  3. SCROLL RESPONSE. At speed it compacts slightly and goes more diffuse,
     then returns to full sharpness at rest. It NEVER hides — losing
     navigation on scroll is the failure mode being avoided.
  4. MENU GROWS UPWARD out of the console, over a page that stays visible.

  Replaces the old hamburger + slide-down panel entirely. Both cannot ship:
  two mobile navigation systems on one screen is worse than either alone.
*/

type Module = {
  label: string
  href?: string
  /* Relative resting mass. Modules are intentionally unequal. */
  grow: number
  /* Marks the one module that carries the arrow, if any. */
  lead?: boolean
}

function modulesFor(pathname: string): Module[] {
  /* A case study: move between projects, with real neighbours from the data. */
  const caseMatch = pathname.match(/^\/work\/([^/]+)$/)
  if (caseMatch) {
    const index = projects.findIndex((p) => p.slug === caseMatch[1])
    const previous = index > 0 ? projects[index - 1] : undefined
    const next = index >= 0 && index < projects.length - 1 ? projects[index + 1] : undefined

    return [
      { label: previous ? 'Previous' : 'All work', href: previous ? `/work/${previous.slug}` : '/work', grow: 3 },
      { label: `${index + 1} / ${projects.length}`, grow: 2 },
      { label: next ? 'Next' : 'Contact', href: next ? `/work/${next.slug}` : '/contact', grow: 3, lead: true },
    ]
  }

  if (pathname === '/work') {
    return [
      { label: 'Index', href: '/', grow: 3 },
      { label: `${projects.length} projects`, grow: 4 },
      { label: 'Start', href: '/contact', grow: 3, lead: true },
    ]
  }

  if (pathname === '/contact') {
    return [
      { label: 'Work With Us', grow: 5 },
      { label: 'See the Work', href: '/work', grow: 4, lead: true },
    ]
  }

  /* General case, including the homepage and /studio. */
  return [
    { label: 'Work', href: '/work', grow: 3 },
    { label: 'About', href: '/studio', grow: 3 },
    { label: 'Start', href: '/contact', grow: 4, lead: true },
  ]
}

const DESTINATIONS = [
  { label: 'Index', href: '/' },
  { label: 'Work', href: '/work' },
  { label: 'About', href: '/studio' },
  { label: 'Contact', href: '/contact' },
]

export function MobileConsole() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<number | null>(null)
  const consoleRef = useRef<HTMLDivElement>(null)

  /* Publishes --vel / --vdir; the console subscribes via CSS. */
  useScrollVelocity()

  useEffect(() => {
    setOpen(false)
    setActive(null)
  }, [pathname])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const modules = modulesFor(pathname)

  return (
    <div ref={consoleRef} className="mobile-console" data-open={open}>
      {/*
        The upward menu. It sits ABOVE the console in the DOM and is
        transform-origin: bottom, so it reads as material emerging from the
        console rather than a panel arriving from off-screen.
      */}
      <div
        id="console-menu"
        className="console-menu frost"
        {...(!open ? { inert: true as unknown as boolean } : {})}
      >
        {DESTINATIONS.map((item, index) => (
          <Link
            key={item.href}
            href={item.href}
            style={{ '--i': index } as React.CSSProperties}
            aria-current={
              (item.href === '/' ? pathname === '/' : pathname.startsWith(item.href))
                ? 'page'
                : undefined
            }
            className="console-dest"
          >
            {item.label}
          </Link>
        ))}

        {/*
          UPDATES ON MOBILE

          The desktop shell's bottom-left corner is desktop-only, so without
          this the signup would simply not exist below 900px. It lives inside
          the console's upward menu rather than becoming a fifth bar module:
          the bar is for navigation and one-tap actions, and a text field
          crammed into a redistributing flex row would be unusable.

          `UpdatesSignup` is imported from the shell so there is exactly ONE
          signup implementation. Two copies would drift the moment a real
          provider is wired in.
        */}
        <div className="console-updates">
          <UpdatesSignup idPrefix="console" />
        </div>
      </div>

      <div className="console-bar frost">
        {modules.map((module, index) => {
          const isActive = active === index
          const className = [
            'console-module',
            module.lead ? 'is-lead' : '',
            isActive ? 'is-active' : '',
            !module.href ? 'is-static' : '',
          ]
            .filter(Boolean)
            .join(' ')

          /*
            `--grow` is the resting mass. An active module's grow is boosted
            and, because all the siblings share one row, the others are
            squeezed automatically — no need to shrink them explicitly.
          */
          const style = {
            '--grow': isActive ? module.grow * 2.1 : module.grow,
          } as React.CSSProperties

          /* A module with no destination is a readout, not a control. */
          if (!module.href) {
            return (
              <p key={module.label} style={style} className={className}>
                {module.label}
              </p>
            )
          }

          return (
            <Link
              key={module.label}
              href={module.href}
              style={style}
              className={className}
              onPointerDown={() => setActive(index)}
              onPointerUp={() => setActive(null)}
              onPointerCancel={() => setActive(null)}
              onBlur={() => setActive(null)}
            >
              <span className="console-module-label">{module.label}</span>
              {module.lead ? (
                <span aria-hidden="true" className="console-module-arrow">
                  <svg viewBox="0 0 22 12" role="presentation">
                    <path d="M1 6h19M15 1l5 5-5 5" />
                  </svg>
                </span>
              ) : null}
            </Link>
          )
        })}

        {/* The menu trigger is its own module, weighted like the rest. */}
        <button
          type="button"
          aria-expanded={open}
          aria-controls="console-menu"
          onClick={() => setOpen((value) => !value)}
          style={{ '--grow': open ? 4 : 2 } as React.CSSProperties}
          className="console-module console-module-menu"
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </div>
    </div>
  )
}
