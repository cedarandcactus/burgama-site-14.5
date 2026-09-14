import type { IdeaVisual } from '@/lib/editorial'
import styles from './editorial.module.css'

const artworkCopy: Record<
  IdeaVisual,
  { issue: string; title: string; notation: string }
> = {
  audit: { issue: 'FIELD NOTE 01', title: 'AUDIT', notation: 'SIGNAL / NOISE' },
  email: { issue: 'FIELD NOTE 02', title: 'OWNED', notation: 'INBOX / ATTENTION' },
  reviews: { issue: 'FIELD NOTE 03', title: 'JUDGE', notation: 'VS / YOTPO' },
  sitemap: { issue: 'FIELD NOTE 04', title: 'MAP', notation: 'CRAWL / INDEX' },
  platforms: { issue: 'FIELD NOTE 05', title: 'WIX / WP', notation: 'FIT OVER FASHION' },
}

export function EditorialArtwork({
  visual,
  className = '',
}: {
  visual: IdeaVisual
  className?: string
}) {
  const copy = artworkCopy[visual]

  return (
    <div
      className={`${styles.artwork} ${className}`}
      data-visual={visual}
      aria-hidden="true"
    >
      {Array.from({ length: 6 }, (_, index) => (
        <span className={styles.artworkShape} key={index} />
      ))}
      <div className={styles.artworkType}>
        <small>{copy.issue}</small>
        <strong>{copy.title}</strong>
        <em>{copy.notation}</em>
      </div>
    </div>
  )
}
