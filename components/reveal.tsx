'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { gsap } from '@/lib/motion'

/**
 * One-way entrances share an observer trigger and CSS timing. Section mode
 * choreographs direct children without nesting transforms on the whole block.
 * Content stays visible until the observer is ready, including without JS.
 */
export function Reveal({
  children,
  delay = 0,
  variant = 'block',
  className,
  as: Tag = 'div',
}: {
  children: React.ReactNode
  delay?: number
  variant?: 'block' | 'section' | 'scroll'
  className?: string
  as?: 'div' | 'section' | 'li' | 'figure'
}) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (variant === 'scroll') {
      const media = gsap.matchMedia()
      media.add({ motion: '(prefers-reduced-motion: no-preference)', wide: '(min-width: 700px)' }, (context) => {
        if (!context.conditions?.motion) return
        const amount = context.conditions.wide ? 1 : 0.45
        const children = Array.from(node.children)
        gsap.fromTo(children, {
          y: (index: number) => Math.max(24, 56 - index * 14) * amount,
        }, {
          y: (index: number) => -Math.max(16, 44 - index * 12) * amount,
          ease: 'none',
          scrollTrigger: {
            trigger: node,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.55,
            invalidateOnRefresh: true,
          },
        })
      })
      return () => media.revert()
    }
    if (!('IntersectionObserver' in window)) return
    setReady(true)
    if (node.getBoundingClientRect().top < window.innerHeight * .92) {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        // One-way: blocks settle once and never animate back out.
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      // Fire slightly before the block is fully on screen.
      { rootMargin: '0px 0px -8% 0px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [variant])

  return (
    <Tag
      // @ts-expect-error -- one ref type across the small set of allowed tags
      ref={ref}
      className={cn('reveal', className)}
      data-visible={visible}
      data-ready={ready}
      data-reveal={variant}
      onFocusCapture={() => setVisible(true)}
      style={{ '--reveal-delay': `${Math.min(160, Math.max(0, delay))}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  )
}
