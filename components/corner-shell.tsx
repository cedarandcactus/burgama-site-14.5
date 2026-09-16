'use client'

import Link from '@/components/transition-link'
import { NavProjectForm } from '@/components/nav-project-form'
import { usePathname } from 'next/navigation'
import { useEffect, useId, useRef, useState } from 'react'

const destinations = [
  { label: 'work', href: '/work' },
  { label: 'about', href: '/studio' },
  { label: 'research', href: '/research' },
]

export function CornerShell() {
  const pathname = usePathname()
  const enquiryId = `nav-project-${useId()}`
  const [open, setOpen] = useState(false)
  const [projectOpen, setProjectOpen] = useState(false)
  const projectOpenRef = useRef(false)
  const [condensed, setCondensed] = useState(pathname !== '/')
  const condensedRef = useRef(pathname !== '/')
  const trigger = useRef<HTMLButtonElement>(null)
  const projectTrigger = useRef<HTMLButtonElement>(null)
  const header = useRef<HTMLElement>(null)

  const [symbolVisible, setSymbolVisible] = useState(false)
  const symbolVisibleRef = useRef(false)

  function closeMenu({ restoreFocus = false } = {}) {
    const navigationHasFocus = header.current?.querySelector('.header-nav')?.contains(document.activeElement)
    if (restoreFocus || (condensedRef.current && navigationHasFocus)) {
      trigger.current?.focus({ preventScroll: true })
    }
    setOpen(false)
  }

  function openProject() {
    projectOpenRef.current = true
    setProjectOpen(true)
    setOpen(true)
  }

  function closeProject({ toMenu = false, restoreFocus = false } = {}) {
    projectOpenRef.current = false
    const nextCondensed = pathname !== '/'
      || window.matchMedia('(max-width: 699px)').matches
      || window.matchMedia('(max-width: 900px) and (max-height: 520px)').matches
      || window.scrollY > (condensedRef.current ? 24 : 72)
    condensedRef.current = nextCondensed
    setCondensed(nextCondensed)
    setProjectOpen(false)
    setOpen(toMenu)
    if (restoreFocus) {
      requestAnimationFrame(() => {
        const target = toMenu || !nextCondensed ? projectTrigger.current : trigger.current
        target?.focus({ preventScroll: true })
      })
    }
  }

  useEffect(() => {
    projectOpenRef.current = false
    setProjectOpen(false)
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    const compactViewport = window.matchMedia('(max-width: 699px)')
    const compactLandscape = window.matchMedia('(max-width: 900px) and (max-height: 520px)')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0

    function commitCondensed(next: boolean) {
      if (projectOpenRef.current || condensedRef.current === next) return
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
      const next = forcedCompact ? true : window.scrollY > (condensedRef.current ? 24 : 72)
      commitCondensed(next)
      const nextSymbol = window.scrollY > (symbolVisibleRef.current ? 4 : 12)
      if (nextSymbol !== symbolVisibleRef.current) {
        symbolVisibleRef.current = nextSymbol
        setSymbolVisible(nextSymbol)
      }
      header.current?.style.setProperty('--logo-turn', `${reducedMotion.matches || !nextSymbol ? 0 : window.scrollY * 0.04}deg`)
      header.current?.style.setProperty('--header-viewport-height', `${window.visualViewport?.height ?? window.innerHeight}px`)
    }

    function scheduleUpdate() {
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate, { passive: true })
    window.visualViewport?.addEventListener('resize', scheduleUpdate)
    compactViewport.addEventListener('change', scheduleUpdate)
    compactLandscape.addEventListener('change', scheduleUpdate)
    reducedMotion.addEventListener('change', scheduleUpdate)
    return () => {
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      window.visualViewport?.removeEventListener('resize', scheduleUpdate)
      compactViewport.removeEventListener('change', scheduleUpdate)
      compactLandscape.removeEventListener('change', scheduleUpdate)
      reducedMotion.removeEventListener('change', scheduleUpdate)
      window.cancelAnimationFrame(frame)
    }
  }, [pathname])

  useEffect(() => {
    if (!open && !projectOpen) return
    function onKey(event: KeyboardEvent) {
      if (event.key !== 'Escape' || event.isComposing || event.keyCode === 229) return
      event.preventDefault()
      if (projectOpenRef.current) closeProject({ toMenu: true, restoreFocus: true })
      else closeMenu({ restoreFocus: true })
    }
    function onPointerDown(event: PointerEvent) {
      if (header.current?.contains(event.target as Node)) return
      if (projectOpenRef.current) {
        closeProject({ restoreFocus: header.current?.contains(document.activeElement) })
      } else closeMenu()
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [open, projectOpen, pathname])

  if (pathname.startsWith('/lot-2046')) return null
  const navigationVisible = !projectOpen && (!condensed || open)
  const menuTriggerVisible = condensed || projectOpen

  return (
    <header ref={header} className="site-header cyan-header" data-home={pathname === '/'} data-brand={symbolVisible ? 'symbol' : 'wordmark'} data-condensed={condensed} data-menu-open={open} data-project-open={projectOpen} data-work={pathname.startsWith('/work')}>
      <div className="header-inner" data-lenis-prevent={open || projectOpen || undefined}>
        <Link className="cyan-header-mark-link" href="/" aria-label="Home">
          <span className="cyan-header-mark" data-glass-ink aria-hidden="true" />
          <span className="cyan-header-wordmark" aria-hidden="true">
            {Array.from('burgama').map((letter, index) => (
              <span key={index} data-glass-ink style={{ animationDelay: `${index * 35}ms` }}>{letter}</span>
            ))}
          </span>
        </Link>
        <button
          ref={trigger}
          type="button"
          className="cyan-menu-trigger font-serif"
          aria-label={projectOpen ? 'Close project enquiry' : open ? 'Close menu' : 'Open menu'}
          aria-expanded={open || projectOpen}
          aria-controls={projectOpen ? enquiryId : 'primary-navigation'}
          aria-hidden={!menuTriggerVisible}
          tabIndex={menuTriggerVisible ? 0 : -1}
          onClick={() => projectOpen ? closeProject({ restoreFocus: true }) : setOpen((value) => !value)}
        >
          <span className="cyan-menu-labels" aria-hidden="true">
            <span className="cyan-menu-label cyan-menu-label-menu" data-glass-ink>Menu</span>
            <span className="cyan-menu-label cyan-menu-label-close" data-glass-ink>Close</span>
          </span>
        </button>
        <div id="primary-navigation" className="header-nav-shell" aria-hidden={!navigationVisible} inert={!navigationVisible}>
          <nav aria-label="Primary" className="header-nav">
            {destinations.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => closeMenu()} aria-current={pathname.startsWith(item.href) ? 'page' : undefined}>
                <span data-glass-ink>{item.label}</span>
              </Link>
            ))}
            <button ref={projectTrigger} type="button" className="header-contact" onClick={openProject} aria-expanded={projectOpen} aria-controls={enquiryId}>
              <span data-glass-ink>start a project</span>
            </button>
          </nav>
        </div>
        <div className="header-project-panel" hidden={!projectOpen}>
          <NavProjectForm id={enquiryId} active={projectOpen} onMenu={() => closeProject({ toMenu: true, restoreFocus: true })} onHeightChange={(height) => header.current?.style.setProperty('--project-form-height', `${height}px`)} />
        </div>
      </div>
    </header>
  )
}
