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

/*
 * U+FE0E (VARIATION SELECTOR-15) pins the glyph to its TEXT presentation.
 * Several environments render these as colour emoji instead, which paint
 * their own palette and ignore the CSS `color`, silently introducing a third
 * colour family. Measured in this sandbox on the footer's U+2733: it drew
 * green while its computed colour was correctly periwinkle.
 *
 * Applied here rather than in CSS because `font-variant-emoji` is not yet
 * supported everywhere. It is appended only to the GLYPH branch — a plain
 * numeral past the circled range has no emoji form and must stay untouched.
 */
const TEXT_PRESENTATION = '\uFE0E'

export function dingbat(n: number): string {
  if (!Number.isInteger(n) || n < 1) return ''
  if (n > CIRCLED_MAX) return String(n)
  return String.fromCodePoint(CIRCLED_ONE + n - 1) + TEXT_PRESENTATION
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
