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
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setOpen(false)
    setLangOpen(false)
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
      aria-label="Primary"
      data-open={open}
      className="fixed top-3 left-1/2 z-50 -translate-x-1/2 transition-[max-width] duration-700 ease-module"
      style={{
        /* Withheld and compact through the entrance, then unwound to the rail. */
        width: open ? 'min(640px, calc(100vw - 20px))' : 'var(--nav-current-width)',
        maxWidth: 'calc(100vw - 20px)',
      }}
    >
      <div className="overflow-hidden rounded-module bg-surface-2">
        {/* The bar keeps its full width and is clipped symmetrically while compact. */}
        <div className="flex justify-center">
          <div
            className="grid h-control w-full grid-cols-[1fr_auto_1fr] items-center gap-3 px-3"
            style={{ minWidth: open ? undefined : 'min(438px, calc(100vw - 20px))' }}
          >
          <Link
            href="/contact"
            className="t-ui justify-self-start rounded-sm px-1 py-2 transition-colors duration-200 hover:text-surface-3 focus-visible:text-navy"
          >
            Start a project
          </Link>

          <Link
            href="/"
            aria-label="Burgama, home"
            className="flex items-center justify-center rounded-sm px-2 py-2"
          >
            <BrandMark className="h-[18px] w-auto" />
          </Link>

          <button
            type="button"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((value) => !value)}
            className="t-ui justify-self-end rounded-sm px-1 py-2 transition-colors duration-200 hover:text-surface-3 focus-visible:text-navy"
          >
            {open ? 'Close' : 'Menu'}
          </button>
          </div>
        </div>

        <div
          id="site-menu"
          ref={panelRef}
          aria-hidden={!open}
          className="grid transition-[grid-template-rows] duration-700 ease-module"
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
