import Link from 'next/link'
import { BrandMark } from '@/components/brand-mark'

const COLUMNS = [
  {
    label: 'Explore',
    links: [
      { label: 'Selected work', href: '/work' },
      { label: 'Studio', href: '/studio' },
      { label: 'Capabilities', href: '/studio#capabilities' },
      { label: 'Approach', href: '/studio#approach' },
    ],
  },
  {
    label: 'Studio',
    links: [
      { label: 'Austin, Texas', href: '/studio' },
      { label: 'Independent', href: '/studio' },
      { label: 'Start a project', href: '/contact' },
    ],
  },
  {
    label: 'Connect',
    links: [
      { label: 'hello@burgama.com', href: 'mailto:hello@burgama.com', external: true },
      { label: 'Instagram', href: 'https://www.instagram.com/', external: true },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/', external: true },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="ed-footer">
      <div className="ed-footer-card">
        <div className="ed-footer-top">
          <Link href="/" aria-label="Burgama, home" className="ed-footer-brand">
            <BrandMark className="h-auto w-[150px] min-[700px]:w-[210px]" />
          </Link>

          <nav aria-label="Footer" className="ed-footer-columns">
            {COLUMNS.map((column) => (
              <div key={column.label} className="ed-footer-column">
                <p className="ed-footer-label">{column.label}</p>
                <ul className="ed-footer-list">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      {'external' in link && link.external ? (
                        <a href={link.href} className="ed-footer-link">
                          {link.label}
                        </a>
                      ) : (
                        <Link href={link.href} className="ed-footer-link">
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="ed-footer-base">
          <p className="ed-footer-fine">
            © {new Date().getFullYear()} Burgama. All rights reserved.
          </p>
          <p className="ed-footer-fine">Design-led creative studio · Austin, Texas</p>
        </div>
      </div>
    </footer>
  )
}
