/**
 * Category cluster — disciplines as a tight bunch of small pills.
 *
 * Replaces the `Brand · Digital · Motion` metadata line. The global rules
 * prohibit that dot-joined tracked list as passive text under a title and say
 * that when those concepts must appear they use the category-button
 * vocabulary. So this reuses the existing `.pill` primitives rather than
 * introducing a chip/tag/badge that does the same job.
 *
 * Rendered as SPANS, not buttons or links. These clusters sit inside the
 * row-level `<a>` of an index, and nesting interactive elements inside an
 * anchor is invalid HTML — the row is the click target, the pills are its
 * labels. `.pill-muted` keeps them recessed so they never out-shout the
 * project name, which the rules want to hold the authority in a work index.
 *
 * Gaps are deliberately small (rules: "tight clusters", "several little
 * objects collected into one graphic unit") and wrapping is allowed, so the
 * cluster reads as one object instead of an evenly spread row.
 */
export function CategoryCluster({
  items,
  className,
}: {
  items: string[]
  className?: string
}) {
  if (items.length === 0) return null

  return (
    <span className={className ? `category-cluster ${className}` : 'category-cluster'}>
      {items.map((item) => (
        <span key={item} className="pill pill-sm pill-muted">
          {item}
        </span>
      ))}
    </span>
  )
}
