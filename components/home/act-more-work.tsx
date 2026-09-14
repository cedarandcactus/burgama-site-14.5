'use client'

import Link from '@/components/transition-link'
import { useEffect, useRef } from 'react'
import { createActContext, gsap, motionScale } from '@/lib/motion'

export function ActMoreWork() {
  const root = useRef<HTMLDivElement>(null)

  useEffect(
    () =>
      createActContext(root.current, ({ scope }) => {
        const scale = motionScale()
        const media = scope.querySelector('.well-media')

        if (media) {
          gsap.fromTo(
            media,
            { yPercent: -3 * scale },
            {
              yPercent: 3 * scale,
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

        gsap.fromTo(
          scope.querySelectorAll('.pair-item'),
          { x: (index: number) => (index === 0 ? -18 * scale : 18 * scale) },
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
    <section className="msurface msurface--more" ref={root} data-field="paper" data-frame="contained">
      <div className="more-work-intro">
        <h2 className="font-serif">More work. Same standard.</h2>
        <p>Websites, social systems, and content made to stay useful after launch.</p>
      </div>

      <Link href="/work/hiking-pony" className="wcomp wcomp--edge">
        <div className="well well--brim">
          <img
            className="well-media"
            src="/work/hiking-pony/web-hiking-pony.jpg"
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
        <Link href="/work/matchday" className="pair-item pair-item--major">
          <div className="well">
            <img
              className="well-media"
              src="/work/matchday/a112.jpg"
              alt="MatchDay social media presentation"
              loading="lazy"
            />
          </div>
          <div className="wcomp-caption">
            <span className="wcomp-name">MatchDay</span>
            <span className="wcomp-scope">Social, SEO, content, photography</span>
          </div>
        </Link>

        <Link href="/work/avro" className="pair-item pair-item--minor">
          <div className="well">
            <img
              className="well-media well-media--logo"
              src="/client-logos/avro.webp"
              alt="AVRO wordmark"
              loading="lazy"
            />
          </div>
          <div className="wcomp-caption">
            <span className="wcomp-name">AVRO</span>
            <span className="wcomp-scope">Commercial, UGC, retail content</span>
          </div>
        </Link>
      </div>
    </section>
  )
}
