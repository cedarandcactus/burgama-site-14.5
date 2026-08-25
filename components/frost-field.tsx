'use client'

import { useEffect, useState } from 'react'

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
 * The shell/console switch. Must stay equal to the CSS breakpoint in
 * globals.css: this decides WHERE the observer looks for the active field,
 * and the CSS decides WHICH chrome is on screen. If they disagree, the
 * visible chrome is tinted from the wrong end of the viewport.
 */
const CONSOLE_QUERY = '(max-width: 759px)'

export function FrostFieldProvider() {
  /*
   * Tracks which chrome is live. It is state rather than a one-off read so
   * that resizing across the breakpoint — including a phone rotating —
   * rebuilds the observer against the correct band instead of leaving a
   * bottom-tracking observer running under a top-anchored shell.
   */
  const [isConsole, setIsConsole] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia(CONSOLE_QUERY)
    setIsConsole(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setIsConsole(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

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

      root.style.setProperty(
        '--frost-face',
        `color-mix(in srgb, color-mix(in srgb, ${raised} ${100 - MUTE}%, ${ink}) ${OPACITY}%, transparent)`,
      )
      root.style.setProperty('--frost-fg', ink)
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
        rootMargin: isConsole
          ? /* bottom quarter, where the console sits */
            '-75% 0px 0px 0px'
          : /* top quarter, where the shell corners sit */
            '0px 0px -75% 0px',
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
    const seedY = isConsole ? window.innerHeight - 40 : 60
    const seedEl = document
      .elementFromPoint(window.innerWidth / 2, seedY)
      ?.closest<HTMLElement>('[data-field]')
    apply(seedEl ?? sections[0])

    return () => {
      observer.disconnect()
      root.style.removeProperty('--frost-face')
      root.style.removeProperty('--frost-fg')
      root.style.removeProperty('--frost-bg')
    }
    /*
      Rebuilt when the chrome switches, because `rootMargin` is fixed at
      observer construction and cannot be changed on a live observer.
    */
  }, [isConsole])

  return null
}
