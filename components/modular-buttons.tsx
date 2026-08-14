'use client'

import Link from 'next/link'
import { LiquidControl, LiquidGroup } from '@/components/liquid-controls'

type Action = {
  label: string
  href: string
  /** Flex basis so the pair fills the rail with intentional unevenness. */
  basis: string
  tone?: 'surface-1' | 'surface-2' | 'surface-3' | 'periwinkle'
}

const TONES = {
  'surface-1': 'bg-surface-1 text-foreground',
  'surface-2': 'bg-surface-2 text-foreground',
  'surface-3': 'bg-surface-3 text-foreground',
  periwinkle: 'bg-periwinkle text-navy',
}

export function ModularButtonGroup({
  actions,
  className = '',
}: {
  actions: Action[]
  className?: string
}) {
  return (
    <LiquidGroup className={`flex gap-module ${className}`}>
      {actions.map((action, index) => {
        const external = action.href.startsWith('mailto:') || action.href.startsWith('http')
        const classes = `liquid-button t-ui flex h-control items-center px-4 ${TONES[action.tone ?? 'surface-1']}`
        const control = external ? (
          <a href={action.href} className={classes}>{action.label}</a>
        ) : (
          <Link href={action.href} className={classes}>{action.label}</Link>
        )

        return (
          <LiquidControl key={action.label} delay={index * 40} className="flex" >
            <span className="flex" style={{ flexBasis: action.basis }}>{control}</span>
          </LiquidControl>
        )
      })}
    </LiquidGroup>
  )
}
