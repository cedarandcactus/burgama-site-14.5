'use client'

import { useEffect, useRef } from 'react'
import { BURGAMA_PATHS } from '@/components/brand-mark'

const INTRO_TITLE = 'A note from the founder'

const SECTIONS = [
  'The studio has become clearer. More selective in what we take on, and more deliberate in what we make.',
  'Closer collaboration. Fewer assumptions. A direct line between the people with the idea and the people shaping it.',
  'Sharper ideas. Stronger identities. Digital experiences and campaigns made to last beyond the moment.',
  'Less noise. More conviction. That standard now has a name.',
]

const FINAL_WORD = 'Burgama'

/* The assembly order and thresholds of the real mark. Both are load-bearing. */
const LOGO_PART_ORDER = [1, 0, 3, 2, 5, 4, 6, 7, 9, 8]
const LOGO_PART_THRESHOLDS = [0, 0.075, 0.18, 0.275, 0.38, 0.475, 0.585, 0.68, 0.79, 0.89]
const LOGO_PART_OFFSETS: [number, number, number][] = [
  [12, -8, -5],
  [-12, -8, 5],
  [11, -1, -4],
  [-11, -1, 4],
  [7, 9, -3],
  [-7, 9, 3],
  [-13, 7, 4],
  [13, 7, -4],
  [9, 12, -3],
  [-9, 12, 3],
]

const TYPE_SCALE: Record<string, number> = { small: 0.86, standard: 1.06, large: 1.3 }
const LANGUAGE_SCALE: Record<string, number> = {
  ja: 0.86,
  zh: 0.86,
  tr: 0.94,
  fr: 0.95,
  de: 0.93,
  pl: 0.94,
  uk: 0.94,
  el: 0.95,
  es: 0.97,
  it: 0.97,
  pt: 0.97,
  nl: 0.96,
}

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value))
const lerp = (from: number, to: number, amount: number) => from + (to - from) * amount
/* Quintic smoothstep — the entrance eases every beat through this one curve. */
const smoother = (value: number) => {
  const x = clamp(value, 0, 1)
  return x * x * x * (x * (x * 6 - 15) + 10)
}

/** Splits copy into tokens, CJK-aware, so phrases break on meaning not bytes. */
function segment(text: string, language: string) {
  const normalized = text.replace(/\s+/g, ' ').trim()
  if (!normalized) return []
  const isCjk = language === 'ja' || language === 'zh'

  if (isCjk && typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    try {
      const locale = language === 'zh' ? 'zh-Hans' : 'ja'
      const segmenter = new Intl.Segmenter(locale, { granularity: 'word' })
      return [...segmenter.segment(normalized)]
        .map((item) => item.segment)
        .filter((token) => token && !/^\s+$/.test(token))
    } catch {
      /* fall through to per-character splitting */
    }
  }

  if (isCjk) return [...normalized].filter((token) => !/^\s+$/.test(token))
  return normalized.split(' ')
}

/** Rewrites an element into phrase → word spans that the timeline can scrub. */
function wrapCharacters(element: HTMLElement, source: string, language: string) {
  const isCjk = language === 'ja' || language === 'zh'
  const tokens = segment(source, language)
  const fragment = document.createDocumentFragment()
  const maximumPhraseWords = isCjk ? 6 : 3
  let phraseWords: string[] = []

  const flushPhrase = () => {
    if (!phraseWords.length) return
    const phrase = document.createElement('span')
    phrase.className = 'phrase-unit'

    phraseWords.forEach((word, wordIndex) => {
      const span = document.createElement('span')
      span.className = 'char-unit word-unit'
      span.textContent = word
      phrase.appendChild(span)

      if (!isCjk && wordIndex < phraseWords.length - 1) {
        const spacer = document.createElement('span')
        spacer.className = 'char-unit char-space'
        spacer.textContent = '\u00A0'
        phrase.appendChild(spacer)
      }
    })

    fragment.appendChild(phrase)
    if (!isCjk) fragment.appendChild(document.createTextNode(' '))
    phraseWords = []
  }

  tokens.forEach((word, index) => {
    phraseWords.push(word)
    const punctuationBreak = /[.,;:!?。！？、；：]$/.test(word)
    const lengthBreak = phraseWords.length >= maximumPhraseWords
    if (punctuationBreak || lengthBreak || index === tokens.length - 1) flushPhrase()
  })

  element.textContent = ''
  element.appendChild(fragment)
  return {
    characters: [...element.querySelectorAll<HTMLElement>('.char-unit:not(.char-space)')],
    phrases: [...element.querySelectorAll<HTMLElement>('.phrase-unit')],
  }
}

type Props = {
  /**
   * The single hero film. There is exactly one video element in the entrance —
   * the treatment layers and the film-to-navy resolve act on this same clip.
   */
  videoSrc?: string
}

export function HeroEntrance({ videoSrc }: Props) {
  const trackRef = useRef<HTMLElement>(null)
  const introRef = useRef<HTMLDivElement>(null)
  const introTitleRef = useRef<HTMLHeadingElement>(null)
  const sectionsRef = useRef<HTMLDivElement>(null)
  const finalWordRef = useRef<HTMLDivElement>(null)
  const logoStageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const track = trackRef.current
    const intro = introRef.current
    const introTitle = introTitleRef.current
    const sectionsHost = sectionsRef.current
    const finalWord = finalWordRef.current
    const logoStage = logoStageRef.current
    if (!track || !intro || !introTitle || !sectionsHost || !finalWord || !logoStage) return

    const root = document.documentElement
    const language = root.dataset.language || 'en'
    const sections = [...sectionsHost.querySelectorAll<HTMLElement>('.founder-section')]
    const sectionTexts = sections.map((section) =>
      section.querySelector<HTMLElement>('.founder-section-text'),
    )
    const finalCharacters = [
      ...finalWord.querySelectorAll<HTMLElement>('.founder-final-character'),
    ]
    const logoPaths = [...logoStage.querySelectorAll<SVGPathElement>('path')]

    const introText = wrapCharacters(introTitle, INTRO_TITLE, language)
    const sectionText = sectionTexts.map((element, index) =>
      element
        ? wrapCharacters(element, SECTIONS[index], language)
        : { characters: [], phrases: [] },
    )
    const characterGroups = [introText.characters, ...sectionText.map((item) => item.characters)]
    const phraseGroups = [introText.phrases, ...sectionText.map((item) => item.phrases)]

    let rendered = 0
    let previous = 0
    let velocity = 0
    let lastFrame = performance.now()
    let initialized = false
    let raf = 0

    const getProgress = () => {
      const total = Math.max(1, track.offsetHeight - window.innerHeight)
      return clamp(-track.getBoundingClientRect().top / total, 0, 1)
    }

    /* Each character brightens as the reading position sweeps past it. */
    const updateCharacterGroup = (
      characters: HTMLElement[],
      localProgress: number,
      visibility: number,
      intensity = 1,
    ) => {
      if (!characters.length) return
      const x = clamp(localProgress, 0, 1)
      const smooth = x * x * (3 - 2 * x)
      const activePosition = smooth * Math.max(0, characters.length - 1)
      const radius = 1.58 + velocity * 0.08
      const boost = (0.038 + velocity * 0.0025) * intensity
      const base = [139, 149, 203]
      const highlight = [204, 210, 247]

      characters.forEach((character, index) => {
        const distance = Math.abs(index - activePosition)
        const proximity = clamp(1 - distance / radius)
        const emphasis = proximity * proximity * (3 - 2 * proximity) * visibility
        const r = Math.round(base[0] + (highlight[0] - base[0]) * emphasis)
        const g = Math.round(base[1] + (highlight[1] - base[1]) * emphasis)
        const b = Math.round(base[2] + (highlight[2] - base[2]) * emphasis)

        character.style.setProperty('--char-scale', (1 + emphasis * boost).toFixed(4))
        character.style.setProperty('--char-opacity', (0.88 + emphasis * 0.12).toFixed(4))
        character.style.setProperty('--char-color', `rgb(${r} ${g} ${b} / 1)`)
        character.style.setProperty('--char-y', `${(-(emphasis * 1.9)).toFixed(2)}px`)
        character.style.setProperty('--char-focus', emphasis.toFixed(4))
      })
    }

    /* Phrases unfold from their leading edge, then hand the sentence forward. */
    const updatePhraseGroup = (
      phrases: HTMLElement[],
      arrival: number,
      departure: number,
      visibility = 1,
    ) => {
      if (!phrases.length) return
      const divisor = Math.max(1, phrases.length - 1)

      phrases.forEach((phrase, index) => {
        const order = index / divisor
        const enter = smoother((arrival - order * 0.2) / 0.55)
        const leave = smoother((departure - order * 0.16) / 0.58)
        const travel = 8 + order * 7
        const x = (1 - enter) * travel - leave * (6 + order * 4)
        const y = (1 - enter) * 3.5 - leave * 3.5

        phrase.style.setProperty(
          '--phrase-opacity',
          clamp((0.91 - leave * 0.13) * visibility, 0, 1).toFixed(4),
        )
        phrase.style.setProperty(
          '--phrase-blur',
          `${((1 - enter) * 1.5 + leave * 0.85).toFixed(2)}px`,
        )
        phrase.style.setProperty('--phrase-x', `${x.toFixed(2)}px`)
        phrase.style.setProperty('--phrase-y', `${y.toFixed(2)}px`)
        phrase.style.setProperty(
          '--phrase-scale-x',
          (0.965 + enter * 0.035 - leave * 0.012).toFixed(4),
        )
        phrase.style.setProperty('--phrase-clip-left', `${(leave * 100).toFixed(2)}%`)
        phrase.style.setProperty('--phrase-clip-right', `${((1 - enter) * 100).toFixed(2)}%`)
      })
    }

    const frame = (now: number) => {
      raf = 0
      const target = getProgress()
      if (!initialized) {
        rendered = target
        previous = rendered
        lastFrame = now
        initialized = true
      }

      /*
        A damped follower, not a direct jump. This single line is most of why the
        entrance feels controlled rather than reactive.
      */
      const deltaTime = Math.min(64, Math.max(8, now - lastFrame))
      const followAmount = 1 - Math.exp(-deltaTime / 210)
      rendered += (target - rendered) * followAmount
      if (Math.abs(target - rendered) < 0.000002) rendered = target

      const progress = clamp(rendered)

      const deltaProgress = progress - previous
      const instant = Math.min(1, Math.abs(deltaProgress) * (1000 / deltaTime) * 12)
      velocity = velocity * 0.9 + instant * 0.1
      previous = progress
      lastFrame = now

      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      const navWidth = Math.min(438, viewportWidth - 20)
      const compactNavWidth = Math.min(navWidth, viewportWidth < 760 ? 76 : 84)

      /* The nav only unwinds in the last one percent of the timeline. */
      const navUnwind = smoother((progress - 0.989) / 0.009)
      root.style.setProperty('--nav-unwind', navUnwind.toFixed(4))
      /* The assembled overlay is the nav logo during the entrance. The static
         copy only returns at the final unwind, making the handoff invisible. */
      root.style.setProperty('--nav-brand-opacity', navUnwind >= 0.985 ? '1' : '0')
      root.style.setProperty(
        '--nav-current-width',
        `${lerp(compactNavWidth, navWidth, navUnwind).toFixed(2)}px`,
      )

      const initialVideoHeight = Math.min(292, Math.max(224, viewportHeight * 0.31))
      const fullVideoWidth = Math.max(navWidth, Math.ceil(viewportWidth * 1.035) + 12)
      const fullVideoHeight = Math.ceil(viewportHeight * 1.035) + 12
      const noteScale =
        (TYPE_SCALE[root.dataset.typeScale || 'standard'] || 1.06) *
        (LANGUAGE_SCALE[root.dataset.language || 'en'] || 1)
      const initialNoteSize = (viewportWidth < 760 ? 17.4 : 18.6) * noteScale
      const maximumNoteSize = (viewportWidth < 760 ? 20.8 : 22.2) * noteScale

      const videoIn = smoother((progress - 0.02) / 0.15)
      const videoExpand = smoother((progress - 0.1) / 0.34)
      const blurBuild = smoother((progress - 0.2) / 0.42)
      const videoZoom = smoother((progress - 0.1) / 0.52)
      const scrollSoften = smoother((progress - 0.14) / 0.46)

      const introIn = smoother((progress - 0.398) / 0.225)
      const introTravel = smoother((progress - 0.522) / 0.178)
      const introOpacity = introIn * (1 - smoother((introTravel - 0.96) / 0.04))

      const sectionStart = 0.555
      const sectionRange = 0.884 - sectionStart
      const sectionsIn = smoother((progress - 0.535) / 0.045)
      const sectionsOut = smoother((progress - 0.886) / 0.045)
      const sectionsOpacity = sectionsIn * (1 - sectionsOut)
      const loaderProgress = clamp((progress - sectionStart) / sectionRange)

      const logoIn = smoother((progress - 0.398) / 0.028)
      const logoCenterMove = smoother((progress - 0.884) / 0.034)
      const logoExpand = smoother((progress - 0.916) / 0.042)
      const logoOut = smoother((progress - 0.942) / 0.02)
      const logoStageOpacity = logoIn * (1 - logoOut)

      const finalWordIn = smoother((progress - 0.96) / 0.018)
      const finalWordOut = smoother((progress - 0.976) / 0.008)
      const finalWordOpacity = finalWordIn * (1 - finalWordOut)
      const finalCharacterProgress = clamp((progress - 0.96) / 0.018)

      const videoWidth = lerp(navWidth, fullVideoWidth, videoExpand)
      const videoHeight = lerp(initialVideoHeight, fullVideoHeight, videoExpand)
      const noteBlend = smoother((progress - 0.31) / 0.56)

      /*
        The same video stays in place. Color sampled from the closing film palette
        rises over it and resolves into the exact solid field the page below uses.
      */
      const filmTint = smoother((progress - 0.99) / 0.01)
      const filmSolid = smoother((progress - 0.997) / 0.003)
      const filmSoften = smoother((progress - 0.992) / 0.008)

      const style = track.style
      style.setProperty('--hero-progress', progress.toFixed(4))
      style.setProperty('--glass-progress', blurBuild.toFixed(4))
      style.setProperty(
        '--video-clip-x',
        `${Math.max(0, (viewportWidth - videoWidth) * 0.5).toFixed(2)}px`,
      )
      style.setProperty(
        '--video-clip-y',
        `${Math.max(0, (viewportHeight - videoHeight) * 0.5).toFixed(2)}px`,
      )
      style.setProperty(
        '--video-radius',
        `${lerp(viewportWidth < 760 ? 11 : 14, 0, videoExpand).toFixed(2)}px`,
      )
      style.setProperty('--video-opacity', videoIn.toFixed(4))
      style.setProperty('--video-inner-scale', lerp(1.04, 1.26, videoZoom).toFixed(4))
      style.setProperty('--scroll-soften', scrollSoften.toFixed(4))
      style.setProperty('--note-blend', noteBlend.toFixed(4))
      style.setProperty('--gradient-sweep', smoother((videoExpand - 0.72) / 0.28).toFixed(4))
      style.setProperty('--film-tint', filmTint.toFixed(4))
      style.setProperty('--film-solid', filmSolid.toFixed(4))
      style.setProperty('--film-veil-y', `${lerp(viewportHeight * 0.1, 0, filmTint).toFixed(2)}px`)
      style.setProperty('--film-video-blur', `${lerp(13.5, 15.75, filmSoften).toFixed(2)}px`)
      style.setProperty('--film-video-brightness', lerp(0.81, 0.73, filmSoften).toFixed(4))
      style.setProperty('--film-video-contrast', lerp(1.13, 1.08, filmSoften).toFixed(4))
      style.setProperty('--note-width', `${navWidth.toFixed(2)}px`)
      style.setProperty(
        '--note-size',
        `${lerp(initialNoteSize, maximumNoteSize, smoother(loaderProgress)).toFixed(2)}px`,
      )
      style.setProperty('--intro-opacity', introOpacity.toFixed(4))
      style.setProperty('--sections-opacity', sectionsOpacity.toFixed(4))
      style.setProperty('--final-word-opacity', finalWordOpacity.toFixed(4))
      style.setProperty('--logo-stage-opacity', logoStageOpacity.toFixed(4))

      const introLocal = clamp((progress - 0.385) / 0.305)
      intro.style.setProperty(
        '--intro-y',
        `${(lerp(13, 0, introIn) - introTravel * viewportHeight * 0.58).toFixed(2)}px`,
      )
      intro.style.setProperty('--intro-scale', lerp(0.992, 1, introIn).toFixed(4))
      updatePhraseGroup(phraseGroups[0], introIn, smoother((introTravel - 0.6) / 0.4), 1)
      updateCharacterGroup(characterGroups[0], introLocal, introOpacity, 1.04)

      finalWord.style.setProperty(
        '--final-word-y',
        `${(lerp(10, 0, finalWordIn) - finalWordOut * 12).toFixed(2)}px`,
      )
      finalWord.style.setProperty('--final-word-scale', lerp(0.996, 1.002, finalWordIn).toFixed(4))
      finalWord.setAttribute('aria-hidden', String(finalWordOpacity < 0.08))
      finalCharacters.forEach((character, index) => {
        const characterIn = smoother((finalCharacterProgress - index * 0.112) / 0.37)
        character.style.setProperty(
          '--final-character-opacity',
          clamp(characterIn * (1 - finalWordOut), 0, 1).toFixed(4),
        )
        character.style.setProperty(
          '--final-character-y',
          `${(lerp(18, 0, characterIn) - finalWordOut * (5 + index * 0.45)).toFixed(2)}px`,
        )
        character.style.setProperty(
          '--final-character-blur',
          `${((1 - characterIn) * 8 + finalWordOut * 3.5).toFixed(2)}px`,
        )
        character.style.setProperty(
          '--final-character-scale',
          lerp(0.91, 1, characterIn).toFixed(4),
        )
      })

      /*
        Through the note, the assembling mark occupies the exact position the
        navbar brand will later hold. Only afterwards does it move to center.
      */
      /*
        This is the navbar logo itself continuing into the film. Read its real
        rendered box instead of approximating from the navbar shell: that keeps
        the assembled overlay pixel-aligned with the actual brand mark at every
        viewport and breakpoint.
      */
      const navBrand = document.querySelector<HTMLElement>('[data-nav-brand]')
      const navBrandMark = navBrand?.querySelector<SVGSVGElement>('svg')
      const navBrandRect = navBrandMark?.getBoundingClientRect()
      const logoBoxWidth = viewportWidth <= 580 ? 70 : 86
      const navLogoWidth = navBrandRect?.width || logoBoxWidth
      const navLogoCenterX = navBrandRect
        ? navBrandRect.left + navBrandRect.width * 0.5 - viewportWidth * 0.5
        : 0
      const navLogoCenterY = navBrandRect
        ? navBrandRect.top + navBrandRect.height * 0.5 - viewportHeight * 0.5
        : 13 + (viewportWidth <= 580 ? 44 : 46) * 0.5 - viewportHeight * 0.5
      const expandedLogoWidth = Math.min(viewportWidth < 760 ? 205 : 292, viewportWidth - 38)
      const logoDrawScale = lerp(
        navLogoWidth / logoBoxWidth,
        expandedLogoWidth / logoBoxWidth,
        logoExpand,
      )

      logoStage.style.setProperty(
        '--logo-stage-y',
        `${(lerp(8, 0, logoIn) - logoOut * 2).toFixed(2)}px`,
      )
      logoStage.style.setProperty('--logo-stage-scale', lerp(0.99, 1, logoIn).toFixed(4))
      logoStage.style.setProperty(
        '--logo-draw-x',
        `${lerp(navLogoCenterX, 0, logoCenterMove).toFixed(2)}px`,
      )
      logoStage.style.setProperty(
        '--logo-draw-y',
        `${lerp(
          lerp(navLogoCenterY, 0, logoCenterMove),
          -Math.min(10, viewportHeight * 0.012),
          logoExpand,
        ).toFixed(2)}px`,
      )
      logoStage.style.setProperty('--logo-draw-scale', logoDrawScale.toFixed(4))
      logoStage.setAttribute('aria-hidden', String(logoStageOpacity < 0.08))

      logoPaths.forEach((path, index) => {
        const sequenceIndex = LOGO_PART_ORDER.indexOf(index)
        const threshold = LOGO_PART_THRESHOLDS[Math.max(0, sequenceIndex)] ?? 0
        const partProgress = smoother((loaderProgress - threshold) / 0.085)
        const [offsetX, offsetY, rotation] = LOGO_PART_OFFSETS[index] || [0, 0, 0]
        const settle = Math.sin(partProgress * Math.PI) * 0.035
        const scale = 0.76 + 0.24 * partProgress + settle

        const partOpacity = clamp(partProgress * logoStageOpacity, 0, 1).toFixed(4)
        path.style.opacity = partOpacity
        path.style.fillOpacity = partOpacity
        path.style.setProperty('--logo-part-blur', `${((1 - partProgress) * 5.8).toFixed(2)}px`)
        path.style.transform = `translate(${(offsetX * (1 - partProgress)).toFixed(2)}px, ${(
          offsetY * (1 - partProgress)
        ).toFixed(2)}px) rotate(${(rotation * (1 - partProgress)).toFixed(2)}deg) scale(${scale.toFixed(
          4,
        )})`
      })

      /*
        The four thoughts are weighted by phrase count, so a longer paragraph is
        given more of the reading timeline than a short one.
      */
      const overall = clamp((progress - sectionStart) / sectionRange)
      const weights = phraseGroups.slice(1).map((group) => Math.max(3, group.length))
      const weightTotal = weights.reduce((sum, value) => sum + value, 0) || sections.length
      const starts: number[] = []
      const ends: number[] = []
      let cursor = 0
      weights.forEach((weight) => {
        starts.push(cursor / weightTotal)
        cursor += weight
        ends.push(cursor / weightTotal)
      })

      sections.forEach((section, index) => {
        const spanStart = starts[index] ?? 0
        const span = Math.max(0.0001, (ends[index] ?? 1) - spanStart)
        const local = (overall - spanStart) / span

        /* Each thought overlaps the next, compressing upward as it hands over. */
        const enter = smoother((local + 0.15) / 0.3)
        const leave = smoother((local - 0.74) / 0.34)
        const active = clamp(enter * (1 - leave) * sectionsOpacity, 0, 1)

        section.style.setProperty('--section-opacity', active.toFixed(4))
        section.style.setProperty(
          '--section-y',
          `${(lerp(34, 0, enter) - leave * 44).toFixed(2)}px`,
        )
        section.style.setProperty(
          '--section-scale',
          (lerp(0.988, 1, enter) * lerp(1, 0.992, leave)).toFixed(4),
        )
        section.style.setProperty(
          '--section-blur',
          `${((1 - enter) * 2.6 + leave * 2.1).toFixed(2)}px`,
        )
        section.style.zIndex = String(10 + Math.round(active * 10))
        section.setAttribute('aria-hidden', String(active < 0.018))

        updatePhraseGroup(
          phraseGroups[index + 1],
          clamp((local + 0.1) / 0.58),
          clamp((local - 0.72) / 0.3),
          clamp(0.72 + active * 0.28, 0, 1),
        )
        updateCharacterGroup(
          characterGroups[index + 1],
          clamp((local - 0.04) / 0.82),
          active,
          1 + index * 0.02,
        )
      })

      /* Keep following while the damped value is still catching up. */
      if (Math.abs(target - rendered) > 0.000002) request()
    }

    const request = () => {
      if (raf) return
      raf = window.requestAnimationFrame(frame)
    }

    request()
    window.addEventListener('scroll', request, { passive: true })
    window.addEventListener('resize', request)

    return () => {
      window.removeEventListener('scroll', request)
      window.removeEventListener('resize', request)
      if (raf) window.cancelAnimationFrame(raf)
      root.style.removeProperty('--nav-unwind')
      root.style.removeProperty('--nav-current-width')
      root.style.removeProperty('--nav-brand-opacity')
    }
  }, [])

  const skip = () => {
    const track = trackRef.current
    if (!track) return
    window.scrollTo({
      top: track.offsetTop + track.offsetHeight - window.innerHeight,
      behavior: 'smooth',
    })
  }

  return (
    <>
      <section ref={trackRef} className="hero-scroll" aria-label="Studio origin">
        <div className="hero-sticky">
          <div className="hero-media">
            {videoSrc ? (
              <video
                className="hero-video"
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
            <div className="hero-shadow" />
            <div className="hero-gauze" />
            <div className="hero-frost" />
            <div className="hero-gradient" />
            <div className="hero-dither" />
          </div>

          <div className="hero-color-transition" aria-hidden="true" />

          <div className="hero-copy-layer">
            <div className="hero-copy-shell">
              <div className="founder-experience">
                <div ref={introRef} className="founder-intro">
                  <span className="founder-intro-dingbat" aria-hidden="true">
                    ↳
                  </span>
                  <h2 ref={introTitleRef} className="founder-intro-title">
                    {INTRO_TITLE}
                  </h2>
                </div>

                <div ref={sectionsRef} className="founder-sections">
                  {SECTIONS.map((copy, index) => (
                    <article key={index} className="founder-section">
                      <p className="founder-section-text">{copy}</p>
                    </article>
                  ))}
                </div>

                <div ref={finalWordRef} className="founder-final-word" aria-hidden="true">
                  <span className="founder-final-name" aria-label={FINAL_WORD}>
                    {[...FINAL_WORD].map((character, index) => (
                      <span
                        key={index}
                        className="founder-final-character"
                        aria-hidden="true"
                      >
                        {character}
                      </span>
                    ))}
                  </span>
                </div>

                <div ref={logoStageRef} className="founder-logo-stage" aria-hidden="true">
                  <div className="founder-logo-drawing">
                    <svg
                      className="founder-end-logo"
              viewBox="0 0 2142 1195"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
                      focusable="false"
                    >
                      {BURGAMA_PATHS.map((d) => (
                        <path key={d.slice(0, 24)} d={d} />
                      ))}
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={skip}
            className="t-ui absolute right-3 bottom-3 z-10 h-control rounded-module bg-surface-2 px-4 transition-colors duration-300 ease-module hover:bg-periwinkle hover:text-navy focus-visible:bg-periwinkle focus-visible:text-navy"
          >
            Skip intro
          </button>
        </div>
      </section>
    </>
  )
}
