import { homeCurvePath } from '@/lib/home-curve'
import styles from './home-page.module.css'

type SectionRiseProps = {
  surface: 'powder' | 'powder-deep' | 'butter' | 'navy' | 'blue-slate' | 'blue-mid' | 'white'
  direction?: 'left' | 'right'
  cutout?: boolean
}

export function SectionRise({ surface, direction = 'right', cutout = false }: SectionRiseProps) {
  const curve = homeCurvePath(1000, 100)

  return (
    <svg
      className={styles.sectionRise}
      data-surface={surface}
      data-direction={direction}
      data-cutout={cutout || undefined}
      data-nav-curve=""
      data-nav-surface={cutout || surface === 'navy' || surface === 'blue-mid' ? 'ink' : 'frost'}
      viewBox="0 0 1000 100"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path d={cutout ? `${curve} L 1000 -1 L 0 -1 Z` : `${curve} L 1000 101 L 0 101 Z`} fill="currentColor" />
    </svg>
  )
}
