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
  const dialog = useRef<HTMLDivElement>(null)
  const header = useRef<HTMLElement>(null)

  function closeMenu() {
    setOpen(false)
    trigger.current?.focus()
  }

  useEffect(() => { setOpen(false) }, [pathname])
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    function update() {
      frame = 0
      header.current?.style.setProperty('--logo-turn', `${media.matches ? 0 : window.scrollY * .16}deg`)
    }
    function scroll() { if (!frame) frame = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', scroll, { passive: true })
    media.addEventListener('change', update)
    return () => { window.removeEventListener('scroll', scroll); media.removeEventListener('change', update); cancelAnimationFrame(frame) }
  }, [])

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const background = [...document.querySelectorAll<HTMLElement>('main, footer')]
    const previousInert = background.map(element => element.inert)
    background.forEach(element => { element.inert = true })
    dialog.current?.querySelector<HTMLButtonElement>('button')?.focus()
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') { event.preventDefault(); closeMenu() }
      if (event.key !== 'Tab') return
      const controls = [...(dialog.current?.querySelectorAll<HTMLElement>('a[href], button') ?? [])]
      const first = controls[0]
      const last = controls[controls.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previousOverflow
      background.forEach((element, index) => { element.inert = previousInert[index] })
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  if (pathname.startsWith('/lot-2046')) return null

  return (
    <header ref={header} className="site-header cyan-header" data-home={pathname === '/'} data-menu-open={open} data-work={pathname.startsWith('/work')}>
      <div className="header-inner" inert={open}>
        <Link href="/" aria-label="Burgama home" className="header-brand"><span className="brand-lockup"><BurgamaMark /></span></Link>
        <button ref={trigger} type="button" className="cyan-menu-trigger font-serif" aria-label="Open menu" aria-expanded={open} aria-controls="fullscreen-navigation" onClick={() => setOpen(true)}>menu</button>
      </div>
      <div ref={dialog} id="fullscreen-navigation" className="fullscreen-navigation" role="dialog" aria-modal={open ? true : undefined} aria-label="Site navigation" aria-hidden={!open} inert={!open} data-open={open}>
        <div className="menu-top">
          <span className="menu-emblem" aria-hidden="true"><BurgamaMark /></span>
          <button type="button" className="menu-close hamburger" aria-label="Close menu" onClick={closeMenu}><span /><span /></button>
        </div>
        <nav aria-label="Primary" className="menu-destinations">
          {destinations.map(item => <div className="menu-link-window" key={item.href}><Link href={item.href} onClick={closeMenu} aria-current={pathname.startsWith(item.href) ? 'page' : undefined}>{item.label}</Link></div>)}
        </nav>
        <a className="menu-email font-sans" href="mailto:hello@burgama.com">hello@burgama.com</a>
      </div>
    </header>
  )
}
