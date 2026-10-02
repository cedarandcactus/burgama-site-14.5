'use client'

import { useEffect, useRef, useState } from 'react'
import { BookOpen, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FounderFilm } from './founder-film'
import { SectionRise } from './section-rise'
import { FounderNoteCopy } from './founder-note-copy'
import styles from './founder-film.module.css'

export function ActFounder() {
  const [showNote, setShowNote] = useState(false)
  const [panelHeight, setPanelHeight] = useState<number>()
  const filmPanelRef = useRef<HTMLDivElement>(null)
  const notePanelRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const panel = showNote ? notePanelRef.current : filmPanelRef.current
    if (!panel) return
    const measure = () => setPanelHeight(panel.getBoundingClientRect().height)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(panel)
    return () => observer.disconnect()
  }, [showNote])

  return (
    <section id="founder-introduction" className={`${styles.section} font-sans`} data-nav-surface="ink" aria-labelledby="founder-film-heading">
      <div className={styles.inner}>
        <header className={styles.heading}>
          <h2 id="founder-film-heading" className="font-serif">A new chapter.<br />The same care.</h2>
        </header>
        <div id="founder-story" className={styles.story} style={{ height: panelHeight }}>
          <div ref={filmPanelRef} className={styles.storyPanel} data-active={!showNote} aria-hidden={showNote} inert={showNote}>
            <FounderFilm active={!showNote} />
          </div>
          <article ref={notePanelRef} className={`${styles.storyPanel} ${styles.letter}`} data-active={showNote} aria-hidden={!showNote} inert={!showNote} aria-labelledby="inline-founder-note-title">
            <div className={styles.letterContent}>
              <h3 id="inline-founder-note-title" className="font-serif">A note from the founder</h3>
              <FounderNoteCopy signatureClassName={styles.signature} />
            </div>
          </article>
        </div>
        <div className={styles.caption}>
          <Button variant="ghost" className={styles.note} aria-controls="founder-story" onClick={() => setShowNote((value) => !value)}>
            {showNote ? 'watch the introduction' : 'read the founder’s note'}
            {showNote ? <Play data-icon="inline-end" aria-hidden="true" /> : <BookOpen data-icon="inline-end" aria-hidden="true" />}
          </Button>
        </div>
      </div>
      <SectionRise surface="powder" direction="left" />
    </section>
  )
}
