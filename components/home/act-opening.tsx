'use client'

import Image from 'next/image'
import { useState } from 'react'
import { ModularButton } from '@/components/modular-button'
import styles from './act-opening.module.css'

export function ActOpening() {
  const [paused, setPaused] = useState(false)

  return (
    <section className={`home-plate opening-plate ${styles.hero}`} data-home-plate aria-labelledby="opening-title" data-paused={paused}>
      <div className={styles.artwork} aria-hidden="true">
        <Image src="/hero/brand-artwork.webp" alt="" fill priority sizes="100vw" />
      </div>
      <div className={`opening-layout ${styles.layout}`}>
        <div className="opening-copy">
          <h1 id="opening-title" className="font-serif">marketing solutions for founders and startups in austin and beyond.</h1>
          <div className="opening-bottom">
            <p>We&apos;re a creative and marketing studio working across brand, digital, and campaign work. Thoughtful decisions, a clear direction, and a distinct point of view.</p>
            <ModularButton href="/studio">learn more</ModularButton>
          </div>
        </div>
        <button type="button" className={styles.motionControl} onClick={() => setPaused(!paused)} aria-pressed={paused} aria-label="Pause background animation">
          {paused ? 'play pattern' : 'pause pattern'}
        </button>
      </div>
    </section>
  )
}
