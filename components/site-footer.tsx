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
          <nav key={column.heading} aria-label={column.heading} className="footer-column">
            <p className="footer-heading">{column.heading}</p>
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
