import Link from '@/components/transition-link'
import { FooterUpdates } from '@/components/footer-updates'
import styles from '@/components/site-footer.module.css'

export function SiteFooter({ home = false, work = false }: { home?: boolean; work?: boolean }) {
  return <footer className={styles.footer} data-home={home} data-work={work} data-scroll-palette={home ? 'footer' : undefined}>
    <div className={styles.content}>
      <div className={styles.columns}>
        <div className={styles.contact}>
          <nav className={styles.links} aria-label="Footer"><Link href="/work">work</Link><Link href="/studio">studio</Link><Link href="/contact">contact</Link></nav>
          <div className={styles.details}><a href="mailto:hello@burgama.com">hello@burgama.com</a><p>Austin, Texas.<br />Working wherever you are.</p></div>
        </div>
        <div className={styles.newsletter}><FooterUpdates /></div>
      </div>
      <Link href="/" className={`${styles.wordmark} font-serif`} aria-label="Burgama home">burgama</Link>
      <div className={styles.bottom}><p>Independent by design.</p><p>© {new Date().getFullYear()} Burgama</p></div>
    </div>
  </footer>
}
