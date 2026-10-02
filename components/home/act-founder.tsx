'use client'

import { ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FounderFilm } from './founder-film'
import { OPEN_FOUNDER_NOTE_EVENT } from './founder-announcement'
import styles from './founder-film.module.css'

export function ActFounder() {
  return (
    <section id="founder-introduction" className={`${styles.section} font-sans`} data-nav-surface="ink" aria-labelledby="founder-film-heading">
      <div className={styles.inner}>
        <header className={styles.heading}>
          <h2 id="founder-film-heading" className="font-serif">Meet Burgama.</h2>
        </header>
        <FounderFilm />
        <div className={styles.caption}>
          <Button variant="ghost" className={styles.note} onClick={() => window.dispatchEvent(new Event(OPEN_FOUNDER_NOTE_EVENT))}>
            read the founder&apos;s note <ArrowUpRight data-icon="inline-end" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </section>
  )
}
