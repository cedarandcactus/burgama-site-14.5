'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState, useTransition, type ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useSmoothScroll } from './smooth-scroll'
import styles from './page-transition.module.css'

type Destination = { href: string; replace?: boolean; scroll?: boolean }
type Phase = 'idle' | 'covering' | 'covered' | 'revealing'
const TransitionContext = createContext<((destination: Destination) => void) | null>(null)
export const usePageTransition = () => useContext(TransitionContext)

const wordmark = Array.from('burgama')
const timing = { cover: 180, start: 70, letter: 520, stagger: 35, hold: 60, reveal: 440 }
const wordmarkReady = timing.start + timing.letter + timing.stagger * (wordmark.length - 1) + timing.hold
const transitionStyle = {
  '--cover-duration': `${timing.cover}ms`,
  '--letter-start': `${timing.start}ms`,
  '--letter-duration': `${timing.letter}ms`,
  '--letter-stagger': `${timing.stagger}ms`,
  '--reveal-duration': `${timing.reveal}ms`,
} as React.CSSProperties

export function PageTransition({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const scroll = useSmoothScroll()
  const [phase, setPhase] = useState<Phase>('idle')
  const [sequence, setSequence] = useState(0)
  const [hydrated, setHydrated] = useState(false)
  const [pending, startTransition] = useTransition()
  const phaseRef = useRef<Phase>('idle')
  const destination = useRef<Destination | null>(null)
  const sent = useRef(false)
  const content = useRef<HTMLDivElement>(null)
  const skipButton = useRef<HTMLButtonElement>(null)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const previousPath = useRef(pathname)
  const focusAfter = useRef(false)
  const reduced = useRef(false)
  const startedAt = useRef(0)

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }, [])
  const later = useCallback((callback: () => void, delay: number) => {
    timers.current.push(setTimeout(callback, delay))
  }, [])
  const changePhase = useCallback((next: Phase) => {
    phaseRef.current = next
    scroll?.setScrollLock('transition', next !== 'idle')
    setPhase(next)
  }, [scroll])
  useEffect(() => () => scroll?.setScrollLock('transition', false), [scroll])
  const finish = useCallback(() => {
    clearTimers()
    destination.current = null
    sent.current = false
    if (content.current) content.current.inert = false
    changePhase('idle')
    if (focusAfter.current || document.activeElement === skipButton.current) {
      document.getElementById('main')?.focus({ preventScroll: true })
    }
    focusAfter.current = false
  }, [changePhase, clearTimers])
  const reveal = useCallback(() => {
    if (phaseRef.current === 'idle' || phaseRef.current === 'revealing') return
    clearTimers()
    changePhase('revealing')
    later(finish, reduced.current ? 0 : timing.reveal + 20)
  }, [changePhase, clearTimers, finish, later])
  const navigate = useCallback(() => {
    const target = destination.current
    if (!target || sent.current) return
    sent.current = true
    changePhase('covered')
    startTransition(() => {
      if (target.replace) router.replace(target.href, { scroll: target.scroll })
      else router.push(target.href, { scroll: target.scroll })
    })
  }, [router, changePhase])
  const skip = useCallback(() => { navigate(); finish() }, [navigate, finish])

  useEffect(() => {
    setHydrated(true)
    const media = matchMedia('(prefers-reduced-motion: reduce)')
    reduced.current = media.matches
    const onMotion = () => { reduced.current = media.matches; if (media.matches) skip() }
    const onHistory = () => { destination.current = null; finish() }
    const onVisibility = () => { if (document.hidden) skip() }
    media.addEventListener('change', onMotion)
    window.addEventListener('popstate', onHistory)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      clearTimers()
      media.removeEventListener('change', onMotion)
      window.removeEventListener('popstate', onHistory)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [clearTimers, finish, later, reveal, skip])

  useEffect(() => {
    const changed = previousPath.current !== pathname
    previousPath.current = pathname
    if (changed && !destination.current) finish()
    else if (destination.current && sent.current && !pending && phase === 'covered') {
      // Load the route behind the wordmark without cutting its entrance short.
      later(reveal, Math.max(0, wordmarkReady - (performance.now() - startedAt.current)))
    }
  }, [pathname, pending, phase, finish, later, reveal])

  const active = phase !== 'idle'
  useEffect(() => {
    if (!active || !hydrated) return
    const wrapper = content.current
    const oldOverflow = document.body.style.overflow
    const oldPadding = document.body.style.paddingRight
    const scrollbar = window.innerWidth - document.documentElement.clientWidth
    if (wrapper) wrapper.inert = true
    document.body.style.overflow = 'hidden'
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`
    const onKey = (event: KeyboardEvent) => {
      if (event.isComposing || event.keyCode === 229) return
      if (event.key === 'Escape') { event.preventDefault(); skip() }
      if (event.key === 'Tab') { event.preventDefault(); skipButton.current?.focus() }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      if (wrapper) wrapper.inert = false
      document.body.style.overflow = oldOverflow
      document.body.style.paddingRight = oldPadding
      document.removeEventListener('keydown', onKey)
    }
  }, [active, hydrated, skip])

  const begin = useCallback((target: Destination) => {
    if (phaseRef.current !== 'idle') return
    focusAfter.current = true
    scroll?.cancelScroll()
    clearTimers()
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      startTransition(() => {
        if (target.replace) router.replace(target.href, { scroll: target.scroll })
        else router.push(target.href, { scroll: target.scroll })
      })
      return
    }
    destination.current = target
    sent.current = false
    startedAt.current = performance.now()
    setSequence(value => value + 1)
    changePhase('covering')
    later(navigate, timing.cover)
    // A failed or interrupted route must never leave the site behind a curtain.
    later(finish, 6000)
  }, [changePhase, clearTimers, finish, later, navigate, router, scroll])

  return (
    <TransitionContext.Provider value={begin}>
      <div ref={content} className={styles.content}>{children}</div>
      {active && <div key={sequence} className={styles.overlay} style={transitionStyle} data-phase={phase} data-hydrated={hydrated} data-page-transition="">
        <div className={styles.curtain} aria-hidden="true">
          <div className={`${styles.logo} font-serif`}>
            {wordmark.map((letter, index) => (
              <span className={styles.letterMask} key={index} style={{ '--letter-index': index } as React.CSSProperties}>
                <span className={styles.letter} data-transition-letter="">{letter}</span>
              </span>
            ))}
          </div>
        </div>
        <span className="sr-only" role="status">Loading page</span>
        <button ref={skipButton} type="button" className={styles.skip} onClick={skip} aria-label="Skip page transition" />
      </div>}
      <noscript><style>{`[data-page-transition] { display: none !important; }`}</style></noscript>
    </TransitionContext.Provider>
  )
}
