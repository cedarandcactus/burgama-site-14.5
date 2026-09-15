import Link from '@/components/transition-link'
import styles from '@/components/site-footer.module.css'

export function SiteFooter({ home = false, work = false }: { home?: boolean; work?: boolean }) {
  return <footer className={styles.footer} data-home={home} data-work={work}>
    <div className={styles.content}>
      <div className={styles.invitation}>
        <h2 className="font-serif">have something worth making?</h2>
        <div className={styles.invitationAction}>
          <p>Bring us the idea, the problem, or the half-finished thought. We&apos;ll help make it clear and make it work.</p>
          <a className={styles.emailButton} href="mailto:hello@burgama.com">start a project</a>
        </div>
      </div>
      <div className={styles.directory}>
        <nav className={styles.links} aria-label="Footer"><Link href="/work">work</Link><Link href="/studio">about</Link><Link href="/ideas">ideas</Link><Link href="/contact">contact</Link></nav>
        <a className={styles.email} href="mailto:hello@burgama.com">hello@burgama.com</a>
        <p className={styles.location}>Austin, Texas<br />Working wherever you are</p>
      </div>
      <div className={styles.identity}>
        <Link href="/" className={`${styles.wordmark} font-serif`} aria-label="Burgama home">burgama</Link>
      </div>
    </div>
  </footer>
}
