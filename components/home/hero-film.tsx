'use client'

import { useEffect, useRef, useState } from 'react'
import { Pause, Play } from 'lucide-react'
import styles from './home-page.module.css'

const videoSource = '/videos/compressed-22.mp4'
const posterSource = '/videos/compressed-22-poster.jpg'

export function HeroFilm() {
  const mediaRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const userPausedRef = useRef(false)
  const [showVideo, setShowVideo] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [canControl, setCanControl] = useState(false)

  useEffect(() => {
    const media = mediaRef.current
    const video = videoRef.current
    if (!media || !video) return

    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    let visible = false
    let disposed = false
    let sourceAttached = false
    let failed = false

    const updatePlayback = () => {
      if (disposed || failed) return
      const shouldPlay = visible && !document.hidden && !preference.matches && !userPausedRef.current
      if (shouldPlay && !sourceAttached) {
        video.muted = true
        video.src = videoSource
        video.load()
        sourceAttached = true
      }
      if (shouldPlay && video.paused) {
        video.play().catch(() => {
          if (!disposed) setIsPlaying(false)
        })
      } else if (!shouldPlay) {
        video.pause()
      }
    }

    const onPlaying = () => {
      setShowVideo(true)
      setIsPlaying(true)
      updatePlayback()
    }
    const onPause = () => setIsPlaying(false)
    const onError = () => {
      failed = true
      video.pause()
      setShowVideo(false)
      setCanControl(false)
    }
    const onPreference = () => {
      setCanControl(!preference.matches && !failed)
      if (preference.matches) setShowVideo(false)
      updatePlayback()
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      updatePlayback()
    })
    observer.observe(media)
    video.addEventListener('playing', onPlaying)
    video.addEventListener('pause', onPause)
    video.addEventListener('error', onError)
    document.addEventListener('visibilitychange', updatePlayback)
    preference.addEventListener('change', onPreference)
    onPreference()

    return () => {
      disposed = true
      observer.disconnect()
      video.removeEventListener('playing', onPlaying)
      video.removeEventListener('pause', onPause)
      video.removeEventListener('error', onError)
      document.removeEventListener('visibilitychange', updatePlayback)
      preference.removeEventListener('change', onPreference)
      video.pause()
      video.removeAttribute('src')
      video.load()
    }
  }, [])

  function togglePlayback() {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      userPausedRef.current = false
      video.play().catch(() => setIsPlaying(false))
    } else {
      userPausedRef.current = true
      video.pause()
    }
  }

  const playbackLabel = isPlaying ? 'Pause background video' : 'Play background video'

  return (
    <>
      <div ref={mediaRef} className={styles.heroFilm} aria-hidden="true" data-hero-film="">
        <img
          className={styles.heroPoster}
          src={posterSource}
          alt=""
          width={1920}
          height={1080}
          loading="eager"
          fetchPriority="high"
        />
        <video
          ref={videoRef}
          className={styles.heroVideo}
          data-visible={showVideo}
          muted
          loop
          playsInline
          preload="none"
          poster={posterSource}
          tabIndex={-1}
          disablePictureInPicture
        />
      </div>
      {canControl && (
        <button type="button" className={styles.heroPlayback} onClick={togglePlayback} aria-label={playbackLabel} title={playbackLabel}>
          {isPlaying ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
        </button>
      )}
    </>
  )
}
