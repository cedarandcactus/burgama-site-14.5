import type { ComponentProps } from 'react'
import Link from '@/components/transition-link'
import { CircularArrowIcon } from '@/components/circular-arrow-icon'
import { cn } from '@/lib/utils'

type DirectionLinkProps = Omit<ComponentProps<typeof Link>, 'children'> & {
  label: string
  eyebrow?: string
  direction?: 'left' | 'right'
}

export function DirectionLink({ label, eyebrow, direction = 'right', className, ...props }: DirectionLinkProps) {
  return (
    <Link className={cn('studio-direction-link', className)} data-direction={direction} {...props}>
      {direction === 'left' && <CircularArrowIcon direction="left" />}
      <span className="studio-direction-copy">{eyebrow && <small>{eyebrow}</small>}<span>{label}</span></span>
      {direction === 'right' && <CircularArrowIcon />}
    </Link>
  )
}
