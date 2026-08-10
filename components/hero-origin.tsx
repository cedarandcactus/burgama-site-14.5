'use client'

import { useEffect, useRef, useState } from 'react'
import { BrandMark } from '@/components/brand-mark'

/** Placeholder origin copy. Swap freely — structure does not depend on it. */
const PHRASES: string[][] = [
  [
    'The studio has become clearer.',
    'More selective in what we take on,',
    'and more deliberate in what we make.',
  ],
  [
    'Closer collaboration.',
    'Fewer assumptions. A direct line',
    'between the people with the idea',
    'and the people shaping it.',
  ],
  [
    'Sharper ideas. Stronger identities.',
    'Digital experiences and campaigns',
    'made to last beyond the moment.',
  ],
  ['Less noise. More conviction.', 'That standard now has a name.'],
]

const STAGES = PHRASES.length + 1

type Props = {
  /** Optional cinematic hero video. The sequence works without it. */
  videoSrc?: string
}

export function HeroOrigin({ videoSrc }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const [stage, setStage] = useState(0)

  useEffect(() => {
    const node = sectionRef.current
    if (!node) return

    let frame = 0

    const measure = () => {
      frame = 0
      const total = node.offsetHeight - window.innerHeight
      if (total <= 0) return
      const progress = Math.min(Math.max(-node.getBoundingClientRect().top / total, 0), 1)
      const next = Math.min(STAGES - 1, Math.floor(progress * STAGES))
      setStage((current) => (current === next ? current : next))
    }

    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  const skip = () => {
    const node = sectionRef.current
    if (!node) return
    window.scrollTo({
      top: node.offsetTop + node.offsetHeight - window.innerHeight * 0.05,
      behavior: 'smooth',
    })
  }

  const lineTransform = (state: 'past' | 'active' | 'future') => {
    if (state === 'active') return 'translate3d(0,0,0) scaleY(1)'
    if (state === 'future') return 'translate3d(0,110%,0) scaleY(0.9)'
    return 'translate3d(0,-110%,0) scaleY(0.9)'
  }

  return (
    <section
      ref={sectionRef}
      aria-label="Studio origin"
      className="relative h-[500vh]"
    >
      <div className="sticky top-0 flex h-[100svh] items-stretch p-module pt-[62px]">
        <div className="relative flex w-full overflow-hidden rounded-module bg-surface-1">
          {videoSrc ? (
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src={videoSrc}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-hidden="true"
              disablePictureInPicture
            />
          ) : null}

          <div className="relative flex w-full flex-col justify-between gap-8 p-6 md:p-10">
            <p className="t-ui">A note from the founder</p>

            <div className="relative rail h-[42svh] md:h-[38svh]">
              {PHRASES.map((lines, index) => {
                const state =
                  index === stage ? 'active' : index > stage ? 'future' : 'past'
                return (
                  <div
                    key={index}
                    aria-hidden={state !== 'active'}
                    className="absolute inset-x-0 top-0"
                  >
                    {lines.map((line, lineIndex) => (
                      <span key={line} className="block overflow-hidden">
                        <span
                          className="t-title block will-change-transform"
                          style={{
                            transformOrigin: 'top',
                            transform: lineTransform(state),
                            transition: 'transform 0.82s cubic-bezier(0.16,1,0.3,1)',
                            transitionDelay:
                              state === 'active' ? `${lineIndex * 70}ms` : '0ms',
                          }}
                        >
                          {line}
                        </span>
                      </span>
                    ))}
                  </div>
                )
              })}

              <div
                aria-hidden={stage !== STAGES - 1}
                className="absolute inset-x-0 top-0 flex flex-col gap-6"
              >
                <span className="block overflow-hidden">
                  <span
                    className="wordmark t-display block will-change-transform"
                    style={{
                      transformOrigin: 'top',
                      transform:
                        stage === STAGES - 1
                          ? 'translate3d(0,0,0) scaleY(1)'
                          : 'translate3d(0,110%,0) scaleY(0.9)',
                      transition: 'transform 0.86s cubic-bezier(0.16,1,0.3,1)',
                    }}
                  >
                    Burgama
                  </span>
                </span>
                <span className="block overflow-hidden">
                  <span
                    className="block will-change-transform"
                    style={{
                      transform:
                        stage === STAGES - 1
                          ? 'translate3d(0,0,0)'
                          : 'translate3d(0,110%,0)',
                      transition: 'transform 0.86s cubic-bezier(0.16,1,0.3,1)',
                      transitionDelay: stage === STAGES - 1 ? '120ms' : '0ms',
                    }}
                  >
                    <BrandMark className="h-6 w-auto md:h-8" />
                  </span>
                </span>
              </div>
            </div>

            <div className="flex items-end justify-between gap-module">
              <div className="flex gap-module" aria-hidden="true">
                {PHRASES.map((_, index) => (
                  <span
                    key={index}
                    className="h-1.5 w-9 rounded-sm transition-colors duration-300 ease-module"
                    style={{
                      backgroundColor:
                        index <= stage ? 'var(--periwinkle)' : 'var(--surface-3)',
                    }}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={skip}
                className="t-ui h-control rounded-module bg-surface-3 px-4 transition-colors duration-300 ease-module hover:bg-periwinkle hover:text-navy focus-visible:bg-periwinkle focus-visible:text-navy"
              >
                Skip intro
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
