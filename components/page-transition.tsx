'use client'

import { createContext, useCallback, useContext, useEffect, useEffectEvent, useRef, useState, useTransition, type ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useSmoothScroll } from './smooth-scroll'
import styles from './page-transition.module.css'

type Destination = { href: string; replace?: boolean; scroll?: boolean }
type Phase = 'idle' | 'covering' | 'covered' | 'revealing'
type Navigation = { id: number; target: Destination; source: string; sent: boolean; completed: boolean }
const TransitionContext = createContext<((destination: Destination) => void) | null>(null)
export const usePageTransition = () => useContext(TransitionContext)

const timing = { cover: 140, hold: 70, reveal: 280, deadline: 3000 }
const frostReady = timing.cover + timing.hold
const transitionStyle = {
  '--cover-duration': `${timing.cover}ms`,
  '--reveal-duration': `${timing.reveal}ms`,
  '--transition-deadline': `${timing.deadline}ms`,
} as React.CSSProperties

export function PageTransition({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const scroll = useSmoothScroll()
  const [phase, setPhase] = useState<Phase>('idle')
  const [sequence, setSequence] = useState(0)
  const [pending, startTransition] = useTransition()
  const phaseRef = useRef<Phase>('idle')
  const sequenceRef = useRef(0)
  const navigation = useRef<Navigation | null>(null)
  const content = useRef<HTMLDivElement>(null)
  const skipButton = useRef<HTMLButtonElement>(null)
  const animationTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const deadlineTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const focusFrame = useRef(0)
  const bodyLock = useRef<{ overflow: string; padding: string; appliedPadding: string } | null>(null)
  const reduced = useRef(false)
  const startedAt = useRef(0)

  const clearAnimation = useCallback(() => {
    if (animationTimer.current !== null) clearTimeout(animationTimer.current)
    animationTimer.current = null
  }, [])
  const clearDeadline = useCallback(() => {
    if (deadlineTimer.current !== null) clearTimeout(deadlineTimer.current)
    deadlineTimer.current = null
  }, [])
  const clearFocus = useCallback(() => {
    cancelAnimationFrame(focusFrame.current)
    focusFrame.current = 0
  }, [])
  const scheduleAnimation = useCallback((id: number, callback: () => void, delay: number) => {
    clearAnimation()
    animationTimer.current = setTimeout(() => {
      animationTimer.current = null
      if (sequenceRef.current === id) callback()
    }, delay)
  }, [clearAnimation])
  const changePhase = useCallback((next: Phase) => {
    phaseRef.current = next
    setPhase(next)
  }, [])
  const releasePage = useCallback(() => {
    if (content.current) content.current.inert = false
    const lock = bodyLock.current
    if (lock) {
      if (document.body.style.overflow === 'hidden') document.body.style.overflow = lock.overflow
      if (document.body.style.paddingRight === lock.appliedPadding) document.body.style.paddingRight = lock.padding
      bodyLock.current = null
    }
    scroll?.setScrollLock('transition', false)
  }, [scroll])
  const focusDestination = useCallback((request: Navigation) => {
    clearFocus()
    const focus = () => {
      focusFrame.current = 0
      if (navigation.current !== request || !request.completed || phaseRef.current !== 'idle') return
      navigation.current = null
      const hash = new URL(request.target.href, location.href).hash
      if (hash && request.target.scroll !== false && scroll?.scrollToHash(hash, true)) return
      let target = document.getElementById('main')
      if (hash) {
        try { target = document.getElementById(decodeURIComponent(hash.slice(1))) ?? target } catch { /* A malformed fragment still focuses the destination page. */ }
      }
      if (!target) return
      const temporary = !target.hasAttribute('tabindex') && !target.matches('a,button,input,select,textarea')
      if (temporary) target.tabIndex = -1
      target.focus({ preventScroll: true })
      if (temporary) target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true })
    }
    // Follow Next's scroll reset and the smooth-scroll provider's two-frame layout refresh.
    focusFrame.current = requestAnimationFrame(() => {
      focusFrame.current = requestAnimationFrame(() => {
        focusFrame.current = requestAnimationFrame(focus)
      })
    })
  }, [clearFocus, scroll])
  const finishVisual = useCallback((id: number) => {
    if (sequenceRef.current !== id) return
    clearAnimation()
    clearDeadline()
    const skipHadFocus = document.activeElement === skipButton.current
    releasePage()
    changePhase('idle')
    const request = navigation.current
    // Visual recovery must not discard a still-loading route or its eventual focus transfer.
    if (request?.completed) focusDestination(request)
    else if (skipHadFocus) document.getElementById('main')?.focus({ preventScroll: true })
  }, [changePhase, clearAnimation, clearDeadline, focusDestination, releasePage])
  const reveal = useCallback((id: number) => {
    if (sequenceRef.current !== id || phaseRef.current === 'idle' || phaseRef.current === 'revealing') return
    changePhase('revealing')
    scheduleAnimation(id, () => finishVisual(id), reduced.current ? 0 : timing.reveal + 20)
  }, [changePhase, finishVisual, scheduleAnimation])
  const navigate = useCallback((id: number) => {
    const request = navigation.current
    if (!request || request.id !== id || request.sent) return
    request.sent = true
    if (phaseRef.current === 'covering') changePhase('covered')
    startTransition(() => {
      if (request.target.replace) router.replace(request.target.href, { scroll: request.target.scroll })
      else router.push(request.target.href, { scroll: request.target.scroll })
    })
  }, [router, changePhase])
  const skip = useCallback(() => {
    if (phaseRef.current === 'idle') return
    const id = sequenceRef.current
    navigate(id)
    finishVisual(id)
  }, [navigate, finishVisual])

  const onMotion = useEffectEvent((matches: boolean) => {
    reduced.current = matches
    if (matches) skip()
  })
  const onHistory = useEffectEvent(() => {
    clearFocus()
    navigation.current = null
    finishVisual(sequenceRef.current)
  })
  const onVisibility = useEffectEvent(() => {
    if (document.hidden) skip()
  })
  const onUnmount = useEffectEvent(() => {
    sequenceRef.current += 1
    navigation.current = null
    clearFocus()
    clearAnimation()
    clearDeadline()
    releasePage()
  })

  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)')
    onMotion(media.matches)
    const motion = () => onMotion(media.matches)
    const history = () => onHistory()
    const visibility = () => onVisibility()
    media.addEventListener('change', motion)
    window.addEventListener('popstate', history)
    document.addEventListener('visibilitychange', visibility)
    return () => {
      media.removeEventListener('change', motion)
      window.removeEventListener('popstate', history)
      document.removeEventListener('visibilitychange', visibility)
      onUnmount()
    }
  }, [])

  useEffect(() => {
    const request = navigation.current
    if (!request?.sent || pending || request.completed) return
    const current = location.pathname + location.search
    const target = new URL(request.target.href, location.href)
    if (current === request.source && current !== target.pathname + target.search) return
    request.completed = true
    if (phaseRef.current === 'idle') focusDestination(request)
    else scheduleAnimation(request.id, () => reveal(request.id), Math.max(0, frostReady - (performance.now() - startedAt.current)))
  }, [pathname, pending, phase, focusDestination, reveal, scheduleAnimation])

  const active = phase !== 'idle'
  const onKey = useEffectEvent((event: KeyboardEvent) => {
    if (event.isComposing || event.keyCode === 229) return
    if (event.key === 'Escape') { event.preventDefault(); skip() }
    if (event.key === 'Tab') { event.preventDefault(); skipButton.current?.focus() }
  })
  useEffect(() => {
    if (!active) return
    const key = (event: KeyboardEvent) => onKey(event)
    document.addEventListener('keydown', key)
    return () => document.removeEventListener('keydown', key)
  }, [active])

  const begin = useCallback((target: Destination) => {
    if (phaseRef.current !== 'idle') return
    scroll?.cancelScroll()
    clearFocus()
    clearAnimation()
    clearDeadline()
    const id = ++sequenceRef.current
    navigation.current = { id, target, source: location.pathname + location.search, sent: false, completed: false }
    reduced.current = matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced.current || document.hidden) {
      navigate(id)
      return
    }
    startedAt.current = performance.now()
    setSequence(id)
    const scrollbar = window.innerWidth - document.documentElement.clientWidth
    const overflow = document.body.style.overflow
    const padding = document.body.style.paddingRight
    if (scrollbar > 0) document.body.style.paddingRight = `${(parseFloat(getComputedStyle(document.body).paddingRight) || 0) + scrollbar}px`
    bodyLock.current = { overflow, padding, appliedPadding: document.body.style.paddingRight }
    document.body.style.overflow = 'hidden'
    if (content.current) content.current.inert = true
    scroll?.setScrollLock('transition', true)
    changePhase('covering')
    scheduleAnimation(id, () => navigate(id), timing.cover)
    // This deadline is independent of animation scheduling and React's pending route state.
    deadlineTimer.current = setTimeout(() => { navigate(id); finishVisual(id) }, timing.deadline)
  }, [changePhase, clearAnimation, clearDeadline, clearFocus, finishVisual, navigate, scheduleAnimation, scroll])

  return (
    <TransitionContext.Provider value={begin}>
      <div ref={content} className={styles.content}>{children}</div>
      {active && <div key={sequence} className={styles.overlay} style={transitionStyle} data-phase={phase} data-page-transition="" onAnimationEnd={event => {
        if (event.target === event.currentTarget) finishVisual(sequence)
      }}>
        <div className={styles.frost} aria-hidden="true" />
        <span className="sr-only" role="status">Loading page</span>
        <button ref={skipButton} type="button" className={styles.skip} onClick={skip} aria-label="Skip page transition" />
      </div>}
      <noscript><style>{`[data-page-transition] { display: none !important; }`}</style></noscript>
    </TransitionContext.Provider>
  )
}
