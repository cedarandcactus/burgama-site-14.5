'use client'

import Link from 'next/link'
import { ArrowUpRight, Mail } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { IconControl } from '@/components/icon-control'
import { gsap, createActContext } from '@/lib/motion'

/**
 * ACTS VII + VIII — studio, then contact uncovered beneath it.
 *
 * Both surfaces are sticky at the top of the viewport inside a taller
 * wrapper, with studio stacked above contact. As the wrapper is scrolled,
 * studio travels up and off while contact — already in place behind it —
 * barely moves. The page ends by having its last layer lifted off rather than
 * by fading a footer in underneath.
 *
 * IMPORTANT: the sticky stack is only switched on (`data-handoff="on"`) once
 * the animation has actually been installed. If GSAP never runs — reduced
 * motion, a script failure — the two surfaces stay in ordinary document flow
 * and contact is reachable by scrolling like any other section. Without that
 * guard the covering surface would sit over contact permanently.
 *
 * Contact also carries the site's essential footer information, so the
 * homepage does not append a separate generic footer after its own ending.
 */
export function ActClose() {
  const wrap = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = wrap.current
    if (!el) return

    const teardown = createActContext(el, ({ scope }) => {
      scope.setAttribute('data-handoff', 'on')

      gsap.to(scope.querySelector('.handoff-over'), {
        yPercent: -100,
        ease: 'none',
        scrollTrigger: {
          trigger: scope,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.8,
        },
      })
    })

    return () => {
      teardown()
      el.removeAttribute('data-handoff')
    }
  }, [])

  return (
    <div className="handoff" ref={wrap}>
      {/*
        STUDIO — quiet and factual. A real description, the real working
        arrangement, and a lot of air. No mission statement, no values, no
        team grid, no invented philosophy.
      */}
      <section
        className="msurface handoff-over msurface--studio"
        aria-labelledby="studio-title"
        data-field="paper"
      >
        <h2 id="studio-title" className="studio-lead">
          Burgama shapes identities and digital experiences for people with
          something meaningful to make.
        </h2>

        <div className="studio-facts">
          <p className="studio-note">
            Small, senior teams. No account layer between planning the work and
            making it.
          </p>
          <p className="studio-note">Austin, Texas. Working wherever the project leads.</p>
        </div>

        <Link href="/studio" className="studio-more">
          More about the studio
        </Link>
      </section>

      {/*
        CONTACT — the physical conclusion. One line, the address at scale, and
        substantial icon controls instead of a stack of text CTAs.
      */}
      <section
        className="msurface handoff-under msurface--contact"
        aria-labelledby="contact-title"
        data-field="panel"
      >
        <div className="contact-body">
          <h2 id="contact-title" className="contact-lead">
            Tell us what you are making and where it needs to go.
          </h2>

          <div className="contact-row">
            {/*
              `close-email`, not `contact-address` — /contact already owns
              `.contact-address` as a block container. Reusing the name would
              have inherited its layout here and let a later edit to either
              page silently change the other.
            */}
            <a href="mailto:hello@burgama.com" className="close-email">
              hello@burgama.com
            </a>
            <div className="contact-controls">
              <IconControl
                label="Email the studio"
                href="mailto:hello@burgama.com"
                tone="strong"
              >
                <Mail strokeWidth={1.5} />
              </IconControl>
              <IconControl label="Go to the contact page" href="/contact">
                <ArrowUpRight strokeWidth={1.5} />
              </IconControl>
            </div>
          </div>
        </div>

        {/*
          Essential footer information, living inside the final composition.
          Three real destinations and the wordmark — not a four-column
          sitemap of small links.
        */}
        <div className="contact-foot">
          <nav className="contact-links" aria-label="Site">
            <Link href="/work">Work</Link>
            <Link href="/studio">Studio</Link>
            <Link href="/contact">Contact</Link>
          </nav>
          <p className="contact-mark wordmark" aria-hidden="true">
            Burgama
          </p>
        </div>
      </section>
    </div>
  )
}
