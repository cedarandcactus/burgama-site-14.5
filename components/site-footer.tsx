import Link from '@/components/transition-link'
import { BrandMark } from '@/components/brand-mark'
import { ModularButton } from '@/components/modular-button'
import { FooterUpdates } from '@/components/footer-updates'

export function SiteFooter({ home = false }: { home?: boolean }) {
  return (
    <footer className="editorial-footer" {...(home ? { 'data-home-plate': true } : {})}>
      <div className="footer-invitation"><h2 className="font-serif">something in mind?<br />let&apos;s make it happen.</h2><ModularButton href="mailto:hello@burgama.com">hello@burgama.com</ModularButton></div>
      <div className="footer-navigation"><nav aria-label="Footer"><Link href="/work">work</Link><Link href="/studio">studio</Link><Link href="/contact">contact</Link></nav><FooterUpdates /><p>Austin, Texas.<br />Working wherever the project leads.</p></div>
      <div className="footer-identity"><BrandMark withMark /><p className="caption">Independent by design.<br />© {new Date().getFullYear()} Burgama</p></div>
    </footer>
  )
}
