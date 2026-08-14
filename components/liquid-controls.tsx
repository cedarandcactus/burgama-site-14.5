'use client'

import { Liquid } from 'liquid-gooey'
import type { ReactNode } from 'react'

export function LiquidGroup({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <Liquid
      blur={6}
      contrast={18}
      fill="var(--periwinkle)"
      shadow="0 4px 14px rgb(0 0 0 / 0.14), inset 0 1px 0 rgb(255 255 255 / 0.2)"
      filterPadding={32}
      className={`liquid-group ${className}`}
    >
      {children}
    </Liquid>
  )
}

export function LiquidControl({
  children,
  className = '',
  delay = 0,
  x,
  y,
}: {
  children: ReactNode
  className?: string
  delay?: number
  x?: number
  y?: number
}) {
  return (
    <Liquid.Item
      x={x}
      y={y}
      delay={delay}
      transition="bouncy"
      morph={{ shape: true, speed: 1.15, bounce: 0.42, contentBlur: 2 }}
      className={`liquid-item ${className}`}
    >
      {children}
    </Liquid.Item>
  )
}
