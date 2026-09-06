import Link from 'next/link'
import { BrandMark } from '@/components/brand-mark'
import { ModularButton } from '@/components/modular-button'
import { FooterUpdates } from '@/components/footer-updates'
import { FooterStamp } from '@/components/footer-stamp'
import stampStyles from './footer-stamp.module.css'

export function SiteFooter({ home = false }: { home?: boolean }) {
  return (
    <footer className="editorial-footer" {...(home ? { 'data-home-plate': true } : {})}>
      <div className="footer-invitation"><h2 className="font-serif">something in mind?<br />let&apos;s make it happen.</h2><ModularButton href="mailto:hello@burgama.com">hello@burgama.com</ModularButton></div>
      <div className="footer-navigation"><nav aria-label="Footer"><Link href="/work">work</Link><Link href="/studio">studio</Link><Link href="/contact">contact</Link></nav><FooterUpdates /><p>Austin, Texas.<br />Working wherever the project leads.</p></div>
      <div className={`footer-identity ${stampStyles.identity}`}><BrandMark withMark /><div className={stampStyles.signature}><FooterStamp /><p className="caption">© {new Date().getFullYear()} Burgama</p></div></div>
    </footer>
  )
}
