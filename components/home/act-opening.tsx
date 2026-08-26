'use client'

import { useEffect, useRef } from 'react'
import { gsap, createActContext, motionScale } from '@/lib/motion'

/**
 * ACT I — the opening.
 *
 * OPEN frame: it runs to the page edge with no container or radius, which is
 * the first beat of the page's open/contained alternation. The visual is
 * cropped by the viewport itself rather than by a rounded card edge.
 *
 * One enormous open surface holding only what earns immediate visibility:
 * identity, one statement, one visual. No metadata, no location line, no
 * project count, no scroll cue — all of it was considered and none of it says
 * anything the page does not already show.
 *
 * The statement is set left and low rather than centred, and the visual is
 * cropped by the surface's right edge, so the two hold the composition
 * between them instead of stacking into headline-paragraph-button-image.
 */
export function ActOpening() {
  const root = useRef<HTMLDivElement>(null)

  /*
    Reduced motion: hold the decorative opening video on its poster frame.

    This is deliberately NOT inside `createActContext`, which no-ops under
    reduced motion — the case that needs handling is the exact case that
    callback never runs in. `autoPlay` is left in the markup so the default
    experience needs no JS, and is undone here instead.

    Kept as a live `change` listener rather than a one-shot read so toggling
    the OS setting takes effect without a reload.
  */
  useEffect(() => {
    const video = root.current?.querySelector<HTMLVideoElement>('.open-video')
    if (!video) return

    const query = window.matchMedia('(prefers-reduced-motion: reduce)')

    const apply = () => {
      if (query.matches) {
        video.autoplay = false
        video.loop = false
        video.pause()
        // Rewind so the still shown matches the poster rather than
        // whatever frame playback happened to reach first.
        video.currentTime = 0
      } else if (video.paused) {
        video.autoplay = true
        video.loop = true
        // Autoplay can legitimately be refused; the poster remains.
        void video.play().catch(() => {})
      }
    }

    apply()
    query.addEventListener('change', apply)
    return () => query.removeEventListener('change', apply)
  }, [])

  useEffect(
    () =>
      createActContext(root.current, ({ scope }) => {
        const s = motionScale()

        /*
          Weight: the interior moves well before the surface itself does.
          Three different rates across one scrub — visual furthest, type
          about half that, identity barely at all — so the hero reads as a
          heavy object whose contents shift inside it first.

          `scrub: 0.7`, not `true`. A boolean scrub is welded 1:1 to the raw
          scroll position, so it reproduces every wheel tick and trackpad
          jitter exactly — which fought the whole point of a hero built to
          feel heavy, and made the first surface the twitchiest one on the
          page while every act below it already used a smoothed scrub. The
          number gives the tween a short catch-up, so momentum carries the
          motion instead of the input driving it directly.
        */
        gsap
          .timeline({
            scrollTrigger: {
              trigger: scope,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.7,
            },
          })
          .to(scope.querySelector('.open-visual'), { y: -78 * s, ease: 'none' }, 0)
          .to(scope.querySelector('.open-statement'), { y: -34 * s, ease: 'none' }, 0)

        /*
          Only in the last stretch does the whole surface compress, handing
          off to the work surface rising over it. Scaled from the bottom edge
          so it settles back rather than shrinking toward its middle. No
          fade — the brief is explicit that the hero should not dissolve.
        */
        gsap.to(scope, {
          scale: 0.965,
          transformOrigin: '50% 100%',
          ease: 'none',
          scrollTrigger: {
            trigger: scope,
            start: '55% top',
            end: 'bottom top',
            /*
              Slightly looser than the parallax above. This is the heaviest
              move in the act — the entire surface settling back — so it
              should trail the input a touch more than its own contents do.
            */
            scrub: 0.9,
          },
        })
      }),
    [],
  )

  return (
    <div
      className="msurface msurface--open"
      ref={root}
      data-field="paper"
      data-frame="open"
    >
      {/*
        The visual sits low and runs off the right edge of the surface. It is
        the existing vault motion study — a real asset already in the project,
        not a stock stand-in.
      */}
      <div className="open-visual">
        <video
          className="open-video"
          src="/hero/vault.mp4"
          poster="/hero/vault.jpg"
          autoPlay
          muted
          loop
          playsInline
          /*
            Decorative: the statement carries the meaning, and the video has
            no narration or text. Marked so screen readers skip it rather
            than announcing an unlabelled media element.
          */
          aria-hidden="true"
          tabIndex={-1}
        />
      </div>

      <h1 className="open-statement">
        {/*
          Deliberate line breaks, not a wrapped paragraph: four short lines
          build a compact heavy block instead of one wide ribbon of text.
        */}
        <span className="open-line">Identities and</span>
        <span className="open-line">experiences built</span>
        <span className="open-line">to move, change</span>
        <span className="open-line">and stay recognizable.</span>
      </h1>

      {/*
        No wordmark here. The name is reserved for three places — the nav
        control, the footer, and the email/contact block — so the hero carries
        the statement alone and the shell's top-left control is the only
        identity on screen at this point in the page.
      */}
    </div>
  )
}
