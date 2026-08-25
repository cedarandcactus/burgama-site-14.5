'use client'

import { useEffect, useRef } from 'react'
import { gsap, createActContext, motionScale } from '@/lib/motion'

/**
 * ACT V — point of view. The one place the plate system is used.
 *
 * Three line groups, three plates. Each plate hugs its own line, and because
 * the three widths and offsets differ the group resolves into a single stepped
 * architectural mass rather than a card with a headline in it.
 *
 * The geometry exists BECAUSE of the line breaks. Change the copy and the
 * silhouette has to be re-tuned — that is the point of the treatment, and the
 * reason it appears exactly once on the page.
 *
 * The statement is Burgama's existing line, already used as the site
 * description: the work begins with a point of view, then becomes a system.
 *
 * No heading. The sentence states what it is.
 */
export function ActStatement() {
  const root = useRef<HTMLElement>(null)

  useEffect(
    () =>
      createActContext(root.current, ({ scope }) => {
        const s = motionScale()

        /*
          Construction, not a fade. Each plate is wiped open with clip-path
          from a different edge so the mass assembles itself:
            plate 1 → left to right
            plate 2 → right to left
            plate 3 → barely moves, just a short opening

          clip-path rather than scaleX because scaling a rounded rectangle
          distorts its corner radii, and the corner language is the one thing
          holding this to the rest of the site.
        */
        const wipes: [string, string][] = [
          ['.plate--a', 'inset(0 100% 0 0 round var(--plate-radius))'],
          ['.plate--b', 'inset(0 0 0 100% round var(--plate-radius))'],
          ['.plate--c', 'inset(0 62% 0 0 round var(--plate-radius))'],
        ]

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: scope,
            start: 'top 78%',
            end: 'center center',
            scrub: 1,
          },
        })

        wipes.forEach(([selector, from], i) => {
          tl.fromTo(
            scope.querySelector(selector),
            { clipPath: from },
            {
              clipPath: 'inset(0 0 0 0 round var(--plate-radius))',
              ease: 'none',
            },
            /*
              Slightly staggered starts rather than simultaneous, so the
              silhouette builds in a readable order instead of all three
              edges moving at once.
            */
            i * 0.12,
          )
        })

        /*
          The type itself moves very little — the plates do the work. 22px of
          travel is enough to feel mechanically related to the geometry
          without turning into a text animation.
        */
        tl.fromTo(
          scope.querySelectorAll('.plate-line'),
          { y: 22 * s },
          { y: 0, ease: 'none', stagger: 0.08 },
          0,
        )

        /*
          ONE evolving edge, after the reveal has settled. The bottom plate
          keeps extending slightly as the user scrolls through the rest of
          the composition. Only this edge moves; morphing all of them is
          explicitly what the brief warns against.
        */
        gsap.fromTo(
          scope.querySelector('.plate--c'),
          { '--plate-extend': '0rem' },
          {
            '--plate-extend': `${4 * s}rem`,
            ease: 'none',
            scrollTrigger: {
              trigger: scope,
              start: 'center center',
              end: 'bottom top',
              scrub: 1.2,
            },
          },
        )
      }),
    [],
  )

  return (
    <section className="msurface msurface--say" ref={root} data-field="paper">
      <p className="plate-stack">
        {/*
          Each line is its own plate. The widths step: wide, inset and
          narrower, then wider again — which is what produces the stepped
          outer silhouette.
        */}
        <span className="plate plate--a">
          <span className="plate-line">The work begins</span>
        </span>
        <span className="plate plate--b">
          <span className="plate-line">with a point of view,</span>
        </span>
        <span className="plate plate--c">
          <span className="plate-line">then becomes a system.</span>
        </span>
      </p>
    </section>
  )
}
