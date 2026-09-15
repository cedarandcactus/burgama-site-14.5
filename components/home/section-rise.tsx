import { homeCurvePath } from '@/lib/home-curve'
import styles from './home-page.module.css'

export function SectionRise({ surface, direction = 'right' }: { surface: 'powder' | 'powder-deep' | 'navy'; direction?: 'left' | 'right' }) {
  return (
    <svg
      className={styles.sectionRise}
      data-surface={surface}
      data-direction={direction}
      data-nav-surface={surface === 'navy' ? 'ink' : 'frost'}
      viewBox="0 0 1000 100"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path d={`${homeCurvePath(1000, 100)} L 1000 101 L 0 101 Z`} fill="currentColor" />
    </svg>
  )
}
