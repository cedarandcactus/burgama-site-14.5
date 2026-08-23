/**
 * Dingbat indexing — the site's ONE numbering language.
 *
 * The global rules make dingbats a primary design element and forbid mixing
 * numbering systems (no `01` here and `②` there, no switching to roman or to
 * a bare digit). Both indexes previously printed `String(i).padStart(2,'0')`,
 * which produced the `01 / title / metadata / divider` row the rules single
 * out as generic CMS UI. Everything that indexes now calls this instead.
 *
 * These are real Unicode glyphs (U+2460 onward), not SVG circles or a CSS
 * approximation, which is what the "use real font glyphs" rule asks for.
 * Past the glyph range the numeral is printed plain rather than faked — a
 * silently wrong index is worse than an unstyled one.
 */
const CIRCLED_ONE = 0x2460
const CIRCLED_MAX = 20

export function dingbat(n: number): string {
  if (!Number.isInteger(n) || n < 1) return ''
  if (n > CIRCLED_MAX) return String(n)
  return String.fromCodePoint(CIRCLED_ONE + n - 1)
}

/**
 * `n` is 1-based. The glyph carries no information a screen reader needs
 * beyond its number, and "circled digit two" is noise in a list of projects,
 * so the visible glyph is hidden and a plain number is exposed instead.
 */
export function Dingbat({ n, className }: { n: number; className?: string }) {
  const glyph = dingbat(n)
  if (!glyph) return null

  return (
    <span className={className}>
      <span aria-hidden="true">{glyph}</span>
      <span className="sr-only">{n}</span>
    </span>
  )
}
