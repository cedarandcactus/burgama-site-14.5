'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

/**
 * The one entrance used site-wide. A single IntersectionObserver per block
 * sets `data-visible`; all timing and easing live in CSS (`.reveal`) so every
 * block resolves on the same long curve and nothing feels snappier than
 * anything else.
 *
 * `delay` staggers siblings. Keep it small — the slowness should come from
 * the duration, not from waiting.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = 'div',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
  as?: 'div' | 'section' | 'li' | 'figure'
}) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        // One-way: blocks settle once and never animate back out.
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      // Fire slightly before the block is fully on screen.
      { rootMargin: '0px 0px -12% 0px' },
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
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  )
}
