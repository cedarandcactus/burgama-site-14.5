'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './home-page.module.css'

const videoSource = '/videos/compressed-22.mp4'
const posterSource = '/videos/compressed-22-poster.jpg'

export function HeroFilm() {
  const mediaRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [showVideo, setShowVideo] = useState(false)

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
      const shouldPlay = visible && !document.hidden && !preference.matches
      if (shouldPlay && !sourceAttached) {
        video.muted = true
        video.src = videoSource
        video.load()
        sourceAttached = true
      }
      if (shouldPlay && video.paused) {
        video.play().catch(() => {
          if (!disposed) setShowVideo(false)
        })
      } else if (!shouldPlay) {
        video.pause()
      }
    }

    const onPause = () => setShowVideo(false)
    const onPlaying = () => {
      setShowVideo(true)
      updatePlayback()
    }
    const onError = () => {
      failed = true
      video.pause()
      setShowVideo(false)
    }
    const onPreference = () => {
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

  return (
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
        data-background-video=""
        disableRemotePlayback
        controlsList="nodownload nofullscreen noremoteplayback"
        autoPlay
        controls={false}
        muted
        loop
        playsInline
        preload="none"
        poster={posterSource}
        tabIndex={-1}
        disablePictureInPicture
      />
    </div>
  )
}
