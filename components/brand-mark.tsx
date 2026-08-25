import { BurgamaMark } from '@/components/burgama-mark'

/**
 * The Burgama signature.
 *
 * The wordmark set in Extended is the default and is what the site nav and
 * the footer use. `withMark` additionally places the drawn mark to its left,
 * and is currently used only by the shell's top-left corner control — the one
 * place the revision calls for the mark, on both mobile and desktop.
 *
 * The mark is opt-in rather than always-on so that adding it to the shell does
 * not silently change the footer and nav lockups, which were designed around
 * the wordmark alone.
 */
export function BrandMark({
  className = '',
  withMark = false,
}: {
  className?: string
  withMark?: boolean
}) {
  if (!withMark) return <span className={`wordmark ${className}`}>Burgama</span>

  return (
    <span className={`brand-lockup ${className}`}>
      <BurgamaMark />
      {/*
        Spacing between mark and wordmark is optical, set on the lockup as a
        gap in `em` so it tracks the wordmark's size. Deliberately no divider,
        rule, or separator character between them.
      */}
      <span className="wordmark">Burgama</span>
    </span>
  )
}
