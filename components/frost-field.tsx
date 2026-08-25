'use client'

import { useEffect } from 'react'

/**
 * ADAPTIVE FROST SOURCE
 *
 * The four-corner shell is supposed to feel like it is *reacting to the page*
 * rather than sitting on top of it as fixed grey glass. That means the
 * material's tint has to know which field is currently behind it.
 *
 * WHAT CHANGED FROM THE PREVIOUS VERSION
 *
 * It used to hold a hardcoded map of three named fields to three literal
 * tints. That could not survive this revision: the homepage now moves through
 * navy, magenta and periwinkle grounds, and each project page brings its own
 * palette. A hardcoded map would need an entry per project, and any project
 * without one would silently fall back to navy frost over its own colours.
 *
 * So it no longer knows about palettes at all. It READS the active section's
 * resolved `--field-bg-raised` / `--field-ink` and republishes them as the
 * frost face. Any field — including one a project page invents — is handled
 * automatically, because the field itself is the source of truth.
 *
 * The desaturation is the part that keeps the material feeling neutral: the
 * ground is muted toward its own ink before being made translucent, so the
 * tint belongs to the page without ever becoming a saturated panel.
 *
 * Implementation notes:
 *
 * - ONE IntersectionObserver for the whole document, not one per section and
 *   not a scroll handler. A scroll listener would run every frame to compute
 *   something that changes a handful of times per page.
 * - The observer's `rootMargin` collapses the viewport to a band, so
 *   "intersecting" means "this section is behind the chrome right now". The
 *   band sits at the TOP for the desktop shell and at the BOTTOM for the
 *   mobile console, because that is where each one physically is.
 * - Results are written to `<html>`, so the desktop shell and the mobile
 *   console read ONE source and can never disagree about the current tint.
 *
 * Sections opt in with `data-field`. Anything that doesn't opt in leaves the
 * resting tint in place, so this degrades to "looks fine", not "looks broken".
 */

/*
 * How far the ground is pulled toward its own ink before going translucent.
 * Low single-digit percentages read as "same colour, slightly dulled", which
 * is the muted-but-belonging quality the brief asks for. Going higher starts
 * to look like a tinted overlay rather than frosted material.
 */
const MUTE = 12
const OPACITY = 78

/*
 * THE ONE-STEP LIGHTNESS RULE
 *
 * The tint takes its HUE from the field but must never sit at the field's own
 * lightness, or the controls dissolve into the background. So the muted ground
 * is pushed one clear step away: over a dark field it lightens toward the
 * field's own (light) ink into a soft mid tone; over a light field it deepens
 * toward that field's own (dark) ink into a hazier version of the same hue.
 *
 * Both directions mix toward the field's ink rather than toward white or
 * black, which is what keeps the step inside the field's own family instead of
 * introducing a neutral from outside it. Over pure black the ink is near-white
 * and the result is the required neutral mid-grey for free.
 */
const STEP = 26

/*
 * Label text stays near-white and slightly translucent over every field, in
 * both the light and dark cases, so the type reads as one consistent material
 * across the whole site rather than re-colouring per section.
 */
const LABEL = 'color-mix(in srgb, white 90%, transparent)'

export function FrostFieldProvider() {
  /*
   * No breakpoint state any more. This used to track a `(max-width: 759px)`
   * media query so the observation band could follow the mobile console to
   * the bottom of the screen. The console is gone and the shell's corners are
   * present at every width, so there is one band and the observer is built
   * once.
   */
  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>('[data-field]'),
    )
    if (sections.length === 0) return

    const root = document.documentElement

    const apply = (section: HTMLElement) => {
      /*
        Read the field's RESOLVED tokens rather than looking up a palette by
        name. This is what makes the shell adapt to project pages for free.
      */
      const style = getComputedStyle(section)
      const raised = style.getPropertyValue('--field-bg-raised').trim()
      const ink = style.getPropertyValue('--field-ink').trim()

      /* A field that declares nothing usable is left alone. */
      if (!raised || !ink) return

      /*
        Two mixes, then translucency:

          1. MUTE  — pull the ground slightly toward its own ink, so the tint
                     reads as "same colour, dulled" rather than saturated.
          2. STEP  — push it one clear step of lightness away from the field,
                     toward the ink. Because the ink is always the readable
                     opposite of its own ground, mixing toward it lightens a
                     dark field and deepens a light one automatically — no
                     luminance branch needed here.

        Never fully opaque: OPACITY caps it below 100 so it stays material.
      */
      const muted = `color-mix(in srgb, ${raised} ${100 - MUTE}%, ${ink})`
      const stepped = `color-mix(in srgb, ${muted} ${100 - STEP}%, ${ink})`

      root.style.setProperty(
        '--frost-face',
        `color-mix(in srgb, ${stepped} ${OPACITY}%, transparent)`,
      )
      root.style.setProperty('--frost-fg', ink)
      /*
        Control labels read against the stepped tint, not against the raw
        field, so they use their own near-white rather than the field's ink —
        which on a light field would be dark and, over a tint that has just
        been deepened toward it, would lose contrast.
      */
      root.style.setProperty('--frost-label', LABEL)
      /*
        The GROUND that pairs with `--frost-fg`. Published because anything
        inverting against the frost (the console's lead module) needs the
        counterpart of the current ink, and there was previously no way to get
        it: reading `--field-bg-raised` from CSS resolves against whichever
        section element the chrome overlaps, which on a light field is itself
        light — giving a light fill light text at 1.02:1. Sourced here from
        the same section as the ink, so the pair can never disagree.
      */
      root.style.setProperty('--frost-bg', raised)
    }

    /*
     * Track everything currently in the band and take the LAST one in
     * document order. When two sections overlap the band during a scroll,
     * the later one is the one that has just arrived under the shell.
     */
    const active = new Set<HTMLElement>()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement
          if (entry.isIntersecting) active.add(el)
          else active.delete(el)
        }

        const current = sections.filter((s) => active.has(s)).pop()
        if (current) apply(current)
      },
      {
        /*
         * Collapse the viewport to a band over the CHROME BEING TINTED.
         *
         * This is why the band is not simply "the top": the desktop shell
         * occupies all four corners, but below 760px the shell is replaced by
         * the mobile console, which is fixed to the BOTTOM of the screen.
         *
         * A top-only band therefore tinted the console from whichever section
         * happened to be at the top of the viewport — a completely different
         * part of the page from the one actually behind it. Over the
         * periwinkle capabilities act the console kept the magenta tint of the
         * act above, which is how it ended up pale-on-pale.
         *
         * So the band tracks the console on mobile and the top on desktop.
         * `matchMedia` uses the same 760px number as the CSS switch; a
         * mismatch here would reintroduce the same class of bug.
         *
         * A previous value of `-90%` was also too tight even on desktop: it
         * left a ~74px sliver, so when a gap between sections crossed it NO
         * section intersected, `active` emptied and the last tint stuck.
         * Both bands below are ~25% for that reason.
         */
        /*
         * The shell now occupies all four corners at EVERY width, so there is
         * no longer a mobile case where the chrome lives only at the bottom.
         * One band, and it is deliberately wide rather than a sliver: a tight
         * band meant that when a gap between sections crossed it, no section
         * intersected at all, `active` emptied, and the previous tint stuck.
         *
         * Top-weighted because the top-left identity control is the one that
         * is always present, on every route, in every state.
         */
        rootMargin: '0px 0px -70% 0px',
        /*
         * Several thresholds so the callback also fires while a tall section
         * is crossing, not only at the moment it enters. With `0` alone a
         * 700px section reports once and then stays silent.
         */
        threshold: [0, 0.01, 0.5],
      },
    )

    for (const section of sections) observer.observe(section)

    /*
      Seed before the first scroll, otherwise the chrome renders with the
      resting default on any page whose relevant field is not navy.

      Seeded from the END of the document when the console is live: at first
      paint the bottom of the viewport is usually still the FIRST section on
      short pages, but on a long page the console can already be sitting over
      later content after a restored scroll position. Reading the section that
      actually contains the band point is correct in both cases; `sections[0]`
      is the fallback when the point hits no field.
    */
    const seedEl = document
      .elementFromPoint(window.innerWidth / 2, 60)
      ?.closest<HTMLElement>('[data-field]')
    apply(seedEl ?? sections[0])

    return () => {
      observer.disconnect()
      root.style.removeProperty('--frost-face')
      root.style.removeProperty('--frost-fg')
      root.style.removeProperty('--frost-bg')
      root.style.removeProperty('--frost-label')
    }
    /* Built once: there is no longer a breakpoint that changes the band. */
  }, [])

  return null
}
