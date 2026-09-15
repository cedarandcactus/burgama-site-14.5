'use client'

import { useEffect, useRef, useState } from 'react'
import styles from '@/components/site-footer.module.css'

const videoSource = '/videos/blue-hour-coast.mp4'
const posterSource = '/videos/blue-hour-coast-poster.jpg'

export function FooterFilm() {
  const mediaRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [showVideo, setShowVideo] = useState(false)

  useEffect(() => {
    const media = mediaRef.current
    const video = videoRef.current
    if (!media || !video) return

    const preference = matchMedia('(prefers-reduced-motion: reduce)')
    let nearby = false
    let visible = false
    let disposed = false
    let sourceAttached = false
    let videoFailed = false

    function updatePlayback() {
      if (!video || disposed || videoFailed) return
      const motionAllowed = !preference.matches
      if (nearby && motionAllowed && !sourceAttached) {
        video.src = videoSource
        video.load()
        sourceAttached = true
      }
      const shouldPlay = sourceAttached && visible && !document.hidden && motionAllowed
      if (shouldPlay && video.paused) {
        video.play().catch(() => {
          if (!disposed) setShowVideo(false)
        })
      } else if (!shouldPlay) {
        video.pause()
      }
    }

    const onPlaying = () => {
      setShowVideo(true)
      updatePlayback()
    }
    const onError = () => {
      videoFailed = true
      video.pause()
      setShowVideo(false)
    }
    const onPreference = () => {
      if (preference.matches) setShowVideo(false)
      updatePlayback()
    }

    const preloadObserver = new IntersectionObserver(([entry]) => {
      nearby = entry.isIntersecting
      updatePlayback()
    }, { rootMargin: '600px 0px' })
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      updatePlayback()
    }, { threshold: 0 })

    preloadObserver.observe(media)
    visibilityObserver.observe(media)
    video.addEventListener('playing', onPlaying)
    video.addEventListener('error', onError)
    document.addEventListener('visibilitychange', updatePlayback)
    preference.addEventListener('change', onPreference)

    return () => {
      disposed = true
      preloadObserver.disconnect()
      visibilityObserver.disconnect()
      video.removeEventListener('playing', onPlaying)
      video.removeEventListener('error', onError)
      document.removeEventListener('visibilitychange', updatePlayback)
      preference.removeEventListener('change', onPreference)
      video.pause()
      video.removeAttribute('src')
      video.load()
    }
  }, [])

  return (
    <div ref={mediaRef} className={styles.film} aria-hidden="true" data-footer-film="">
      <img className={styles.poster} src={posterSource} alt="" width={1920} height={1080} loading="lazy" decoding="async" />
      <video
        ref={videoRef}
        className={styles.video}
        data-visible={showVideo}
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
      <div className={styles.scrim} />
    </div>
  )
}
