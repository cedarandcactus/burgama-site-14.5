'use client'

import { useEffect, useRef } from 'react'
import { gsap, createActContext, motionScale } from '@/lib/motion'

/**
 * ACT V — point of view. Typography as the composition.
 *
 * REBUILT. The previous version set each line on its own rounded "plate" and
 * wiped the plates open with clip-path, so the three shapes formed a stepped
 * mass behind the words. That is precisely the treatment the revision rules
 * out: type sitting on decorative geometry, with the shapes — not the words —
 * doing the composing.
 *
 * What replaces it uses nothing but type. The line breaks, the indents and the
 * scale ARE the composition:
 *
 *   The work begins          <- full scale, flush left
 *      with a point of view, <- indented, the sentence turning inward
 *   then becomes a system.   <- returns to the margin, closing the thought
 *
 * The indent on the middle line is the whole device. It gives the block an
 * asymmetric left edge, which is what stops three stacked lines from reading
 * as a centred pull-quote — and it does it with white space rather than with
 * a panel.
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
          The lines rise into place, one clause at a time. This is a plain
          translation — no clip-path, no reveal geometry, no mask — because
          there is no longer a shape to construct. The sentence assembles in
          reading order, which is the only sequence that makes sense for a
          statement whose meaning depends on its clauses arriving in order.

          Held to 34px: enough to feel deliberate, short of a text animation.
        */
        gsap.fromTo(
          scope.querySelectorAll('.say-line'),
          { y: 34 * s, opacity: 0.35 },
          {
            y: 0,
            opacity: 1,
            ease: 'none',
            stagger: 0.14,
            /*
              `fromTo` writes its FROM state during the setup pass, before the
              trigger has anything to scrub against. Measured: all three lines
              sat at opacity 0.35 while the act was still below the fold, so
              the statement was permanently dim to anyone who never scrolled
              it into range — and dim text is a contrast failure, not a style.

              Deferring the initial render leaves the lines at their authored
              CSS values until the trigger actually takes over.
            */
            immediateRender: false,
            scrollTrigger: {
              trigger: scope,
              start: 'top 80%',
              end: 'center 62%',
              scrub: 0.9,
            },
          },
        )

        /*
          ONE slow move after the sentence has settled: the indented middle
          clause drifts a little further in as the act crosses the viewport,
          so the block's silhouette is still developing while it is read.
          A single evolving relationship, which is what the brief allows —
          not three things morphing at once.
        */
        gsap.fromTo(
          scope.querySelector('.say-line--turn'),
          { '--say-indent': '0em' },
          {
            '--say-indent': `${0.9 * s}em`,
            ease: 'none',
            scrollTrigger: {
              trigger: scope,
              start: 'center 62%',
              end: 'bottom top',
              scrub: 1.2,
            },
          },
        )
      }),
    [],
  )

  return (
    <section
      className="msurface msurface--say"
      ref={root}
      /*
        OPEN frame and no container. A statement act with a visible box
        around it would be a pull-quote; without one it is the page speaking
        in its own voice. This is the typography-led beat in the descent.
      */
      data-field="paper"
      data-frame="open"
    >
      <p className="say-stack">
        <span className="say-line">The work begins</span>
        {/* The indented clause: the sentence turning inward. */}
        <span className="say-line say-line--turn">with a point of view,</span>
        <span className="say-line">then becomes a system.</span>
      </p>
    </section>
  )
}
