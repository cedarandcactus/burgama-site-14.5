import styles from './home-page.module.css'

export function SectionRise({ surface }: { surface: 'work' | 'studio' }) {
  return (
    <svg
      className={styles.sectionRise}
      data-surface={surface}
      viewBox="0 0 1000 100"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M 0 100 C 340 100 650 0 1000 0 L 1000 101 L 0 101 Z" fill="currentColor" />
    </svg>
  )
}
