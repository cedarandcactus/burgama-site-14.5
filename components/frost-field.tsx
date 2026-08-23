'use client'

import { useEffect } from 'react'

/**
 * ADAPTIVE FROST SOURCE
 *
 * The nav and the console are supposed to feel like they are *reacting to
 * the page* rather than sitting on top of it as fixed grey bars. That means
 * the material's tint has to know which section is currently behind it.
 *
 * Implementation notes:
 *
 * - ONE IntersectionObserver for the whole document, not one per section and
 *   not a scroll handler. A scroll listener would run on every frame to
 *   compute something that changes a handful of times per page.
 * - The observer's `rootMargin` collapses the viewport to a thin band at the
 *   height where the chrome floats, so "intersecting" literally means "this
 *   section is behind the nav right now".
 * - The result is written to `<html>` as `--frost-face` / `--frost-fg`, so
 *   the desktop nav and the mobile console read ONE source and can never
 *   disagree about the current tint.
 *
 * Sections opt in with `data-field="paper | panel | ink"`. Anything that
 * doesn't opt in simply leaves the resting tint in place, so this degrades to
 * "looks fine" rather than "looks broken".
 */

/*
 * Tints are all steps of the two palette families, at partial alpha. None of
 * them is white or grey — that is the difference between this and generic
 * glassmorphism.
 */
const FIELDS: Record<string, { face: string; fg: string }> = {
  paper: {
    face: 'color-mix(in srgb, var(--paper-raised) 72%, transparent)',
    fg: 'var(--ink)',
  },
  panel: {
    face: 'color-mix(in srgb, var(--paper-sunk) 74%, transparent)',
    fg: 'var(--ink)',
  },
  /*
   * Over an ink/periwinkle field the material has to go the other way — a
   * dark tint over a bright field, with the type flipping to paper. Without
   * this the pale nav label would sit on a pale panel and vanish.
   */
  ink: {
    face: 'color-mix(in srgb, var(--paper) 62%, transparent)',
    fg: 'var(--ink)',
  },
}

export function FrostFieldProvider() {
  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>('[data-field]'),
    )
    if (sections.length === 0) return

    const root = document.documentElement

    const apply = (name: string) => {
      const field = FIELDS[name]
      if (!field) return
      root.style.setProperty('--frost-face', field.face)
      root.style.setProperty('--frost-fg', field.fg)
    }

    /*
     * Track everything currently in the band and take the LAST one in
     * document order. When two sections overlap the band during a scroll,
     * the later one is the one that has just arrived under the chrome.
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
        if (current?.dataset.field) apply(current.dataset.field)
      },
      {
        /*
         * Collapse the viewport to a ~90px band near the top, where the
         * floating nav lives. `-90%` bottom margin means "ignore everything
         * below the top tenth of the screen".
         */
        rootMargin: '-16px 0px -90% 0px',
        threshold: 0,
      },
    )

    for (const section of sections) observer.observe(section)

    return () => {
      observer.disconnect()
      root.style.removeProperty('--frost-face')
      root.style.removeProperty('--frost-fg')
    }
  }, [])

  return null
}
