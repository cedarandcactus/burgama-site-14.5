'use client'

import Image from 'next/image'
import { useLayoutEffect, useRef } from 'react'
import { gsap } from '@/lib/motion'
import styles from './portfolio-motion.module.css'

type Props = { src: string; alt: string; sizes?: string; strength?: number; priority?: boolean }
export function ParallaxImage({ src, alt, sizes = '(max-width: 960px) 90vw, 960px', strength = 3, priority = false }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  useLayoutEffect(() => {
    const root = ref.current
    if (!root || strength === 0) return
    const media = gsap.matchMedia()
    media.add({ all: '(min-width: 0px)', mobile: '(max-width: 768px)', reduce: '(prefers-reduced-motion: reduce)' }, context => {
      if (context.conditions?.reduce) return
      const amount = Math.min(strength, context.conditions?.mobile ? 1.5 : 3)
      root.dataset.parallaxActive = 'true'
      gsap.fromTo(root, { y: -amount }, {
        y: amount, ease: 'none',
        scrollTrigger: {
          trigger: root.parentElement, start: 'top bottom', end: 'bottom top', scrub: .8,
          onToggle: self => { root.style.willChange = self.isActive ? 'transform' : '' },
        },
      })
      return () => { delete root.dataset.parallaxActive; root.style.removeProperty('will-change') }
    })
    return () => media.revert()
  }, [src, strength])
  const stem = src.replace(/\.[^.]+$/, '')
  return <span ref={ref} className={styles.viewport} data-parallax-frame="" data-parallax-strength={Math.min(strength, 3)}>
    <picture>
      <source srcSet={[640, 960, 1440, 2400].map(width => `${stem}-${width}.webp ${width}w`).join(', ')} sizes={sizes} />
      <Image src={src} alt={alt} fill sizes={sizes} unoptimized loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} decoding="async" />
    </picture>
  </span>
}
