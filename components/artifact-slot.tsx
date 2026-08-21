'use client'

import { useEffect, useRef } from 'react'
import { getArtifact, RATIO_CSS } from '@/lib/artifacts'
import type { Artifact, ArtifactTreatment } from '@/lib/artifacts'
import { cn } from '@/lib/utils'

const TREATMENT_CLASS: Record<ArtifactTreatment, string | undefined> = {
  dither: 'artifact-dither',
  invert: 'artifact-invert',
  none: undefined,
}

/**
 * Renders one artifact from the registry, or a labelled placeholder if it has
 * no asset yet. Everything editable lives in `lib/artifacts.ts` — this
 * component only decides how to present what it finds there.
 */
export function ArtifactSlot({ id, className }: { id: string; className?: string }) {
  const artifact = getArtifact(id)

  // A missing id is an authoring mistake, so say so rather than render nothing.
  if (!artifact) {
    return (
      <div className={cn('artifact artifact-empty', className)}>
        <p className="artifact-slug">Unknown artifact “{id}”</p>
      </div>
    )
  }

  const aspectRatio = RATIO_CSS[artifact.ratio]

  // Unfilled: show what belongs here so slots can be filled one at a time.
  if (!artifact.src) {
    return (
      <div
        className={cn('artifact artifact-empty', className)}
        style={{ aspectRatio }}
        data-artifact={id}
      >
        <p className="artifact-slug">
          <span>{artifact.label}</span>
          <span className="artifact-slug-kind">
            {artifact.kind} · {artifact.ratio} · {artifact.treatment}
          </span>
        </p>
      </div>
    )
  }

  return (
    <figure className="artifact-figure">
      <div
        className={cn('artifact', TREATMENT_CLASS[artifact.treatment], className)}
        style={{ aspectRatio }}
        data-artifact={id}
      >
        {artifact.kind === 'video' ? (
          <ArtifactVideo artifact={artifact} />
        ) : (
          <img
            src={artifact.src || '/placeholder.svg'}
            alt={artifact.alt ?? ''}
            className="artifact-media"
            loading="lazy"
            decoding="async"
          />
        )}
      </div>

      {artifact.caption ? (
        <figcaption className="artifact-caption">{artifact.caption}</figcaption>
      ) : null}
    </figure>
  )
}

/**
 * Playback is driven here rather than with the `autoPlay` attribute so the
 * motion preference is read before the clip can start, and so an offscreen
 * artifact is not decoding video. Same approach the vault hero used.
 */
function ArtifactVideo({ artifact }: { artifact: Artifact }) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let visible = false

    const sync = () => {
      if (motion.matches || !visible) {
        video.pause()
        return
      }
      // Autoplay can still be refused; the poster stays visible if so.
      void video.play().catch(() => {})
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        sync()
      },
      { threshold: 0 },
    )
    observer.observe(video)
    motion.addEventListener('change', sync)

    return () => {
      observer.disconnect()
      motion.removeEventListener('change', sync)
    }
  }, [])

  return (
    <video
      ref={ref}
      className="artifact-media"
      poster={artifact.poster}
      aria-hidden={artifact.alt ? undefined : true}
      muted
      loop
      playsInline
      preload="metadata"
    >
      <source src={artifact.src} type="video/mp4" />
    </video>
  )
}
