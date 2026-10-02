'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { Maximize, Minimize, Pause, Play, RotateCcw, Volume2, VolumeX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { OPEN_FOUNDER_NOTE_EVENT } from './founder-announcement'
import styles from './founder-film.module.css'

const mobileQuery = '(max-width: 700px)'

function subscribeToViewport(onChange: () => void) {
  const query = window.matchMedia(mobileQuery)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

function getMobileSnapshot() {
  return window.matchMedia(mobileQuery).matches
}

function getServerSnapshot() {
  return false
}

function timestamp(seconds: number) {
  const value = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0
  return `${Math.floor(value / 60)}:${String(value % 60).padStart(2, '0')}`
}

export function FounderFilm({ active = true }: { active?: boolean }) {
  const mobile = useSyncExternalStore(subscribeToViewport, getMobileSnapshot, getServerSnapshot)
  const playerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const [started, setStarted] = useState(false)
  const [ended, setEnded] = useState(false)
  const [muted, setMuted] = useState(false)
  const [duration, setDuration] = useState(66.67)
  const [fullscreen, setFullscreen] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const syncFullscreen = () => setFullscreen(document.fullscreenElement === playerRef.current)
    const pauseForNote = () => videoRef.current?.pause()
    const pauseWhenHidden = () => {
      if (document.hidden) videoRef.current?.pause()
    }
    document.addEventListener('fullscreenchange', syncFullscreen)
    document.addEventListener('visibilitychange', pauseWhenHidden)
    window.addEventListener(OPEN_FOUNDER_NOTE_EVENT, pauseForNote)
    return () => {
      document.removeEventListener('fullscreenchange', syncFullscreen)
      document.removeEventListener('visibilitychange', pauseWhenHidden)
      window.removeEventListener(OPEN_FOUNDER_NOTE_EVENT, pauseForNote)
    }
  }, [])

  useEffect(() => {
    if (!active) videoRef.current?.pause()
  }, [active])

  async function togglePlayback() {
    const video = videoRef.current
    if (!video) return
    if (!video.paused) {
      video.pause()
      return
    }
    setMessage('')
    try {
      await video.play()
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return
      setMessage('Playback could not start. Please try again, or watch the film on Google Drive.')
    }
  }

  async function toggleFullscreen() {
    const player = playerRef.current
    const video = videoRef.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null
    try {
      if (document.fullscreenElement) await document.exitFullscreen()
      else if (player?.requestFullscreen) await player.requestFullscreen()
      else if (video?.webkitEnterFullscreen) video.webkitEnterFullscreen()
      else setMessage('Fullscreen is not available in this browser.')
    } catch {
      setMessage('Fullscreen is not available in this preview. You can still watch the film here.')
    }
  }

  return (
    <div ref={playerRef} className={styles.player}>
      <div className={styles.picture}>
        <video
          ref={videoRef}
          className={styles.video}
          src={mobile ? '/founder-introduction-mobile.mp4' : '/founder-introduction.mp4'}
          poster={mobile ? '/founder-introduction-mobile.jpg' : '/founder-introduction.jpg'}
          onEmptied={() => { setPlaying(false); setStarted(false); setEnded(false); setMessage('') }}
          preload="none"
          playsInline
          aria-label="Deniz Sipahi introduces Burgama"
          onPlay={() => { setPlaying(true); setStarted(true); setEnded(false) }}
          onPause={() => setPlaying(false)}
          onEnded={() => { setPlaying(false); setEnded(true) }}
          onLoadedMetadata={(event) => {
            const length = event.currentTarget.duration
            if (Number.isFinite(length) && length > 0) setDuration(length)
          }}
          onVolumeChange={(event) => setMuted(event.currentTarget.muted || event.currentTarget.volume === 0)}
          onError={() => setMessage('The film could not load. Please try watching it on Google Drive.')}
        />
        <div className={styles.controls} role="group" aria-label="Founder film playback controls">
          {!started || ended ? (
            <Button className={styles.watch} onClick={() => void togglePlayback()} aria-label={`${ended ? 'Replay' : 'Watch'} founder introduction, ${timestamp(duration)}`}>
              {ended ? <RotateCcw data-icon="inline-start" aria-hidden="true" /> : <Play data-icon="inline-start" fill="currentColor" aria-hidden="true" />}
              {ended ? 'watch again' : 'watch the introduction'}
              <span className={styles.watchDuration}>{timestamp(duration)}</span>
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="icon" className={styles.control} onClick={() => void togglePlayback()} aria-label={playing ? 'Pause introduction' : 'Play introduction'}>
                {playing ? <Pause fill="currentColor" aria-hidden="true" /> : <Play fill="currentColor" aria-hidden="true" />}
              </Button>
              <Button variant="ghost" size="icon" className={styles.control} aria-label={muted ? 'Unmute introduction' : 'Mute introduction'} onClick={() => {
                const video = videoRef.current
                if (video) video.muted = !video.muted
              }}>
                {muted ? <VolumeX aria-hidden="true" /> : <Volume2 aria-hidden="true" />}
              </Button>
              <Button variant="ghost" size="icon" className={styles.control} aria-label={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'} onClick={() => void toggleFullscreen()}>
                {fullscreen ? <Minimize aria-hidden="true" /> : <Maximize aria-hidden="true" />}
              </Button>
            </>
          )}
        </div>
      </div>
      {message && <p className={styles.message} role="status">{message} <a href={mobile ? 'https://drive.google.com/file/d/1fwwAG_PinMm4qy6EfG5xuZgMdDXcLABQ/view' : 'https://drive.google.com/file/d/1LCHqB0WwJSlvca0kipvVYwpMHUgeiFxK/view'} target="_blank" rel="noopener noreferrer">Open film in a new tab</a></p>}
    </div>
  )
}
