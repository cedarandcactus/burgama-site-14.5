import type { IdeaVisual } from '@/lib/editorial'
import styles from './editorial.module.css'

export function EditorialArtwork({ visual, className }: { visual: IdeaVisual; className?: string }) {
  return (
    <div className={`${styles.artwork}${className ? ` ${className}` : ''}`} data-visual={visual} aria-hidden="true">
      {Array.from({ length: 6 }, (_, index) => <span key={index} />)}
    </div>
  )
}
