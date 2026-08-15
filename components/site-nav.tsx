'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { BrandMark } from '@/components/brand-mark'

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'tr', label: 'Türkçe' },
  { value: 'de', label: 'Deutsch' },
  { value: 'it', label: 'Italiano' },
  { value: 'pt', label: 'Português' },
  { value: 'nl', label: 'Nederlands' },
  { value: 'pl', label: 'Polski' },
  { value: 'uk', label: 'Українська' },
  { value: 'el', label: 'Ελληνικά' },
  { value: 'ja', label: '日本語' },
  { value: 'zh', label: '简体中文' },
]

const MODULE =
  'flex flex-col justify-end rounded-module bg-surface-1 px-4 py-3 text-left transition-[background-color,color,transform] duration-300 ease-module hover:bg-periwinkle hover:text-navy focus-visible:bg-periwinkle focus-visible:text-navy'

export function SiteNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [language, setLanguage] = useState('en')
  const navRef = useRef<HTMLElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setOpen(false)
    setLangOpen(false)
  }, [pathname])

  useEffect(() => {
    const nav = navRef.current
    if (!nav) return

    const mix = (from: number[], to: number[], amount: number) =>
      from.map((value, index) => Math.round(value + (to[index] - value) * amount))

    let frame = 0
    const updateFrost = () => {
      frame = 0
      const hero = document.querySelector<HTMLElement>('.hero-scroll')
      const heroDistance = hero ? Math.max(1, hero.offsetHeight - window.innerHeight) : 1
      const heroRect = hero?.getBoundingClientRect()
      const heroActive = Boolean(heroRect && heroRect.top <= 13 && heroRect.bottom > 13)
      const phase = heroRect
        ? Math.max(0, Math.min(1, -heroRect.top / heroDistance))
        : 0
      const middle = phase < 0.55 ? phase / 0.55 : (phase - 0.55) / 0.45
      const phasedMix = (start: number[], center: number[], end: number[]) =>
        phase < 0.55 ? mix(start, center, middle) : mix(center, end, middle)

      const setRgb = (name: string, values: number[]) =>
        nav.style.setProperty(name, values.join(' '))

      setRgb('--text', mix([154, 161, 209], [188, 194, 235], phase * 0.38))
      setRgb('--glass', phasedMix([24, 37, 88], [12, 24, 68], [7, 15, 44]))
      setRgb('--tone-a', phasedMix([39, 54, 118], [20, 33, 86], [10, 19, 54]))
      setRgb('--tone-b', phasedMix([104, 117, 188], [73, 88, 160], [48, 61, 126]))
      setRgb('--tone-c', phasedMix([14, 26, 68], [8, 18, 52], [4, 11, 33]))
      nav.style.setProperty('--nav-glass-alpha', (0.72 + phase * 0.12).toFixed(3))
      nav.dataset.heroActive = String(heroActive)
    }

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateFrost)
    }

    updateFrost()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)
    return () => {
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      if (frame) window.cancelAnimationFrame(frame)
    }
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
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  const moduleState = (href: string) =>
    isActive(href) ? 'bg-surface-3' : ''

  const current = LANGUAGES.find((item) => item.value === language) ?? LANGUAGES[0]

  return (
    <nav
      ref={navRef}
      aria-label="Primary"
      data-open={open}
      data-hero-active="false"
      className="burgama-shell"
      style={{
        backdropFilter: 'blur(16px) saturate(138%) brightness(1.035)',
        WebkitBackdropFilter: 'blur(16px) saturate(138%) brightness(1.035)',
      }}
    >
      <div className="nav-frost-content">
        {/* The bar keeps its full width and is clipped symmetrically while compact. */}
        <div className="flex justify-center">
          <div className="burgama-bar">
          <Link
            href="/contact"
            className="t-ui justify-self-start rounded-sm px-1 py-2 transition-colors duration-200 hover:text-periwinkle focus-visible:text-navy min-[700px]:hidden"
          >
            Start a project
          </Link>

          <Link
            href="/"
            aria-label="Burgama, home"
            data-nav-brand
            className="flex items-center justify-center rounded-sm"
            style={{ opacity: 'var(--nav-brand-opacity, 1)' }}
          >
            <BrandMark className="h-auto w-[58px] min-[581px]:w-[68px]" />
          </Link>

          <button
            type="button"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((value) => !value)}
            className="t-ui justify-self-end rounded-sm px-1 py-2 transition-colors duration-200 hover:text-periwinkle focus-visible:text-navy min-[700px]:hidden"
          >
            {open ? 'Close' : 'Menu'}
          </button>

          <div className="hidden items-center justify-center gap-1 min-[700px]:flex">
            {[
              { label: 'Work', href: '/work' },
              { label: 'Studio', href: '/studio' },
              { label: 'Capabilities', href: '/studio#capabilities' },
              { label: 'Approach', href: '/studio#approach' },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className={`t-ui nav-link rounded-sm px-3 py-2 ${
                  isActive(item.href) ? 'nav-link-active' : ''
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Solid control pinned inside the right end of the pill. */}
          <Link
            href="/contact"
            aria-current={isActive('/contact') ? 'page' : undefined}
            className="nav-cta t-ui hidden min-[700px]:inline-flex"
          >
            Start a project
          </Link>
          </div>
        </div>

        <div
          id="site-menu"
          ref={panelRef}
          aria-hidden={!open}
          className="grid w-full max-w-full transition-[grid-template-rows] duration-700 ease-module min-[700px]:hidden"
          style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
        >
          <div className="overflow-hidden">
            <div className="flex flex-col gap-module p-module pt-0">
              <div className="flex gap-module">
                <Link
                  href="/work"
                  tabIndex={open ? 0 : -1}
                  className={`${MODULE} ${moduleState('/work')} min-h-28 basis-[58%]`}
                >
                  <span className="t-section">Selected work</span>
                </Link>
                <Link
                  href="/studio"
                  tabIndex={open ? 0 : -1}
                  className={`${MODULE} ${moduleState('/studio')} min-h-28 basis-[42%]`}
                >
                  <span className="t-section">Studio</span>
                </Link>
              </div>

              <div className="flex gap-module">
                <Link
                  href="/studio#capabilities"
                  tabIndex={open ? 0 : -1}
                  className={`${MODULE} min-h-20 basis-[42%]`}
                >
                  <span className="text-lg leading-none">Capabilities</span>
                </Link>
                <Link
                  href="/studio#approach"
                  tabIndex={open ? 0 : -1}
                  className={`${MODULE} min-h-20 basis-[58%]`}
                >
                  <span className="text-lg leading-none">Approach</span>
                </Link>
              </div>

              <div className="flex gap-module">
                <Link
                  href="/contact"
                  tabIndex={open ? 0 : -1}
                  className={`${MODULE} ${moduleState('/contact')} h-control basis-[60%] justify-center`}
                >
                  <span className="t-ui">Contact</span>
                </Link>
                <button
                  type="button"
                  tabIndex={open ? 0 : -1}
                  aria-expanded={langOpen}
                  aria-controls="language-options"
                  onClick={() => setLangOpen((value) => !value)}
                  className={`${MODULE} h-control basis-[40%] justify-center`}
                >
                  <span className="t-ui" lang={current.value}>
                    {current.label}
                  </span>
                </button>
              </div>

              <div
                id="language-options"
                aria-hidden={!langOpen}
                className="grid transition-[grid-template-rows] duration-500 ease-module"
                style={{ gridTemplateRows: langOpen ? '1fr' : '0fr' }}
              >
                <div className="overflow-hidden">
                  <div className="flex flex-wrap gap-module pt-module" role="listbox" aria-label="Language">
                    {LANGUAGES.map((item) => {
                      const selected = item.value === language
                      return (
                        <button
                          key={item.value}
                          type="button"
                          role="option"
                          lang={item.value}
                          aria-selected={selected}
                          tabIndex={open && langOpen ? 0 : -1}
                          onClick={() => {
                            setLanguage(item.value)
                            setLangOpen(false)
                          }}
                          className={`t-ui rounded-module px-3 py-3 transition-colors duration-200 ease-module hover:bg-periwinkle hover:text-navy focus-visible:bg-periwinkle focus-visible:text-navy ${
                            selected
                              ? 'bg-periwinkle text-navy'
                              : 'bg-surface-1 text-foreground'
                          }`}
                        >
                          {item.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-module">
                <a
                  href="mailto:hello@burgama.com"
                  tabIndex={open ? 0 : -1}
                  className={`${MODULE} h-control basis-[52%] justify-center`}
                >
                  <span className="t-ui">hello@burgama.com</span>
                </a>
                <p className="flex h-control basis-[44%] items-center rounded-module bg-surface-1 px-4">
                  <span className="t-ui">Austin, Texas</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
