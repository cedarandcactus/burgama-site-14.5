'use client'

import { useEffect, useRef } from 'react'
import { gsap, createActContext, motionScale } from '@/lib/motion'

/**
 * ACT III — Research.
 *
 * Deliberately less resolved than the client work: three studies at genuinely
 * different sizes, sitting at different heights, one with a short line beside
 * it and two with nothing. No cards, no taxonomy, no dates, no invented
 * titles — the arrangement itself is what says "this is exploratory".
 *
 * The section sits UNDER the work surface in the stacking order and is
 * uncovered as that surface travels up and away. The relationship between
 * finished output and the thinking around it is carried entirely by that
 * transition; it is never explained in copy.
 */
export function ActResearch() {
  const root = useRef<HTMLDivElement>(null)

  useEffect(
    () =>
      createActContext(root.current, ({ scope }) => {
        const s = motionScale()

        /*
          Loose → organized. Each piece starts a little off its final
          position and settles in as the act crosses the viewport. The
          offsets differ per item so the three read as materials of
          different weights rather than one group sliding together.

          These are small numbers on purpose: the instruction is that they
          must not fly around or feel like a scrapbook.

          TRANSLATION ONLY — no rotation. The pieces used to start at a slight
          angle and straighten as they settled, which meant they were visibly
          tilted for the whole time the act was crossing the viewport. The
          differing weights now read purely through distance and direction.
        */
        const settle: [string, { x?: number; y: number }][] = [
          ['.rstudy--fold', { y: 34, x: -14 }],
          ['.rstudy--plate', { y: -30, x: 10 }],
          ['.rstudy--cast', { y: 46 }],
        ]

        settle.forEach(([selector, from]) => {
          const el = scope.querySelector(selector)
          if (!el) return
          gsap.fromTo(
            el,
            {
              y: (from.y ?? 0) * s,
              x: (from.x ?? 0) * s,
            },
            {
              y: 0,
              x: 0,
              ease: 'none',
              scrollTrigger: {
                trigger: scope,
                start: 'top bottom',
                /*
                  Ends at 60% rather than the bottom so the composition is
                  fully settled and readable while the user is still looking
                  at it, instead of only resolving as it leaves.
                */
                end: '60% center',
                scrub: 1,
              },
            },
          )
        })
      }),
    [],
  )

  return (
    <section
      className="msurface msurface--research"
      ref={root}
      aria-labelledby="research-title"
      /*
        The muted magenta field. This is the page's first departure from navy,
        and it lands here rather than on a work act deliberately: Research is
        the studio's own material, so a shift in ground reads as a shift in
        subject. Its type comes from the magenta family (pale wine), never
        white — see the field definitions in globals.css.
      */
      data-field="magenta"
      data-frame="open"
    >
      {/* Plain naming, exactly as instructed. */}
      <h2 id="research-title" className="ract-title">
        Research
      </h2>

      <div className="rfield">
        {/* Enormous. Carries the section. No caption — it does not need one. */}
        <figure className="rstudy rstudy--fold">
          <img
            src="/research/fold-study.png"
            alt="A sheet of navy stock folded into four panels, lit so only the creases catch the light"
            loading="lazy"
          />
        </figure>

        {/*
          Small, sitting high, with the one short line in the section. The
          note describes what the material is doing — it makes no claim about
          findings or outcomes.
        */}
        <figure className="rstudy rstudy--plate">
          <img
            src="/research/plate-study.png"
            alt="Six translucent periwinkle sheets with rounded corners, overlapped at offsets so the colour deepens where they cross"
            loading="lazy"
          />
          <figcaption className="rstudy-note">
            Overlapping sheets, testing how far a shape can step before it
            stops reading as one object.
          </figcaption>
        </figure>

        {/* Small, sitting low, uncaptioned. */}
        <figure className="rstudy rstudy--cast">
          <img
            src="/research/cast-study.png"
            alt="A cast plaster block in pale periwinkle with one chamfered edge, on a navy ground"
            loading="lazy"
          />
        </figure>
      </div>
    </section>
  )
}
