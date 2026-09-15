import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function CircularArrowIcon({ className }: { className?: string }) {
  return (
    <ArrowRight
      className={cn('circular-arrow-icon', className)}
      aria-hidden="true"
      focusable="false"
      strokeWidth={1.5}
    />
  )
}
