/**
 * Category cluster — disciplines as a tight bunch of small rectangular
 * category buttons.
 *
 * Replaces the `Brand · Digital · Motion` metadata line. The global rules
 * prohibit that dot-joined tracked list as passive text under a title and say
 * that when those concepts must appear they use the category-button
 * vocabulary — not a chip/tag/badge that does the same job.
 *
 * These are `.cat`, the smaller relative of the action button: same flat
 * construction, same rectangle, same typography, less physical mass. It is a
 * smaller BLOCK — the label stays at reading size, and must never be shrunk
 * into caps.
 *
 * `.cat` is deliberately NOT a `.btn` modifier. An action button is a label
 * body joined to an arrow region; a category has no arrow region, so sharing
 * the class would have meant either an arrow where none belongs or a `.btn`
 * whose defining structure is switched off.
 *
 * Rendered as SPANS, not buttons or links. These clusters sit inside the
 * row-level `<a>` of an index, and nesting interactive elements inside an
 * anchor is invalid HTML — the row is the click target, these are its
 * labels. The recessed fill keeps them from out-shouting the project name,
 * which the rules want to hold the authority in a work index.
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
        <span key={item} className="cat">
          {item}
        </span>
      ))}
    </span>
  )
}
