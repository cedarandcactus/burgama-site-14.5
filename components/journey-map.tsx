'use client'

import { useId, useRef, useState, type KeyboardEvent } from 'react'
import type { JourneyStage } from '@/lib/projects'

const statusLabel = { live: 'Live', built: 'Built', mapped: 'Mapped' } as const

export function JourneyMap({ stages }: { stages: JourneyStage[] }) {
  const [active, setActive] = useState(0)
  const [emailIndex, setEmailIndex] = useState(0)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const viewer = useRef<HTMLDivElement>(null)
  const id = useId()
  const stage = stages[active]
  const emails = stage.emails ?? []
  const email = emails[Math.min(emailIndex, emails.length - 1)]

  const select = (index: number, focus = false) => {
    const next = (index + stages.length) % stages.length
    setActive(next)
    setEmailIndex(0)
    viewer.current?.scrollTo({ top: 0 })
    tabs.current[next]?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' })
    if (focus) tabs.current[next]?.focus()
  }
  const onKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') { event.preventDefault(); select(active + 1, true) }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') { event.preventDefault(); select(active - 1, true) }
    if (event.key === 'Home') { event.preventDefault(); select(0, true) }
    if (event.key === 'End') { event.preventDefault(); select(stages.length - 1, true) }
  }

  return <div className="cs-journey" data-cs-reveal="media">
    <div className="cs-journey__track" role="tablist" aria-label="Customer journey">
      {stages.map((item, index) => <button
        key={item.flow}
        ref={element => { tabs.current[index] = element }}
        type="button"
        role="tab"
        id={`${id}-tab-${index}`}
        aria-selected={index === active}
        aria-controls={`${id}-panel`}
        tabIndex={index === active ? 0 : -1}
        className="cs-journey__stop"
        data-status={item.status}
        onClick={() => select(index)}
        onKeyDown={onKey}
      >
        <span className="cs-journey__dot" aria-hidden="true">{index + 1}</span>
        <span className="cs-journey__moment">{item.moment}</span>
        <span className="cs-journey__flow">{item.flow}</span>
      </button>)}
    </div>

    <div className="cs-journey__panel" role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${active}`} data-has-email={emails.length > 0}>
      <div className="cs-journey__info">
        <div className="cs-journey__head">
          <h3>{stage.flow}</h3>
          <span className="cs-journey__status" data-status={stage.status}>{statusLabel[stage.status]}</span>
        </div>
        <p className="cs-journey__trigger"><span>Trigger</span>{stage.trigger}</p>
        <ol className="cs-journey__steps">
          {stage.steps.map(step => <li key={`${step.when}-${step.what}`}><span className="cs-journey__when">{step.when}</span><span className="cs-journey__what">{step.what}</span></li>)}
        </ol>
        {stage.stats && <div className="cs-journey__stats">
          {stage.stats.map(stat => <div key={stat.label}><span className="cs-journey__value" aria-label={stat.accessibleValue ?? stat.value}>{stat.value}</span><span className="cs-journey__label">{stat.label}</span></div>)}
        </div>}
        <div className="cs-journey__nav">
          <button type="button" onClick={() => select(active - 1)} aria-label="Previous stage">←</button>
          <span>{active + 1} of {stages.length}</span>
          <button type="button" onClick={() => select(active + 1)} aria-label="Next stage">→</button>
        </div>
      </div>

      {email && <div className="cs-journey__email">
        {emails.length > 1 && <div className="cs-journey__chips" aria-label="Emails in this stage">
          {emails.map((item, index) => <button key={item.src} type="button" aria-pressed={item === email} onClick={() => { setEmailIndex(index); viewer.current?.scrollTo({ top: 0 }) }}>{item.title}</button>)}
        </div>}
        <div className="cs-journey__inbox">
          <div className="cs-journey__bar" aria-hidden="true"><span /><span /><span /><em>{email.title}</em></div>
          <div className="cs-journey__viewer" ref={viewer} tabIndex={0} aria-label={`${email.title}, full email. Scroll to read.`}>
            <img
              key={email.src}
              src={email.src.replace(/\.[^.]+$/, '-960.webp')}
              srcSet={[640, 960].map(width => `${email.src.replace(/\.[^.]+$/, `-${width}.webp`)} ${width}w`).join(', ')}
              sizes="(max-width: 900px) 92vw, 460px"
              width={email.width}
              height={email.height}
              alt={email.label}
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
        <p className="cs-journey__hint">Scroll to see the full email</p>
      </div>}
    </div>
  </div>
}
