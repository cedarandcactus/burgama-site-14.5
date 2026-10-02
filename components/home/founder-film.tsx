'use client'

import { useEffect, useRef, useState } from 'react'
import { Maximize, Minimize, Pause, Play, RotateCcw, Volume2, VolumeX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { OPEN_FOUNDER_NOTE_EVENT } from './founder-announcement'
import styles from './founder-film.module.css'

function timestamp(seconds: number) {
  const value = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0
  return `${Math.floor(value / 60)}:${String(value % 60).padStart(2, '0')}`
}

export function FounderFilm() {
  const playerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const [started, setStarted] = useState(false)
  const [ended, setEnded] = useState(false)
  const [muted, setMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(66.67)
  const [ready, setReady] = useState(false)
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
          src="/founder-introduction.mp4"
          poster="/founder-introduction.jpg"
          preload="none"
          playsInline
          aria-label="Deniz Sipahi introduces Burgama"
          onPlay={() => { setPlaying(true); setStarted(true); setEnded(false) }}
          onPause={() => setPlaying(false)}
          onEnded={() => { setPlaying(false); setEnded(true) }}
          onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
          onLoadedMetadata={(event) => {
            const length = event.currentTarget.duration
            if (Number.isFinite(length) && length > 0) { setDuration(length); setReady(true) }
          }}
          onVolumeChange={(event) => setMuted(event.currentTarget.muted || event.currentTarget.volume === 0)}
          onError={() => setMessage('The film could not load. Please try watching it on Google Drive.')}
        />
        {(!started || ended) && (
          <div className={styles.cover}>
            <Button className={styles.watch} onClick={() => void togglePlayback()} aria-label={ended ? 'Replay founder introduction' : 'Watch founder introduction'}>
              {ended ? <RotateCcw data-icon="inline-start" aria-hidden="true" /> : <Play data-icon="inline-start" fill="currentColor" aria-hidden="true" />}
              {ended ? 'watch again' : 'watch the introduction'}
              <span className={styles.watchDuration}>{timestamp(duration)}</span>
            </Button>
          </div>
        )}
      </div>
      <div className={styles.controls} role="group" aria-label="Founder film playback controls">
        <Button variant="ghost" size="icon" className={styles.control} onClick={() => void togglePlayback()} aria-label={playing ? 'Pause introduction' : 'Play introduction'}>
          {playing ? <Pause fill="currentColor" aria-hidden="true" /> : <Play fill="currentColor" aria-hidden="true" />}
        </Button>
        <span className={styles.time} aria-hidden="true">{timestamp(currentTime)} <span>/ {timestamp(duration)}</span></span>
        <input
          className={styles.seek}
          type="range"
          min={0}
          max={duration}
          step={0.1}
          value={currentTime}
          disabled={!ready}
          aria-label="Video position"
          aria-valuetext={`${timestamp(currentTime)} of ${timestamp(duration)}`}
          onChange={(event) => {
            const time = Number(event.target.value)
            if (videoRef.current) videoRef.current.currentTime = time
            setCurrentTime(time)
          }}
        />
        <Button variant="ghost" size="icon" className={styles.control} aria-label={muted ? 'Unmute introduction' : 'Mute introduction'} onClick={() => {
          const video = videoRef.current
          if (video) video.muted = !video.muted
        }}>
          {muted ? <VolumeX aria-hidden="true" /> : <Volume2 aria-hidden="true" />}
        </Button>
        <Button variant="ghost" size="icon" className={styles.control} aria-label={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'} onClick={() => void toggleFullscreen()}>
          {fullscreen ? <Minimize aria-hidden="true" /> : <Maximize aria-hidden="true" />}
        </Button>
      </div>
      {message && <p className={styles.message} role="status">{message} <a href="https://drive.google.com/file/d/1LCHqB0WwJSlvca0kipvVYwpMHUgeiFxK/view" target="_blank" rel="noopener noreferrer">Open film in a new tab</a></p>}
    </div>
  )
}
