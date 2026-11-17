'use client'

import { useLayoutEffect, type RefObject } from 'react'
import { gsap, ScrollTrigger } from '@/lib/motion'
import { CustomEase } from 'gsap/CustomEase'

if (typeof window !== 'undefined') gsap.registerPlugin(CustomEase)

export function usePortfolioMotion(ref: RefObject<HTMLElement | null>, key: string) {
  useLayoutEffect(() => {
    const root = ref.current
    if (!root) return
    const mainEase = CustomEase.create('portfolio-main', '0.22,1,0.36,1')
    const seen = new WeakSet<Element>()
    const media = gsap.matchMedia()
    media.add({ all: '(min-width: 0px)', reduce: '(prefers-reduced-motion: reduce)' }, context => {
      const reduced = Boolean(context.conditions?.reduce)
      const owned = (selector: string) => Array.from(root.querySelectorAll<HTMLElement>(selector)).filter(element => element.closest('[data-motion-scope]') === root)
      const observer = new IntersectionObserver(entries => entries.forEach(entry => {
        if (!entry.isIntersecting) return
        const element = entry.target as HTMLElement
        observer.unobserve(element)
        if (seen.has(element)) return
        seen.add(element)
        element.dataset.motionSeen = 'true'
        const kind = element.dataset.csReveal
        const stagger = Number(element.dataset.csIndex ?? 0)
        const scope = gsap.context(() => {
          if (kind === 'stat') {
            const final = element.dataset.value ?? ''
            const text = element.firstElementChild
            if (reduced || !text) return
            const decimals = final.includes('.') ? final.split('.')[1].replace(/\D/g, '').length : 0
            const target = Number(final.replace(/[^\d.]/g, ''))
            const suffix = final.replace(/[\d,.]/g, '')
            const counter = { value: 0 }
            gsap.to(counter, { value: target, duration: 1.2, ease: mainEase, onUpdate: () => { text.textContent = `${counter.value.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}` }, onComplete: () => { text.textContent = final } })
          } else if (reduced) {
            gsap.fromTo(element, { opacity: 0 }, { opacity: 1, duration: .4, clearProps: 'opacity' })
          } else if (element.hasAttribute('data-motion-heading')) {
            gsap.fromTo(element.querySelectorAll('[data-motion-word]'), { yPercent: 110 }, { yPercent: 0, duration: .8, stagger: .06, ease: mainEase, clearProps: 'transform' })
          } else if (kind === 'media') {
            gsap.fromTo(element, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: .6, delay: stagger * .06, ease: mainEase, clearProps: 'opacity,transform' })
          } else {
            gsap.fromTo(element, { opacity: 0, y: kind === 'card' ? 10 : 8 }, { opacity: 1, y: 0, duration: .8, delay: stagger * (kind === 'card' ? .08 : .06), ease: mainEase, clearProps: 'opacity,transform' })
          }
        }, root)
        scopes.push(scope)
      }), { threshold: .25 })
      const scopes: gsap.Context[] = []
      owned('[data-motion-heading], [data-cs-reveal]').forEach(element => observer.observe(element))
      root.dataset.motionReady = 'true'
      let frame = requestAnimationFrame(() => ScrollTrigger.refresh())
      return () => {
        observer.disconnect()
        scopes.forEach(scope => scope.revert())
        cancelAnimationFrame(frame)
        owned('[data-value]').forEach(element => { if (element.firstElementChild) element.firstElementChild.textContent = element.dataset.value ?? '' })
        delete root.dataset.motionReady
      }
    })
    return () => media.revert()
  }, [key, ref])
}
