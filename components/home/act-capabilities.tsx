'use client'

import { useEffect, useRef } from 'react'
import { gsap, createActContext, motionScale, prefersReducedMotion } from '@/lib/motion'

/**
 * ACT VI — capabilities, and the homepage's ONE pinned sequence.
 *
 * The capability language is taken verbatim from the studio page so the two
 * pages cannot drift apart. No cards, no icons, no paragraph under each line.
 *
 * The choreography is a designer repositioning a physical object: it settles,
 * lifts, then moves aside — and the space it vacates is where the typography
 * arrives. The object never spins and never loops, and it stays SQUARE to the
 * page throughout: no rotation at any point in the sequence.
 *
 * The RESTING CSS state is the finished composition (object left, type right,
 * everything visible). The timeline animates backwards from an establishing
 * state, which means reduced-motion users and no-JS users get the settled
 * layout rather than an empty section waiting for an animation.
 */

/* Verbatim from app/studio/page.tsx — real studio language, not a rewrite. */
const CAPABILITIES = [
  'Brand identity and direction',
  'Digital design and development',
  'Campaigns and content systems',
  'Positioning and creative strategy',
]

export function ActCapabilities() {
  const root = useRef<HTMLElement>(null)

  useEffect(
    () =>
      createActContext(root.current, ({ scope }) => {
        const s = motionScale()
        const short = prefersReducedMotion() || s < 1

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: scope,
            start: 'top top',
            /*
              ~185vh of scroll on desktop for the whole sequence, cut to
              ~105vh on narrow screens where a long pin is far more likely to
              feel like the page has stopped responding.
            */
            end: short ? '+=105%' : '+=185%',
            pin: true,
            /*
              Pin the surface but keep the scrub loose enough that the object
              still feels weighted rather than welded to the wheel.
            */
            scrub: 1,
            anticipatePin: 1,
          },
        })

        const object = scope.querySelector('.cap-object')

        /*
          The "move aside" only exists in the two-column desktop composition,
          where the object genuinely vacates space to its right for the type.
          On the stacked mobile layout the object is already full width, so a
          sideways offset just pushes it off the surface and over the heading
          — which is exactly what it did before this check. There it stays put
          and only the scale and rotation carry the gesture.
        */
        const sideBySide = window.matchMedia('(min-width: 62rem)').matches
        const aside = sideBySide ? 18 : 0

        /*
          1–2. Establish, then lift. The object starts larger and centred,
          occupying the whole surface, and rises slightly as it recedes.
        */
        /*
          Same reasoning for the establishing scale: the desktop object has
          slack around it to grow into, but the mobile one is already the full
          width of the surface, so anything above 1 spills past both edges.
        */
        tl.fromTo(
          object,
          {
            xPercent: aside,
            yPercent: 6,
            scale: sideBySide ? 1.16 : 1,
          },
          {
            yPercent: 0,
            scale: sideBySide ? 1.08 : 1,
            ease: 'none',
            duration: 1,
          },
        )
          /*
            3–5. The move aside. This used to also turn the object 5–10
            degrees, which is removed: the pictures stay square to the page.
            The repositioning gesture now reads through the scale and the
            lateral move alone, and the object lands upright.
          */
          .to(
            object,
            {
              xPercent: 0,
              scale: 1,
              ease: 'none',
              duration: 1.4,
            },
            '>-0.15',
          )
          /*
            6. The typography arrives in the space the object just vacated,
            wiped open from the left like the statement plates rather than
            the usual fade-and-rise. Consistent construction language, and it
            avoids the one entrance pattern the brief bans outright.
          */
          .fromTo(
            scope.querySelectorAll('.cap-line'),
            { clipPath: 'inset(0 100% 0 0)', x: 14 * s },
            {
              clipPath: 'inset(0 0% 0 0)',
              x: 0,
              ease: 'none',
              stagger: 0.14,
              duration: 1,
            },
            '>-0.9',
          )
          /* 7. Settle — a small hold so the composition is readable at rest. */
          .to({}, { duration: 0.5 })
      }),
    [],
  )

  return (
    <section
      className="msurface msurface--cap"
      ref={root}
      aria-labelledby="cap-title"
      data-field="panel"
    >
      <div className="cap-object">
        <img
          src="/research/extrusion-study.png"
          alt="Cast letterform blocks in periwinkle and navy, grouped into a solid mass"
          loading="lazy"
        />
      </div>

      <div className="cap-copy">
        <h2 id="cap-title" className="cap-title">
          What we do
        </h2>
        <ul className="cap-list">
          {CAPABILITIES.map((item) => (
            <li key={item} className="cap-line">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
