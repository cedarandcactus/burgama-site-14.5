'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState, useTransition, type ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { BurgamaMark } from '@/components/burgama-mark'
import styles from './page-transition.module.css'

type Destination = { href: string; replace?: boolean; scroll?: boolean }
type Phase = 'intro' | 'idle' | 'covering' | 'covered' | 'revealing'
const TransitionContext = createContext<((destination: Destination) => void) | null>(null)
export const usePageTransition = () => useContext(TransitionContext)

export function PageTransition({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [phase, setPhase] = useState<Phase>('intro')
  const [sequence, setSequence] = useState(0)
  const [hydrated, setHydrated] = useState(false)
  const [pending, startTransition] = useTransition()
  const phaseRef = useRef<Phase>('intro')
  const destination = useRef<Destination | null>(null)
  const sent = useRef(false)
  const content = useRef<HTMLDivElement>(null)
  const skipButton = useRef<HTMLButtonElement>(null)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const previousPath = useRef(pathname)
  const focusAfter = useRef(false)
  const reduced = useRef(false)

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }, [])
  const later = useCallback((callback: () => void, delay: number) => {
    timers.current.push(setTimeout(callback, delay))
  }, [])
  const changePhase = useCallback((next: Phase) => { phaseRef.current = next; setPhase(next) }, [])
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
    later(finish, reduced.current ? 120 : 900)
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
    later(reveal, media.matches ? 0 : 1750)
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
      later(reveal, reduced.current ? 0 : 150)
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
    destination.current = target
    sent.current = false
    focusAfter.current = true
    if (reduced.current) { later(finish, 6000); navigate(); return }
    clearTimers()
    setSequence(value => value + 1)
    changePhase('covering')
    later(navigate, 520)
    // A failed or interrupted route must never leave the site behind a curtain.
    later(finish, 6000)
  }, [changePhase, clearTimers, finish, later, navigate])

  return (
    <TransitionContext.Provider value={begin}>
      <div ref={content} className={styles.content}>{children}</div>
      {active && <div key={sequence} className={styles.overlay} data-phase={phase} data-kind={sequence === 0 ? 'intro' : 'navigation'} data-hydrated={hydrated} data-page-transition="">
        <div className={styles.curtain} aria-hidden="true">
          <div className={styles.wash} />
          <div className={styles.grain} />
          <div className={styles.logo}><BurgamaMark className={styles.symbol} /></div>
        </div>
        <button ref={skipButton} type="button" className={`${styles.skip} font-sans`} onClick={skip}>skip animation</button>
      </div>}
      <noscript><style>{`[data-page-transition] { display: none !important; }`}</style></noscript>
    </TransitionContext.Provider>
  )
}
