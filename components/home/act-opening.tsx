'use client'

import { useEffect, useRef } from 'react'
import { gsap, createActContext, motionScale } from '@/lib/motion'

/**
 * ACT I — the opening.
 *
 * One enormous contained surface holding only what earns immediate visibility:
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
        */
        gsap
          .timeline({
            scrollTrigger: {
              trigger: scope,
              start: 'top top',
              end: 'bottom top',
              scrub: true,
            },
          })
          .to(scope.querySelector('.open-visual'), { y: -78 * s, ease: 'none' }, 0)
          .to(scope.querySelector('.open-statement'), { y: -34 * s, ease: 'none' }, 0)
          .to(scope.querySelector('.open-identity'), { y: -12 * s, ease: 'none' }, 0)

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
            scrub: true,
          },
        })
      }),
    [],
  )

  return (
    <div className="msurface msurface--open" ref={root} data-field="panel">
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
        The identity anchors the bottom-left corner of the surface. The nav
        module carries the name too, but at nav scale it is a control; here it
        is the composition's signature.
      */}
      <p className="open-identity wordmark" aria-hidden="true">
        Burgama
      </p>
    </div>
  )
}
