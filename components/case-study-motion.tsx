'use client'

import { useLayoutEffect, useRef, type ReactNode } from 'react'

const ease = 'cubic-bezier(0.22, 1, 0.36, 1)'
const easeProgress = (progress: number) => {
  let low = 0
  let high = 1
  for (let step = 0; step < 12; step++) {
    const t = (low + high) / 2
    const x = 3 * (1 - t) ** 2 * t * 0.22 + 3 * (1 - t) * t ** 2 * 0.36 + t ** 3
    if (x < progress) low = t
    else high = t
  }
  return 1 - (1 - (low + high) / 2) ** 3
}

export function CaseStudyMotion({ slug, children }: { slug: string; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null)
  useLayoutEffect(() => {
    const root = ref.current
    if (!root || !('IntersectionObserver' in window)) return
    // These nav properties are literals, not shared tokens. Read them without changing the nav.
    const nav = document.querySelector<HTMLElement>('.cyan-menu-trigger')
    const calibrate = () => {
      if (!nav) return
      const style = getComputedStyle(nav)
      root.style.setProperty('--cs-pill-border', style.borderTopWidth)
      root.style.setProperty('--cs-pill-radius', style.borderTopLeftRadius)
      root.style.setProperty('--cs-pill-padding', style.paddingInlineStart)
    }
    calibrate()
    const navSize = new ResizeObserver(calibrate)
    if (nav) navSize.observe(nav)
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const animations = new Set<Animation>()
    const counters = new Set<number>()
    let disposed = false
    const animate = (element: HTMLElement, frames: Keyframe[], duration = 600, delay = 0) => {
      const reduced = preference.matches
      const animation = element.animate(reduced ? [{ opacity: 0 }, { opacity: 1 }] : frames, { duration: reduced ? 200 : duration, delay: reduced ? 0 : delay, easing: ease, fill: 'both' })
      animations.add(animation)
      element.style.willChange = reduced ? 'opacity' : 'transform, opacity'
      void animation.finished.then(() => {
        element.style.removeProperty('will-change')
        animation.cancel()
        animations.delete(animation)
      }).catch(() => {})
    }
    const count = (element: HTMLElement) => {
      const final = element.dataset.value ?? ''
      const text = element.firstElementChild
      if (preference.matches || !text) return
      const value = Number(final.replace(/[^\d.]/g, ''))
      const decimals = final.includes('.') ? final.split('.')[1].replace(/\D/g, '').length : 0
      const suffix = final.replace(/[\d,.]/g, '')
      const start = performance.now()
      let frame = 0
      const tick = (now: number) => {
        counters.delete(frame)
        if (disposed || preference.matches) { text.textContent = final; return }
        const progress = Math.min(1, (now - start) / 1200)
        text.textContent = progress === 1 ? final : `${(value * easeProgress(progress)).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`
        if (progress < 1) { frame = requestAnimationFrame(tick); counters.add(frame) }
      }
      frame = requestAnimationFrame(tick)
      counters.add(frame)
    }
    const reveal = (element: HTMLElement) => {
      element.dataset.csVisible = 'true'
      const kind = element.dataset.csReveal
      const index = Number(element.dataset.csIndex ?? 0)
      if (kind === 'stat') { count(element); return }
      if (kind === 'media') {
        animate(element, [{ clipPath: 'inset(8% 0 0 0 round var(--cs-radius))' }, { clipPath: 'inset(0 round var(--cs-radius))' }], 900, index * 80)
        const image = element.querySelector<HTMLElement>('img, video')
        if (image) animate(image, [{ transform: 'scale(1.04)' }, { transform: 'scale(1)' }], 900, index * 80)
      } else {
        const distance = kind === 'action' ? 12 : kind === 'body' ? 16 : 24
        const delay = kind === 'body' ? 80 : index * (kind === 'action' ? 60 : 80)
        animate(element, [{ opacity: 0, transform: `translateY(${distance}px)` }, { opacity: 1, transform: 'translateY(0)' }], 600, delay)
      }
    }
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) {
        reveal(entry.target as HTMLElement)
        observer.unobserve(entry.target)
      }
    }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' })
    root.querySelectorAll<HTMLElement>('[data-cs-reveal]').forEach(element => observer.observe(element))
    root.dataset.motionReady = 'true'
    const hero = root.querySelector('.cs-hero')
    const back = hero?.querySelector<HTMLElement>('.pill--back')
    const deck = hero?.querySelector<HTMLElement>('.cs-hero__deck')
    const meta = hero?.querySelector<HTMLElement>('.cs-hero__meta')
    if (back) animate(back, [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }])
    if (deck) animate(deck, [{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'none' }], 600, 240)
    hero?.querySelectorAll<HTMLElement>('.pill--tag').forEach((tag, index) => animate(tag, [{ opacity: 0, transform: 'scale(.96)' }, { opacity: 1, transform: 'scale(1)' }], 600, 360 + Math.min(index * 40, 200)))
    if (meta) animate(meta, [{ opacity: 0 }, { opacity: 1 }], 600, 440)
    const opening = root.querySelector<HTMLElement>('.cs-hero-media .cs-frame')
    // The 900ms media reveal starts at 240ms so the complete entrance stays under 1.2s.
    if (opening) animate(opening, [{ opacity: 0, transform: 'scale(1.04)' }, { opacity: 1, transform: 'scale(1)' }], 900, 240)
    const title = root.querySelector<HTMLElement>('.cs-hero__title')
    const originalTitle = title?.textContent ?? ''
    if (title) {
      title.setAttribute('aria-label', originalTitle)
      const words = originalTitle.split(' ').map(word => {
        const span = document.createElement('span')
        span.textContent = word
        span.style.display = 'inline-block'
        span.setAttribute('aria-hidden', 'true')
        return span
      })
      title.replaceChildren(...words.flatMap((word, index) => index ? [document.createTextNode(' '), word] : [word]))
      const tops = [...new Set(words.map(word => word.offsetTop))]
      words.forEach(word => {
        const line = tops.indexOf(word.offsetTop)
        animate(word, [{ transform: 'translateY(100%)', clipPath: 'inset(0 0 100% 0)' }, { transform: 'translateY(0)', clipPath: 'inset(0)' }], 600, 80 + line * 80)
      })
    }
    const reduce = () => {
      if (!preference.matches) return
      animations.forEach(animation => animation.cancel())
      animations.clear()
      counters.forEach(cancelAnimationFrame)
      counters.clear()
      root.querySelectorAll<HTMLElement>('[data-value]').forEach(element => { if (element.firstElementChild) element.firstElementChild.textContent = element.dataset.value ?? '' })
      root.querySelectorAll<HTMLElement>('[style*="will-change"]').forEach(element => element.style.removeProperty('will-change'))
    }
    preference.addEventListener('change', reduce)
    return () => {
      disposed = true
      observer.disconnect()
      navSize.disconnect()
      animations.forEach(animation => animation.cancel())
      counters.forEach(cancelAnimationFrame)
      preference.removeEventListener('change', reduce)
      root.querySelectorAll<HTMLElement>('[style*="will-change"]').forEach(element => element.style.removeProperty('will-change'))
      if (title) { title.textContent = originalTitle; title.removeAttribute('aria-label') }
      delete root.dataset.motionReady
    }
  }, [slug])
  return <article ref={ref} className="cs font-sans" aria-labelledby="project-title">{children}</article>
}
