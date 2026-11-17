'use client'

import { useLayoutEffect, useRef, type ReactNode } from 'react'
import { usePortfolioMotion } from '@/components/use-portfolio-motion'

export function CaseStudyMotion({ slug, children }: { slug: string; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null)
  usePortfolioMotion(ref, slug)
  useLayoutEffect(() => {
    const root = ref.current
    const nav = document.querySelector<HTMLElement>('.cyan-menu-trigger')
    if (!root || !nav) return
    // Read literal nav properties without changing the shared navigation.
    const calibrate = () => {
      const style = getComputedStyle(nav)
      root.style.setProperty('--cs-pill-border', style.borderTopWidth)
      root.style.setProperty('--cs-pill-radius', style.borderTopLeftRadius)
      root.style.setProperty('--cs-pill-padding', style.paddingInlineStart)
    }
    calibrate()
    const observer = new ResizeObserver(calibrate)
    observer.observe(nav)
    return () => observer.disconnect()
  }, [])
  return <article ref={ref} className="cs font-sans" aria-labelledby="project-title" data-motion-scope="">{children}</article>
}
