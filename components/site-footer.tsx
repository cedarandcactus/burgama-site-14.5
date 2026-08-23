import Link from 'next/link'
import { BrandMark } from '@/components/brand-mark'

const COLUMNS = [
  {
    heading: 'Menu',
    items: [
      { label: 'Work', href: '/work' },
      { label: 'Studio', href: '/studio' },
      { label: 'Capabilities', href: '/studio#capabilities' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    heading: 'Studio',
    items: [
      { label: 'hello@burgama.com', href: 'mailto:hello@burgama.com' },
      { label: 'Austin, Texas', href: null },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="page-footer">
      <div className="footer-columns">
        {COLUMNS.map((column) => (
          /*
            The visible `MENU` / `STUDIO` headings are gone. Tiny tracked
            uppercase labels announcing "menu" above a list of links, and
            "studio" above an address, are the eyebrow/section-label pattern
            the global rules prohibit — a list of links is self-evidently a
            menu. The heading is kept as the nav's `aria-label`, so the
            grouping is still announced to screen readers without printing a
            label nobody needed to read.
          */
          <nav key={column.heading} aria-label={column.heading} className="footer-column">
            {column.items.map((item) =>
              item.href ? (
                <Link key={item.label} href={item.href} className="footer-link">
                  {item.label}
                </Link>
              ) : (
                <p key={item.label} className="footer-link">
                  {item.label}
                </p>
              ),
            )}
          </nav>
        ))}
      </div>

      {/* The wordmark closes the page, set large and flush left. */}
      <div className="footer-sign">
        <BrandMark className="footer-wordmark" />
        <p className="footer-note">Independent studio</p>
      </div>
    </footer>
  )
}
