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
    /*
      The footer is a modular FIELD with an inward notch carved into its top
      edge: material stays high on both shoulders and steps down in the
      middle. It uses the shared `.mfield--recess-top` variant, so the
      geometry is the same language as everything else — no bespoke curves.

      This required the footer to become a `--panel` surface. It was
      `--navy`, which is an alias of `--paper`, on a `--paper` page with a
      `transparent` rule: the notch would have been carved out of a colour
      identical to its background and been completely invisible. A stepped
      edge only exists if there are two tones for it to step between.

      The shape pieces are decorative, so they carry `aria-hidden` and the
      real content stays in `.mfield-body`.
    */
    <footer className="page-footer mfield mfield--recess-top">
      <i className="mfield-tab mfield-tab-l" aria-hidden="true" />
      <i className="mfield-tab mfield-tab-r" aria-hidden="true" />
      <i className="mfield-fil mfield-fil-l" aria-hidden="true" />
      <i className="mfield-fil mfield-fil-r" aria-hidden="true" />

      <div className="mfield-body">
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
      </div>
    </footer>
  )
}
