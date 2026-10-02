'use client'

import { ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FounderFilm } from './founder-film'
import { OPEN_FOUNDER_NOTE_EVENT } from './founder-announcement'
import styles from './founder-film.module.css'

export function ActFounder() {
  return (
    <section id="founder-introduction" className={`${styles.section} font-sans`} data-nav-surface="frost" aria-labelledby="founder-film-heading">
      <div className={styles.inner}>
        <header className={styles.header}>
          <div className={styles.heading}>
            <p className={styles.eyebrow}>A new chapter, in our own words.</p>
            <h2 id="founder-film-heading" className="font-serif">Meet Burgama.</h2>
          </div>
          <p className={styles.description}>A new name. The same care.<br />Our founder Deniz introduces the studio we&apos;ve become, and where we&apos;re going next.</p>
        </header>
        <FounderFilm />
        <div className={styles.caption}>
          <p><span>Deniz Sipahi</span><span>Founder, Burgama</span></p>
          <Button variant="ghost" className={styles.note} onClick={() => window.dispatchEvent(new Event(OPEN_FOUNDER_NOTE_EVENT))}>
            read the founder&apos;s note <ArrowUpRight data-icon="inline-end" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </section>
  )
}
