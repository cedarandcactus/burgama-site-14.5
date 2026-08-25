'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { BrandMark } from '@/components/brand-mark'
import { useScrollVelocity } from '@/components/use-scroll-velocity'
import { projects } from '@/lib/projects'

/*
  THE BURGAMA SHELL — one persistent four-corner interface, all breakpoints

  The corners are the stable Burgama object; the content underneath is what
  changes. Scrolling moves the site, the shell stays put and only re-tints.

    top-left      mark + wordmark — identity and the route home
    top-right     Menu — the site's destinations
    bottom-left   Sign Up — opens the email panel
    bottom-right  CONTEXTUAL — a real action for the current route

  THIS IS NOW THE ONLY NAVIGATION SYSTEM. It previously went `display: none`
  below 760px and a separate `MobileConsole` — a bottom bar of redistributing
  flex modules with its own upward menu and its own copy of the signup — took
  over. That was two navigation systems with two sets of behaviour to keep in
  sync, and the mobile one had drifted: different labels, different geometry,
  different interaction model. The console is deleted and this shell runs
  everywhere, with geometry that scales instead of a second implementation.

  It also inherits the console's one genuinely global job: publishing the
  scroll-velocity variables that site-wide motion blur reads. That call moved
  here because this component is the one that is always mounted.

  Two rules worth keeping in mind when editing:

  - The bottom-right corner is contextual, not decorative. On `/contact` it
    DISAPPEARS, because there is no useful onward action from the page that is
    already the destination. A corner is left empty rather than filled with an
    invented control.
  - The menu and the signup panel are corner objects, not modals. They can be
    open at the same time, neither dismisses the other, there is no scrim, and
    the page is never scroll-locked.
*/

/*
  Only routes that actually exist. `/lot-2046` is deliberately absent — it is
  off-system and self-contained.
*/
const DESTINATIONS = [
  { label: 'Index', href: '/' },
  { label: 'Work', href: '/work' },
  { label: 'About', href: '/studio' },
  { label: 'Contact', href: '/contact' },
]

type CornerAction = { label: string; href: string } | null

/*
  The contextual bottom-right action. Returns `null` where no action is
  genuinely useful, and the corner then renders nothing at all.
*/
function actionFor(pathname: string): CornerAction {
  /*
    On a project page the useful action is the next project — real data, since
    every project carries `nextProjectSlug`.
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

/* The form the bottom-left control submits. Shared id, declared once. */
const SIGNUP_FORM_ID = 'shell-signup-form'

export function CornerShell() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [panelOpen, setPanelOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>(
    'idle',
  )

  const panelRef = useRef<HTMLDivElement>(null)
  const signupTrigger = useRef<HTMLButtonElement>(null)

  /* Publishes --vel / --vdir for the site's motion blur; see the note above. */
  useScrollVelocity()

  /* Route change closes everything — the destination has been reached. */
  useEffect(() => {
    setMenuOpen(false)
    setPanelOpen(false)
  }, [pathname])

  /*
    Escape closes whatever is open. No focus trap: these are corner objects
    sitting over a live page, not modals, and both can be open at once — a
    trap would have to arbitrate between two simultaneous "traps" and would
    also strand the keyboard away from the page content behind them.
  */
  useEffect(() => {
    if (!menuOpen && !panelOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setMenuOpen(false)
      setPanelOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [menuOpen, panelOpen])

  /*
    Tapping outside the panel closes it. The trigger is excluded so its own
    click is not counted here and then again by its onClick, which would
    toggle twice and leave the panel stuck shut.
  */
  useEffect(() => {
    if (!panelOpen) return
    const onDown = (event: PointerEvent) => {
      const target = event.target as Node
      if (panelRef.current?.contains(target)) return
      if (signupTrigger.current?.contains(target)) return
      setPanelOpen(false)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [panelOpen])

  /*
    `/lot-2046` is intentionally off-system with its own hidden navigation.
    The shell must not appear there.
  */
  if (pathname.startsWith('/lot-2046')) return null

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  const action = actionFor(pathname)

  /*
    The bottom-left control has two jobs in one position. With the panel open
    and the field filled it becomes the submit; otherwise it is the toggle.
    It does this via the `form` attribute rather than by moving a button into
    the panel, because the panel's interior is specified as label + field and
    nothing else — and a real `type="submit"` outside the form is the standard
    way to say that.
  */
  const canSubmit = panelOpen && email.trim().length > 0

  const signupLabel =
    state === 'sending'
      ? 'Sending'
      : state === 'done'
        ? 'Received'
        : state === 'error'
          ? 'Try Again'
          : 'Sign Up'

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
      setPanelOpen(false)
    } catch {
      setState('error')
    }
  }

  return (
    <div className="shell">
      {/* ---- top-left: identity ---- */}
      <div className="shell-corner shell-corner--tl">
        <Link href="/" aria-label="Burgama, home" className="shell-brand frost">
          <BrandMark withMark />
        </Link>
      </div>

      {/* ---- top-right: destinations ---- */}
      <nav
        aria-label="Primary"
        data-open={menuOpen}
        className="shell-corner shell-corner--tr shell-menu"
      >
        <button
          type="button"
          aria-expanded={menuOpen}
          aria-controls="shell-menu-list"
          onClick={() => setMenuOpen((value) => !value)}
          className="shell-control shell-menu-trigger frost"
        >
          <span className="shell-control-label">
            {menuOpen ? 'Close' : 'Menu'}
          </span>
          {/*
            Three rules, not a decorative motif. The label carries the
            meaning; this is the affordance that says the control opens.
          */}
          <span className="shell-burger" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        </button>

        {/*
          The rows animate as ONE group — the container scales and fades, the
          rows themselves have no individual transition or per-index delay.
          They are right-aligned under the trigger and share the corner's
          width, so trigger and rows read as a single column of material.
        */}
        <div
          id="shell-menu-list"
          className="shell-menu-list"
          {...(!menuOpen ? { inert: true as unknown as boolean } : {})}
        >
          {DESTINATIONS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
              className={
                isActive(item.href)
                  ? 'shell-dest frost is-current'
                  : 'shell-dest frost'
              }
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      {/*
        ---- the signup panel ----

        Rendered as its own fixed surface spanning inset-to-inset, NOT inside
        the bottom-left corner. It has to reach the right inset and carry a
        larger radius than the controls, so it cannot be a child of a
        corner-anchored control box. The bottom row stays visible and in place
        above it the whole time.
      */}
      <div
        ref={panelRef}
        data-open={panelOpen}
        className="shell-panel frost"
        {...(!panelOpen ? { inert: true as unknown as boolean } : {})}
      >
        <form id={SIGNUP_FORM_ID} onSubmit={onSubmit} className="shell-panel-form">
          {/*
            A real label at editorial scale, not a placeholder and not a
            micro-label. Nothing else lives in here: no submit, no close, no
            heading, no consent line, no second field.
          */}
          <label htmlFor="shell-signup-email" className="shell-panel-label">
            Email
          </label>
          <input
            id="shell-signup-email"
            type="email"
            name="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="shell-panel-input"
          />
        </form>
      </div>

      {/* ---- bottom-left: sign up ---- */}
      <div className="shell-corner shell-corner--bl">
        <button
          ref={signupTrigger}
          type={canSubmit ? 'submit' : 'button'}
          form={canSubmit ? SIGNUP_FORM_ID : undefined}
          aria-expanded={panelOpen}
          aria-controls="shell-signup-panel"
          disabled={state === 'sending'}
          onClick={
            canSubmit ? undefined : () => setPanelOpen((value) => !value)
          }
          className="shell-control shell-signup frost"
        >
          <span className="shell-control-label">{signupLabel}</span>
        </button>
      </div>

      {/* ---- bottom-right: contextual action, or nothing ---- */}
      {action ? (
        <div className="shell-corner shell-corner--br">
          <Link href={action.href} className="shell-control shell-action frost">
            <span className="shell-control-label">{action.label}</span>
          </Link>
        </div>
      ) : null}

      {/*
        The panel interior is specified as label + field only, so the result
        of a submission is announced here instead of being printed inside it.
        Visually hidden; the corner control's own label is the visible state.

        Worded to be TRUE of what actually happens right now: no mailing
        provider is connected, so the endpoint validates the address and
        records it server-side but does not add anyone to a list. Change this
        at the same time as wiring a provider.
      */}
      <p className="sr-only" role="status" aria-live="polite">
        {state === 'done'
          ? 'Address received. Thank you.'
          : state === 'error'
            ? 'That did not send. Try again.'
            : ''}
      </p>
    </div>
  )
}
