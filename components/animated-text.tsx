'use client'

import { useEffect, useRef, useState } from 'react'

type AnimatedTextProps = {
  /** Each entry is one clipped phrase line. */
  lines: string[]
  as?: 'p' | 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  id?: string
  className?: string
  lineClassName?: string
  /** Milliseconds added before the first line unfolds. */
  delay?: number
}

/**
 * Clipped, fully opaque phrase reveal.
 * Text unfolds vertically out of a mask and settles — no opacity or blur fades.
 */
export function AnimatedText({
  lines,
  as: Tag = 'p',
  id,
  className = '',
  lineClassName = '',
  delay = 0,
}: AnimatedTextProps) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.disconnect()
          }
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.15 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag ref={node => { ref.current = node }} id={id} className={className}>
      {lines.map((line, index) => (
        <span key={line + index} className="block overflow-hidden">
          <span
            className={`block will-change-transform ${lineClassName}`}
            style={{
              transform: visible
                ? 'translate3d(0,0,0) scaleY(1)'
                : 'translate3d(0,108%,0) scaleY(0.92)',
              transformOrigin: 'top',
              transition:
                'transform 0.78s cubic-bezier(0.16, 1, 0.3, 1)',
              transitionDelay: `${delay + index * 80}ms`,
            }}
          >
            {line}
          </span>
        </span>
      ))}
    </Tag>
  )
}
