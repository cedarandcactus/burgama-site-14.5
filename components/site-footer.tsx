import Link from '@/components/transition-link'
import { BrandMark } from '@/components/brand-mark'
import { ModularButton } from '@/components/modular-button'
import { FooterUpdates } from '@/components/footer-updates'
import styles from '@/components/site-footer.module.css'

export function SiteFooter({ home = false }: { home?: boolean }) {
  return (
    <footer className={`${styles.footer} ${home ? styles.home : ''}`}>
      <div className={styles.pattern} aria-hidden="true">
        {Array.from({ length: 10 }, (_, index) => <span key={index} />)}
      </div>
      <div className={styles.content}>
        <div className={styles.invitation}>
          <h2 className="font-serif text-balance">something in mind?<br />let&apos;s make it happen.</h2>
          <ModularButton href="mailto:hello@burgama.com">start a conversation</ModularButton>
        </div>
        <Link href="/" className={styles.wordmark} aria-label="Burgama home"><BrandMark /></Link>
        <div className={styles.columns}>
          <nav aria-label="Footer" className={styles.column}>
            <h3 className="font-serif">explore</h3>
            <div className={styles.links}><Link href="/work">work</Link><Link href="/studio">studio</Link><Link href="/contact">contact</Link></div>
          </nav>
          <div className={styles.column}>
            <h3 className="font-serif">say hello</h3>
            <a href="mailto:hello@burgama.com">hello@burgama.com</a>
            <p>Austin, Texas.<br />Working wherever the project leads.</p>
          </div>
          <div className={styles.column}>
            <h3 className="font-serif">keep in touch</h3>
            <FooterUpdates />
          </div>
        </div>
        <div className={styles.bottom}>
          <p>Independent by design.</p>
          <p>© {new Date().getFullYear()} Burgama</p>
        </div>
      </div>
    </footer>
  )
}
