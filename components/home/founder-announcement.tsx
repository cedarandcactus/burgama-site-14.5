'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { useSmoothScroll } from '@/components/smooth-scroll'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import styles from './founder-announcement.module.css'

const SESSION_KEY = 'burgama-founder-announcement-v1'
const OPEN_PROJECT_EVENT = 'burgama:open-project'

export function FounderAnnouncement() {
  const [open, setOpen] = useState(false)
  const handoffTimeout = useRef<number | null>(null)
  const popupRef = useRef<HTMLDivElement>(null)
  const scrollControls = useSmoothScroll()

  useEffect(() => {
    let hasSeenAnnouncement = false

    try {
      hasSeenAnnouncement = window.sessionStorage.getItem(SESSION_KEY) === 'seen'
    } catch {
      hasSeenAnnouncement = false
    }

    if (hasSeenAnnouncement) return

    const frame = window.requestAnimationFrame(() => {
      try {
        window.sessionStorage.setItem(SESSION_KEY, 'seen')
      } catch {
        // The note can still be dismissed if storage is unavailable.
      }
      setOpen(true)
    })

    return () => window.cancelAnimationFrame(frame)
  }, [])

  useEffect(() => {
    scrollControls?.setScrollLock('founder-announcement', open)
    return () => scrollControls?.setScrollLock('founder-announcement', false)
  }, [open, scrollControls])

  useEffect(() => () => {
    if (handoffTimeout.current) window.clearTimeout(handoffTimeout.current)
  }, [])

  function openProjectForm() {
    setOpen(false)
    handoffTimeout.current = window.setTimeout(() => {
      window.dispatchEvent(new Event(OPEN_PROJECT_EVENT))
    }, 320)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        ref={popupRef}
        initialFocus={popupRef}
        tabIndex={-1}
        className={styles.popup}
        overlayClassName={styles.overlay}
        showCloseButton={false}
        data-temporary-founder-note
      >
        <DialogHeader className={styles.header}>
          <figure className={styles.portrait}>
            <Image
              src="/team/deniz.jpg"
              alt="Deniz Sipahi, founder of Burgama"
              width={1264}
              height={1583}
              sizes="72px"
              priority
            />
          </figure>
          <div className={styles.intro}>
            <DialogTitle className={styles.title}>A note from the founder</DialogTitle>
            <DialogDescription className="sr-only">
              An announcement from Deniz Sipahi about Cedar &amp; Cactus becoming Burgama.
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className={styles.copy}>
          <p>
            I started this company as Cedar &amp; Cactus. Today, we&apos;re known as Burgama. We outgrew our old brand, growing from a local agency into a studio working with brands and founders around the world.
          </p>
          <p>
            The name comes from Pergamon, an ancient city where things were built to last. That remains our standard: we build the brand, then carry it into the world. Same team, same care, bigger canvas.
          </p>
          <p className={styles.signature}>Deniz Sipahi, founder</p>
        </div>

        <div className={styles.actions}>
          <Button variant="ghost" className={styles.action} onClick={openProjectForm}>
            start a project
          </Button>
          <Button variant="ghost" className={styles.action} onClick={() => setOpen(false)}>
            close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
