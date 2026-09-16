import { ArrowLeft, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function CircularArrowIcon({ className, direction = 'right' }: { className?: string; direction?: 'left' | 'right' }) {
  const Arrow = direction === 'left' ? ArrowLeft : ArrowRight
  return (
    <Arrow
      className={cn('circular-arrow-icon', className)}
      aria-hidden="true"
      focusable="false"
      size={20}
      strokeWidth={2}
    />
  )
}
