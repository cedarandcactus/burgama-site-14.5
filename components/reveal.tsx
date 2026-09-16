'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

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
  variant?: 'block' | 'section'
  className?: string
  as?: 'div' | 'section' | 'li' | 'figure'
}) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node || !('IntersectionObserver' in window)) return
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
  }, [])

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
