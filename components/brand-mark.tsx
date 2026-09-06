import { BurgamaMark } from '@/components/burgama-mark'

export function BrandMark({ className = '', withMark = false }: { className?: string; withMark?: boolean }) {
  return <span className={`brand-lockup ${className}`}>{withMark && <BurgamaMark />}<span className="wordmark font-serif">burgama</span></span>
}
