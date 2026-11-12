import Link from 'next/link'
import styles from './page.module.css'

/* The site header is hidden on ad landing pages. Brand guide: the wordmark
   introduces the name on an opening page, used alone (no symbol lockup). */
export function LandingMark() {
  return (
    <div className={styles.landingMark}>
      <span className={styles.wordmark} role="img" aria-label="Burgama">burgama</span>
    </div>
  )
}

/* Ad landing pages get a minimal footer: legal links only, no navigation
   or second form competing with the check. */
export function LandingFooter() {
  return (
    <footer className={styles.landingFooter}>
      <p>© {new Date().getFullYear()} Burgama, Austin, Texas</p>
      <nav aria-label="Legal">
        <Link href="/privacy">Privacy</Link>
        <Link href="/cookies">Cookies</Link>
        <Link href="/terms">Terms</Link>
      </nav>
    </footer>
  )
}
