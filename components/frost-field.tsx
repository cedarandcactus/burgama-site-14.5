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
 *   "intersecting" means "this section is behind the shell right now".
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

export function FrostFieldProvider() {
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
         * Collapse the viewport to a band at the top, where the floating
         * shell lives.
         *
         * `-90%` was too tight: it left a ~74px sliver, so whenever a gap
         * between two sections passed the top of the screen NO section was
         * intersecting, `active` emptied, and the last tint stuck. Measured
         * with the panel section at top:155 while the band ended at 90 —
         * nothing matched and the material never retinted.
         *
         * `-75%` gives roughly the top quarter, which is always covered by
         * some section on these pages, so the band is never empty mid-page.
         */
        rootMargin: '0px 0px -75% 0px',
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
      Seed from the topmost section. Without this the shell renders with the
      resting default until the first scroll, which is visible on any page
      whose first field is not navy.
    */
    apply(sections[0])

    return () => {
      observer.disconnect()
      root.style.removeProperty('--frost-face')
      root.style.removeProperty('--frost-fg')
    }
  }, [])

  return null
}
