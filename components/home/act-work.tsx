'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { gsap, createActContext, motionScale } from '@/lib/motion'

/**
 * ACT II — selected work.
 *
 * Three projects, three genuinely different compositions written out by hand.
 * There is no shared card component and no `.map()` over a project array on
 * purpose: the brief's first instruction here is not to build a grid or four
 * copies of one component, and an abstraction is what would force that.
 *
 * The scope lines are subsets of each project's real `services` array in
 * `lib/projects.ts` — trimmed for length, never invented.
 */

/*
  Shared image behaviour, which IS worth factoring out because it is a motion
  rule rather than a layout: the picture is oversized inside a fixed opening
  and travels a few percent within it, so it reads as sitting behind the
  surface rather than as a parallax layer bolted on top.
*/
function useImageDrift(root: React.RefObject<HTMLElement | null>) {
  useEffect(
    () =>
      createActContext(root.current, ({ scope }) => {
        const s = motionScale()
        scope.querySelectorAll<HTMLElement>('.well-media').forEach((media, i) => {
          gsap.fromTo(
            media,
            { yPercent: -4 * s },
            {
              yPercent: 4 * s,
              ease: 'none',
              scrollTrigger: {
                trigger: media.closest('.well'),
                start: 'top bottom',
                end: 'bottom top',
                /*
                  Slightly different smoothing per well so the three
                  projects do not all respond identically — the brief asks
                  for variation between projects rather than one effect
                  applied uniformly.
                */
                scrub: 0.6 + i * 0.25,
              },
            },
          )
        })
      }),
    [root],
  )
}

export function ActWork() {
  const root = useRef<HTMLDivElement>(null)
  useImageDrift(root)

  return (
    <div className="msurface msurface--work" ref={root} data-field="paper">
      <h2 className="sr-only">Selected work</h2>

      {/*
        ONE — Wurqly. The identity in motion, run nearly the full width of the
        surface with the name sitting quietly beneath it. The video is the
        argument; nothing else competes.
      */}
      <Link href="/work/wurqly" className="wcomp wcomp--wide">
        <div className="well well--cinema">
          <video
            className="well-media"
            src="/work/wurqly/brand-motion.mp4"
            poster="/work/wurqly/shaded-logo.png"
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
            tabIndex={-1}
          />
        </div>
        <div className="wcomp-caption">
          <span className="wcomp-name">Wurqly</span>
          <span className="wcomp-scope">Brand strategy, identity, website</span>
        </div>
      </Link>

      {/*
        TWO — Go2Bites. Title deliberately placed AWAY from the image: it holds
        the upper-left while the picture sits low and right, so the eye crosses
        the surface instead of reading a caption under a photo.
      */}
      <Link href="/work/go2bites" className="wcomp wcomp--offset">
        <div className="wcomp-aside">
          <span className="wcomp-name">Go2Bites</span>
          <span className="wcomp-scope">
            Website, marketing, photography, founder video
          </span>
        </div>
        <div className="well well--landscape">
          <img
            className="well-media"
            src="/work/go2bites/cover.png"
            alt="The Go2Bites ecommerce experience"
            loading="lazy"
          />
        </div>
      </Link>

      {/*
        THREE — Wagner Wealth. A narrower image carrying a lot of air around
        it, pulled toward the left of the surface. The negative space is the
        composition; resist filling it.
      */}
      <Link href="/work/wagner-wealth" className="wcomp wcomp--air">
        <div className="well well--portrait">
          <img
            className="well-media"
            src="/work/wagner-wealth/cover.png"
            alt="The Wagner Wealth Management website"
            loading="lazy"
          />
        </div>
        <div className="wcomp-caption wcomp-caption--right">
          <span className="wcomp-name">Wagner Wealth</span>
          <span className="wcomp-scope">Branding, website, founder video</span>
        </div>
      </Link>
    </div>
  )
}
