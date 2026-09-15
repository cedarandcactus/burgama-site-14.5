'use client'

import dynamic from 'next/dynamic'
import { Component, useEffect, useRef, useState, type ReactNode } from 'react'
import { ModularButton } from '@/components/modular-button'
import { Reveal } from '@/components/reveal'
import { SectionRise } from '@/components/home/section-rise'
import styles from './home-page.module.css'

const ProcessOrbit = dynamic(() => import('./process-orbit'), { ssr: false })
const fallbackPath = Array.from({ length: 96 }, (_, index) => {
  const angle = index / 96 * Math.PI * 2
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  const x = Math.sign(cos) * Math.abs(cos) ** .58 * 453
  const y = Math.sign(sin) * Math.abs(sin) ** .58 * 281.45 - x * .04875
  return `${index ? 'L' : 'M'}${(500 + x).toFixed(2)} ${(325 - y).toFixed(2)}`
}).join(' ') + ' Z'

class OrbitBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch() { this.props.onFailure() }
  render() { return this.state.failed ? null : this.props.children }
}

export function ActCapabilities() {
  const orbitRef = useRef<HTMLDivElement>(null)
  const phase = useRef(.16)
  const [nearby, setNearby] = useState(false)
  const [visible, setVisible] = useState(false)
  const [reduced, setReduced] = useState(true)
  const [tabVisible, setTabVisible] = useState(true)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const element = orbitRef.current
    if (!element) return
    const preference = matchMedia('(prefers-reduced-motion: reduce)')
    const syncPreference = () => { setReduced(preference.matches); setReady(false) }
    const syncVisibility = () => setTabVisible(!document.hidden)
    const preload = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setNearby(true); preload.disconnect() }
    }, { rootMargin: '280px' })
    const intersection = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting))
    syncPreference()
    syncVisibility()
    preload.observe(element)
    intersection.observe(element)
    preference.addEventListener('change', syncPreference)
    document.addEventListener('visibilitychange', syncVisibility)
    return () => {
      preload.disconnect()
      intersection.disconnect()
      preference.removeEventListener('change', syncPreference)
      document.removeEventListener('visibilitychange', syncVisibility)
    }
  }, [])

  const showScene = nearby && !reduced && !failed

  return (
    <section id="capabilities" className={styles.capabilities} data-nav-surface="frost" aria-labelledby="capabilities-heading">
      <div className={styles.processInner}>
        <div ref={orbitRef} className={styles.processOrbit} aria-hidden="true" data-orbit-ready={showScene && ready} data-orbit-running={showScene && visible && tabVisible}>
          <div className={styles.processFallback}>
            <svg viewBox="0 0 1000 650" preserveAspectRatio="none" fill="none" focusable="false">
              <path d={fallbackPath} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
            </svg>
            <span className={styles.processFallbackMarker} />
          </div>
          {showScene && <OrbitBoundary onFailure={() => setFailed(true)}>
            <ProcessOrbit active={visible && tabVisible} phase={phase} onReady={() => setReady(true)} onFailure={() => setFailed(true)} />
          </OrbitBoundary>}
        </div>
        <div className={styles.processContent}>
          <Reveal>
            <h2 id="capabilities-heading" className={styles.processHeading}>how we work</h2>
            <p className={styles.processDescription}>We start by listening, getting to know your business and what makes it different. Together, we shape a clear direction and bring it to life through identity, websites, content, and campaigns. We stay close to the work after launch, learning from what connects and refining what comes next.</p>
          </Reveal>
          <Reveal className={styles.processAction}><ModularButton href="#start-a-project">start a project</ModularButton></Reveal>
        </div>
      </div>
      <SectionRise surface="navy" />
    </section>
  )
}
