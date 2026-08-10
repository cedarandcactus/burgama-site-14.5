'use client'

import { useCallback, useEffect, useState } from 'react'

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'tr', label: 'Türkçe' },
  { value: 'ja', label: '日本語' },
  { value: 'zh', label: '简体中文' },
  { value: 'uk', label: 'Українська' },
  { value: 'el', label: 'Ελληνικά' },
  { value: 'de', label: 'Deutsch' },
  { value: 'it', label: 'Italiano' },
  { value: 'pt', label: 'Português' },
  { value: 'nl', label: 'Nederlands' },
  { value: 'pl', label: 'Polski' },
]

const SIZES = [
  { value: 'small', label: 'Small' },
  { value: 'standard', label: 'Standard' },
  { value: 'large', label: 'Large' },
]

const STEPS = ['language', 'size', 'scroll'] as const
type Step = (typeof STEPS)[number]

const STORE_LANGUAGE = 'burgama:language'
const STORE_SIZE = 'burgama:type-scale'
const STORE_SEEN = 'burgama:entry-seen'

/** Mirrors a preference to the root element so CSS and the hero timeline see it. */
function mirror(key: 'language' | 'typeScale', value: string) {
  document.documentElement.dataset[key] = value
  try {
    window.localStorage.setItem(key === 'language' ? STORE_LANGUAGE : STORE_SIZE, value)
  } catch {
    /* storage unavailable — preferences stay session-only */
  }
}

/**
 * The three-step entrance gate: language, reading size, then scroll to begin.
 * The document is scroll-locked for as long as this layer is open.
 */
export function EntryPreferences() {
  const [open, setOpen] = useState(false)
  const [ready, setReady] = useState(false)
  const [step, setStep] = useState<Step>('language')
  const [language, setLanguage] = useState('en')
  const [size, setSize] = useState('standard')

  const close = useCallback(() => {
    document.documentElement.dataset.entryOpen = 'false'
    setOpen(false)
    try {
      window.localStorage.setItem(STORE_SEEN, '1')
    } catch {
      /* ignore */
    }
  }, [])

  useEffect(() => {
    let storedLanguage: string | null = null
    let storedSize: string | null = null
    let seen: string | null = null
    try {
      storedLanguage = window.localStorage.getItem(STORE_LANGUAGE)
      storedSize = window.localStorage.getItem(STORE_SIZE)
      seen = window.localStorage.getItem(STORE_SEEN)
    } catch {
      /* ignore */
    }

    const nextLanguage = storedLanguage ?? 'en'
    const nextSize = storedSize ?? 'standard'
    setLanguage(nextLanguage)
    setSize(nextSize)
    document.documentElement.dataset.language = nextLanguage
    document.documentElement.dataset.typeScale = nextSize

    if (seen || window.scrollY > 4) {
      document.documentElement.dataset.entryOpen = 'false'
      return
    }

    document.documentElement.dataset.entryOpen = 'true'
    setOpen(true)
    const raf = window.requestAnimationFrame(() => setReady(true))
    return () => window.cancelAnimationFrame(raf)
  }, [])

  useEffect(
    () => () => {
      document.documentElement.dataset.entryOpen = 'false'
    },
    [],
  )

  if (!open) return null

  const index = STEPS.indexOf(step)

  const advance = () => {
    if (step === 'language') setStep('size')
    else if (step === 'size') setStep('scroll')
    else close()
  }

  return (
    <section
      role="dialog"
      aria-modal="true"
      aria-labelledby="entry-title"
      className="fixed inset-0 z-[90] flex items-center justify-center bg-navy px-module"
    >
      <div
        className="rail flex flex-col gap-module transition-[transform,filter] duration-700 ease-module"
        style={{
          transform: ready ? 'translate3d(0,0,0)' : 'translate3d(0,10px,0)',
          filter: ready ? 'blur(0px)' : 'blur(3px)',
        }}
      >
        <div className="flex flex-col gap-module rounded-module bg-surface-1 p-5">
          <p id="entry-title" className="t-title">
            {step === 'language' ? 'Language' : step === 'size' ? 'Text size' : 'Scroll to begin.'}
          </p>
          <p className="t-body">
            {step === 'language'
              ? 'Choose the language for this experience.'
              : step === 'size'
                ? 'Choose the reading size that feels best.'
                : 'Use your wheel, trackpad, swipe, or the Scroll control below.'}
          </p>
        </div>

        {step === 'language' ? (
          <div
            className="flex flex-wrap gap-module"
            role="listbox"
            aria-label="Preferred language"
          >
            {LANGUAGES.map((item) => {
              const selected = item.value === language
              return (
                <button
                  key={item.value}
                  type="button"
                  role="option"
                  lang={item.value}
                  aria-selected={selected}
                  onClick={() => {
                    setLanguage(item.value)
                    mirror('language', item.value)
                  }}
                  className={`t-ui h-control rounded-module px-4 transition-colors duration-300 ease-module hover:bg-periwinkle hover:text-navy focus-visible:bg-periwinkle focus-visible:text-navy ${
                    selected ? 'bg-periwinkle text-navy' : 'bg-surface-2 text-foreground'
                  }`}
                >
                  {item.label}
                </button>
              )
            })}
          </div>
        ) : null}

        {step === 'size' ? (
          <div className="flex gap-module" role="group" aria-label="Preferred text size">
            {SIZES.map((item) => {
              const selected = item.value === size
              return (
                <button
                  key={item.value}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => {
                    setSize(item.value)
                    mirror('typeScale', item.value)
                  }}
                  className={`h-control flex-1 rounded-module px-4 transition-colors duration-300 ease-module hover:bg-periwinkle hover:text-navy focus-visible:bg-periwinkle focus-visible:text-navy ${
                    selected ? 'bg-periwinkle text-navy' : 'bg-surface-2 text-foreground'
                  }`}
                  style={{
                    fontSize:
                      item.value === 'small' ? '0.8125rem' : item.value === 'large' ? '1.25rem' : '1rem',
                  }}
                >
                  {item.label}
                </button>
              )
            })}
          </div>
        ) : null}

        <div className="flex gap-module">
          <button
            type="button"
            onClick={close}
            className="t-ui h-control basis-[38%] rounded-module bg-surface-2 transition-colors duration-300 ease-module hover:bg-periwinkle hover:text-navy focus-visible:bg-periwinkle focus-visible:text-navy"
          >
            Skip
          </button>
          <button
            type="button"
            onClick={advance}
            className="t-ui h-control basis-[62%] rounded-module bg-periwinkle text-navy transition-colors duration-300 ease-module hover:bg-surface-3 hover:text-periwinkle focus-visible:bg-surface-3 focus-visible:text-periwinkle"
          >
            {step === 'scroll' ? 'Scroll' : 'Continue'}
          </button>
        </div>

        <div className="flex gap-module" aria-hidden="true">
          {STEPS.map((item, itemIndex) => (
            <span
              key={item}
              className="h-1.5 flex-1 rounded-sm transition-colors duration-300 ease-module"
              style={{
                backgroundColor: itemIndex <= index ? 'var(--periwinkle)' : 'var(--surface-2)',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
