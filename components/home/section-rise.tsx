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
      <path d="M 0 100 C 240 100 760 0 1000 0 L 1000 101 L 0 101 Z" fill="currentColor" />
    </svg>
  )
}
