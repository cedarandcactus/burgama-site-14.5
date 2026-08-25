'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { gsap, createActContext, motionScale } from '@/lib/motion'

/**
 * ACT IV — back to finished work.
 *
 * Returning to a real project after Research keeps the studies attached to
 * Burgama's actual output rather than letting the page drift into feeling like
 * a separate publication.
 *
 * Hiking Pony gets the one composition not used earlier: the image runs almost
 * to the boundaries of its surface, held off the edge by a small margin so the
 * surface still reads as a physical plate rather than a full-bleed band.
 *
 * MatchDay and AVRO follow as an asymmetric pair. Neither has photography in
 * the project yet, so they are presented as empty tonal wells at their real
 * proportions instead of being given generated imagery that would misrepresent
 * the work. The wells are honest placeholders, and the layout is already
 * correct for the day the real assets arrive.
 */
export function ActMoreWork() {
  const root = useRef<HTMLDivElement>(null)

  useEffect(
    () =>
      createActContext(root.current, ({ scope }) => {
        const s = motionScale()

        const media = scope.querySelector('.well-media')
        if (media) {
          gsap.fromTo(
            media,
            { yPercent: -3 * s },
            {
              yPercent: 3 * s,
              ease: 'none',
              scrollTrigger: {
                trigger: scope.querySelector('.well'),
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.8,
              },
            },
          )
        }

        /*
          The pair arrives with the two halves at slightly different rates —
          a small horizontal drift apart rather than a matched fade, so they
          read as two objects placed rather than one row appearing.
        */
        gsap.fromTo(
          scope.querySelectorAll('.pair-item'),
          { x: (i: number) => (i === 0 ? -18 * s : 18 * s) },
          {
            x: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: scope.querySelector('.wpair'),
              start: 'top bottom',
              end: 'center center',
              scrub: 1,
            },
          },
        )
      }),
    [],
  )

  return (
    <div className="msurface msurface--more" ref={root} data-field="panel">
      <h2 className="sr-only">More work</h2>

      <Link href="/work/hiking-pony" className="wcomp wcomp--edge">
        <div className="well well--brim">
          <img
            className="well-media"
            src="/work/hiking-pony/cover.png"
            alt="The Hiking Pony website and product design"
            loading="lazy"
          />
        </div>
        <div className="wcomp-caption">
          <span className="wcomp-name">Hiking Pony</span>
          <span className="wcomp-scope">Website, product design, social</span>
        </div>
      </Link>

      <div className="wpair">
        {/*
          Asymmetric on purpose: MatchDay takes the larger well and sits
          lower, AVRO the narrower one set higher. Both are ongoing content
          engagements, so pairing them is a real relationship rather than a
          layout convenience.
        */}
        <Link href="/work/matchday" className="pair-item pair-item--major">
          <div className="well well--empty" aria-hidden="true" />
          <div className="wcomp-caption">
            <span className="wcomp-name">MatchDay</span>
            <span className="wcomp-scope">
              Social, SEO, content, photography
            </span>
          </div>
        </Link>

        <Link href="/work/avro" className="pair-item pair-item--minor">
          <div className="well well--empty" aria-hidden="true" />
          <div className="wcomp-caption">
            <span className="wcomp-name">AVRO</span>
            <span className="wcomp-scope">Commercial, UGC, retail content</span>
          </div>
        </Link>
      </div>
    </div>
  )
}
