'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '@/lib/motion'

type ScrollControls = {
  scrollToHash: (hash: string, replace?: boolean) => boolean
  setScrollLock: (name: string, locked: boolean) => void
  cancelScroll: () => void
}
const ScrollContext = createContext<ScrollControls | null>(null)
export const useSmoothScroll = () => useContext(ScrollContext)

export function SmoothScroll({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const excluded = pathname.startsWith('/lot-2046')
  const lenis = useRef<Lenis | null>(null)
  const locks = useRef(new Set<string>())

  const cancelScroll = useCallback(() => {
    const instance = lenis.current
    if (!instance) return
    instance.stop()
    if (!locks.current.size) instance.start()
  }, [])

  const setScrollLock = useCallback((name: string, locked: boolean) => {
    if (locked) locks.current.add(name)
    else locks.current.delete(name)
    const instance = lenis.current
    if (!instance) return
    if (locks.current.size) instance.stop()
    else {
      instance.start()
      instance.resize()
    }
  }, [])

  const scrollToHash = useCallback((hash: string, replace = false) => {
    if (!hash || locks.current.size) return false
    let id: string
    try { id = decodeURIComponent(hash.slice(1)) } catch { return false }
    const target = document.getElementById(id)
    if (!target) return false
    const clearance = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0
    // Integer targets avoid Lenis asymptotically approaching a half-pixel rounding boundary.
    const top = Math.max(0, Math.round(window.scrollY + target.getBoundingClientRect().top - clearance))
    if (location.hash !== hash) {
      if (replace) history.replaceState(history.state, '', hash)
      else history.pushState(history.state, '', hash)
    }
    const focus = () => {
      const temporary = !target.hasAttribute('tabindex') && !target.matches('a,button,input,select,textarea')
      if (temporary) target.tabIndex = -1
      target.focus({ preventScroll: true })
      if (temporary) target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true })
    }
    if (lenis.current) lenis.current.scrollTo(top, { onComplete: focus })
    else { window.scrollTo({ top, behavior: 'instant' }); focus() }
    return true
  }, [])

  useEffect(() => {
    if (excluded) return
    const preference = matchMedia('(prefers-reduced-motion: reduce)')
    let teardown = () => {}
    const configure = () => {
      teardown()
      teardown = () => {}
      if (preference.matches) return
      const instance = new Lenis({
        smoothWheel: true, syncTouch: false, wheelMultiplier: 1, lerp: .12,
        autoRaf: false, anchors: false,
        prevent: node => node.matches('textarea, [contenteditable="true"]'),
        virtualScroll: ({ deltaX, deltaY, event }) => !('shiftKey' in event && event.shiftKey) && Math.abs(deltaY) >= Math.abs(deltaX),
      })
      lenis.current = instance
      if (locks.current.size) instance.stop()
      const offScroll = instance.on('scroll', () => ScrollTrigger.update())
      const tick = (seconds: number) => { if (!document.hidden) instance.raf(seconds * 1000) }
      gsap.ticker.add(tick)
      teardown = () => {
        gsap.ticker.remove(tick)
        offScroll()
        // Stop before destroy so pending native-scroll completion cannot restore old classes.
        instance.stop()
        instance.destroy()
        if (lenis.current === instance) lenis.current = null
      }
    }
    const visibility = () => {
      // Reset the external clock so a background tab cannot resume stale inertia.
      if (lenis.current) lenis.current.time = gsap.ticker.time * 1000
      setScrollLock('hidden', document.hidden)
    }
    let historyFrame = 0
    const reconcile = () => {
      cancelScroll()
      cancelAnimationFrame(historyFrame)
      historyFrame = requestAnimationFrame(() => {
        lenis.current?.resize()
        ScrollTrigger.update()
      })
    }
    visibility()
    configure()
    preference.addEventListener('change', configure)
    document.addEventListener('visibilitychange', visibility)
    window.addEventListener('popstate', reconcile)
    window.addEventListener('hashchange', reconcile)
    window.addEventListener('pageshow', reconcile)
    return () => {
      teardown()
      locks.current.delete('hidden')
      cancelAnimationFrame(historyFrame)
      preference.removeEventListener('change', configure)
      document.removeEventListener('visibilitychange', visibility)
      window.removeEventListener('popstate', reconcile)
      window.removeEventListener('hashchange', reconcile)
      window.removeEventListener('pageshow', reconcile)
    }
  }, [excluded, cancelScroll, setScrollLock])

  useEffect(() => {
    if (excluded) return
    cancelScroll()
    let cancelled = false
    const alignHash = () => {
      if (!cancelled && location.hash) scrollToHash(location.hash, true)
    }
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        lenis.current?.resize()
        ScrollTrigger.refresh()
        alignHash()
      })
    })
    void document.fonts.ready.then(alignHash)
    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
    }
  }, [pathname, excluded, cancelScroll, scrollToHash])

  const value = useMemo(() => ({ scrollToHash, setScrollLock, cancelScroll }), [scrollToHash, setScrollLock, cancelScroll])
  return <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>
}
