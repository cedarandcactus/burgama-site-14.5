'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { BrandMark } from '@/components/brand-mark'
import { projects } from '@/lib/projects'

/*
  THE BURGAMA SHELL — persistent four-corner interface (desktop)

  This replaces the single floating upper-left nav module. The idea it is
  built on: the corners are the STABLE Burgama object and the content
  underneath is what changes. Scrolling moves the site; the shell stays put
  and only re-tints.

  The four corners, and why each one exists:

    top-left      wordmark — identity and the route home
    top-right     Menu — the site's destinations
    bottom-left   Email / Updates — expands in place, never navigates away
    bottom-right  CONTEXTUAL — a real action for the current route

  The bottom-right corner is the one that could easily have gone wrong. The
  rule followed here is that it is contextual rather than decorative: it
  carries the genuinely useful next action per route, and on `/contact` it
  DISAPPEARS, because there is no useful onward action from the page that is
  already the destination. A corner is left empty rather than filled with an
  invented control — the brief rules out inventing controls just to occupy
  all four positions, and a fourth corner holding a fake action would be
  worse than three corners holding real ones.

  MOBILE: hidden entirely. The bottom console owns mobile navigation and has
  absorbed the Updates function. Shipping both would mean two competing
  navigation systems on one screen.
*/

const DESTINATIONS = [
  /*
    Deliberately DIFFERENT widths, set per item via `--w`. A menu of
    identical stacked rows is the generic pattern; a cluster of unequal
    blocks reads as an assembled composition. `Work` is widest because it is
    the primary destination.

    Only routes that actually exist. `/lot-2046` is deliberately absent — it
    is off-system and self-contained.
  */
  { label: 'Index', href: '/', w: '11rem' },
  { label: 'Work', href: '/work', w: '15rem' },
  { label: 'About', href: '/studio', w: '12rem' },
  { label: 'Contact', href: '/contact', w: '13rem' },
]

type CornerAction = { label: string; href: string } | null

/*
  The contextual bottom-right action. Returns `null` where no action is
  genuinely useful, and the corner then renders nothing at all.
*/
function actionFor(pathname: string): CornerAction {
  /*
    On a project page the useful action is the next project — real data,
    since every project carries `nextProjectSlug`.
  */
  const caseMatch = pathname.match(/^\/work\/([^/]+)$/)
  if (caseMatch) {
    const current = projects.find((p) => p.slug === caseMatch[1])
    if (current?.nextProjectSlug) {
      return { label: 'Next Project', href: `/work/${current.nextProjectSlug}` }
    }
    return { label: 'All Work', href: '/work' }
  }

  /* On the work index the useful move is back out to the site index. */
  if (pathname === '/work') return { label: 'Index', href: '/' }

  /* From the studio page, the onward action is getting in touch. */
  if (pathname === '/studio') return { label: 'Contact', href: '/contact' }

  /*
    Already at the destination. Nothing useful to offer, so the corner is
    empty — see the note above about not inventing a control.
  */
  if (pathname === '/contact') return null

  /* Homepage and anything else. */
  return { label: 'Start a Project', href: '/contact' }
}

/*
  Traps Tab inside an expanded module and closes it on Escape. Both the menu
  and the updates panel need exactly this, and duplicating it in two places
  is how the two drift apart.

  The page is NOT scroll-locked: these are corner objects, not takeovers, and
  freezing the document for a corner expansion would be wrong.
*/
function useExpansion(
  open: boolean,
  close: () => void,
  containerRef: React.RefObject<HTMLElement | null>,
  triggerRef: React.RefObject<HTMLButtonElement | null>,
) {
  useEffect(() => {
    if (!open) return

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close()
        triggerRef.current?.focus()
        return
      }

      if (event.key !== 'Tab') return

      const focusables = containerRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled])',
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
  }, [open, close, containerRef, triggerRef])
}

export function CornerShell() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [updatesOpen, setUpdatesOpen] = useState(false)

  const menuRef = useRef<HTMLElement>(null)
  const menuTrigger = useRef<HTMLButtonElement>(null)
  const updatesRef = useRef<HTMLDivElement>(null)
  const updatesTrigger = useRef<HTMLButtonElement>(null)

  /* Route change closes everything — the destination has been reached. */
  useEffect(() => {
    setMenuOpen(false)
    setUpdatesOpen(false)
  }, [pathname])

  /*
    Only one expansion at a time. Two open corners would read as a UI that
    has lost track of itself rather than as one object responding.
  */
  const openMenu = (next: boolean) => {
    setMenuOpen(next)
    if (next) setUpdatesOpen(false)
  }
  const openUpdates = (next: boolean) => {
    setUpdatesOpen(next)
    if (next) setMenuOpen(false)
  }

  useExpansion(menuOpen, () => setMenuOpen(false), menuRef, menuTrigger)
  useExpansion(
    updatesOpen,
    () => setUpdatesOpen(false),
    updatesRef,
    updatesTrigger,
  )

  /*
    `/lot-2046` is intentionally off-system with its own hidden navigation.
    The shell must not appear there.
  */
  if (pathname.startsWith('/lot-2046')) return null

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  const action = actionFor(pathname)

  return (
    <div className="shell">
      {/* ---- top-left: identity ---- */}
      <div className="shell-corner shell-corner--tl">
        <Link href="/" aria-label="Burgama, home" className="shell-brand frost">
          <BrandMark />
        </Link>
      </div>

      {/* ---- top-right: destinations ---- */}
      <nav
        ref={menuRef}
        aria-label="Primary"
        data-open={menuOpen}
        className="shell-corner shell-corner--tr shell-menu frost"
      >
        {/*
          The trigger stays in place and the module grows around it, so the
          expansion reads as ONE object redistributing its own material
          rather than a panel appearing underneath a button. That is why the
          width/height animate on `.shell-menu` itself and the list is a
          child that is revealed, not a positioned dropdown.
        */}
        <button
          ref={menuTrigger}
          type="button"
          aria-expanded={menuOpen}
          aria-controls="shell-menu-list"
          onClick={() => openMenu(!menuOpen)}
          className="shell-control shell-menu-trigger"
        >
          {menuOpen ? 'Close' : 'Menu'}
        </button>

        <div
          id="shell-menu-list"
          className="shell-menu-list"
          {...(!menuOpen ? { inert: true as unknown as boolean } : {})}
        >
          {DESTINATIONS.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
              style={{ '--i': index, '--w': item.w } as React.CSSProperties}
              className={
                isActive(item.href) ? 'shell-dest is-current' : 'shell-dest'
              }
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* ---- bottom-left: email / updates ---- */}
      <div
        ref={updatesRef}
        data-open={updatesOpen}
        className="shell-corner shell-corner--bl shell-updates frost"
      >
        <button
          ref={updatesTrigger}
          type="button"
          aria-expanded={updatesOpen}
          aria-controls="shell-updates-panel"
          onClick={() => openUpdates(!updatesOpen)}
          className="shell-control shell-updates-trigger"
        >
          {updatesOpen ? 'Close' : 'Updates'}
        </button>

        <div
          id="shell-updates-panel"
          className="shell-updates-panel"
          {...(!updatesOpen ? { inert: true as unknown as boolean } : {})}
        >
          <UpdatesForm />
        </div>
      </div>

      {/* ---- bottom-right: contextual action, or nothing ---- */}
      {action ? (
        <div className="shell-corner shell-corner--br">
          <Link href={action.href} className="btn btn-strong shell-action">
            <span className="btn-shape" aria-hidden="true">
              <i className="btn-bar" />
              <i className="btn-bar-tab" />
              <i className="btn-bar-fil" />
              <i className="btn-chip-tongue" />
              <i className="btn-chip-fil" />
              <i className="btn-chip" />
            </span>
            <span className="btn-label">{action.label}</span>
            <span className="btn-arrow" aria-hidden="true">
              <svg viewBox="0 0 22 12" role="presentation">
                <path d="M1 6h19M15 1l5 5-5 5" />
              </svg>
            </span>
          </Link>
        </div>
      ) : null}
    </div>
  )
}

/*
  The signup surface. Deliberately just: field, consent line, submit, close
  state. No marketing copy, no benefit list, no illustration, no second
  field — none of that content exists, and inventing it is exactly what the
  brief rules out.
*/
function UpdatesForm() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>(
    'idle',
  )

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (state === 'sending') return

    setState('sending')
    try {
      const response = await fetch('/api/updates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!response.ok) throw new Error('subscribe failed')
      setState('done')
      setEmail('')
    } catch {
      setState('error')
    }
  }

  if (state === 'done') {
    return (
      <p className="shell-updates-done" role="status">
        You are on the list.
      </p>
    )
  }

  return (
    <form onSubmit={onSubmit} className="shell-updates-form">
      <label htmlFor="shell-updates-email" className="sr-only">
        Email address
      </label>
      <input
        id="shell-updates-email"
        type="email"
        name="email"
        required
        autoComplete="email"
        placeholder="you@studio.com"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        className="shell-updates-input"
      />

      <button
        type="submit"
        disabled={state === 'sending'}
        className="shell-updates-submit"
      >
        {state === 'sending' ? 'Sending' : 'Sign up'}
      </button>

      <p className="shell-updates-note">
        Occasional notes on the work. Unsubscribe any time.
      </p>

      {state === 'error' ? (
        <p className="shell-updates-error" role="alert">
          That didn&apos;t send. Try again.
        </p>
      ) : null}
    </form>
  )
}
