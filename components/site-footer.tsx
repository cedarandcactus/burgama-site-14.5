import Link from 'next/link'
import { BrandMark } from '@/components/brand-mark'

/*
  THE FOOTER AS A FINAL COMPOSITION

  This was four columns of 1rem links plus a wordmark — the "sitemap in small
  type" ending that the brief rules out by name. A footer is the last thing
  on the page and should feel like the closing statement of the composition,
  not an afterthought.

  What changed:
    * Four small-link columns → a SHORT list of LARGE destinations.
    * No CTA → a substantial `Start a Project` control, the heaviest object
      in the footer and the reason the destinations can stay quiet.
    * Divider lines and small print → separation by field and space.

  Kept: the `.mfield--recess-top` notch (the shared geometry) and the big
  wordmark closing the page.
*/

/*
  Few and large. `Capabilities` (a #anchor into /studio) was dropped — a
  deep-link fragment is exactly the kind of small utility entry that made the
  old footer read as a sitemap.
*/
const DESTINATIONS = [
  { label: 'Work', href: '/work' },
  { label: 'Studio', href: '/studio' },
  { label: 'Contact', href: '/contact' },
]

export function SiteFooter() {
  return (
    <footer className="page-footer mfield mfield--recess-top" data-field="panel">
      <i className="mfield-tab mfield-tab-l" aria-hidden="true" />
      <i className="mfield-tab mfield-tab-r" aria-hidden="true" />
      <i className="mfield-fil mfield-fil-l" aria-hidden="true" />
      <i className="mfield-fil mfield-fil-r" aria-hidden="true" />

      <div className="mfield-body">
        <div className="footer-major">
          {/*
            The invitation, set at real display scale. The dingbat is written
            INTO the sentence as typography — an inline character at text
            scale, not an icon in a box.
          */}
          <p className="footer-invite">
            Have something worth building?{' '}
            <span aria-hidden="true" className="footer-ding">
              ✳
            </span>
          </p>

          <Link href="/contact" className="footer-cta btn btn-strong btn--long">
            <span className="btn-shape" aria-hidden="true">
              <i className="btn-bar" />
              <i className="btn-bar-tab" />
              <i className="btn-bar-fil" />
              <i className="btn-chip-tongue" />
              <i className="btn-chip-fil" />
              <i className="btn-chip" />
            </span>
            <span className="btn-label">Start a Project</span>
            <span className="btn-arrow" aria-hidden="true">
              <svg viewBox="0 0 22 12" role="presentation">
                <path d="M1 6h19M15 1l5 5-5 5" />
              </svg>
            </span>
          </Link>
        </div>

        {/*
          Three large destinations and the contact details. Still a `nav` with
          an `aria-label` so the grouping is announced, but no printed
          heading — a short list of page names is self-evidently a menu.
        */}
        <div className="footer-lower">
          <nav aria-label="Site" className="footer-destinations">
            {DESTINATIONS.map((item) => (
              <Link key={item.href} href={item.href} className="footer-dest">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="footer-details">
            <Link href="mailto:hello@burgama.com" className="footer-detail">
              hello@burgama.com
            </Link>
            <p className="footer-detail is-quiet">Austin, Texas</p>
          </div>
        </div>

        {/* The wordmark closes the page, set large and flush left. */}
        <div className="footer-sign">
          <BrandMark className="footer-wordmark" />
          <p className="footer-note">
            Independent studio{' '}
            <span aria-hidden="true" className="footer-ding is-small">
              ✳
            </span>
          </p>
        </div>
      </div>
    </footer>
  )
}
