'use client'

import { useEffect } from 'react'
import { useWebHaptics } from 'web-haptics/react'

const controls = 'button, a[href], summary, input[type="checkbox"], input[type="radio"], [role="button"], [role="tab"], [role="switch"], [role="checkbox"], [role="radio"]'

export function SiteHaptics() {
  const { trigger, cancel } = useWebHaptics({ debug: false, showSwitch: false })

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const coarsePointer = window.matchMedia('(pointer: coarse)')
    if (coarsePointer.matches) return

    const onClick = (event: MouseEvent) => {
      if (!event.isTrusted || event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey || reducedMotion.matches) return
      const target = event.target instanceof Element ? event.target.closest(controls) : null
      if (!target || target.matches(':disabled') || target.closest('[aria-disabled="true"], [aria-busy="true"], [inert], [data-haptics="off"]')) return

      // Keep native navigation and form actions independent of optional device feedback.
      const isLogo = target.getAttribute('data-haptics') === 'logo'
      void trigger([{ duration: isLogo ? 25 : 50 }], { intensity: isLogo ? 0.7 : 0.3 })?.catch(() => {})
    }
    const onSubmissionSuccess = () => {
      if (reducedMotion.matches || document.hidden) return
      void trigger([
        { duration: 40, intensity: 0.7 },
        { delay: 30, duration: 70, intensity: 0.7 },
        { delay: 20, duration: 40, intensity: 0.9 },
        { delay: 40, duration: 50, intensity: 0.6 },
      ])?.catch(() => {})
    }
    const onPreferenceChange = () => {
      if (reducedMotion.matches) cancel()
    }

    document.addEventListener('click', onClick, true)
    window.addEventListener('burgama:submission-success', onSubmissionSuccess)
    reducedMotion.addEventListener('change', onPreferenceChange)
    return () => {
      document.removeEventListener('click', onClick, true)
      window.removeEventListener('burgama:submission-success', onSubmissionSuccess)
      reducedMotion.removeEventListener('change', onPreferenceChange)
      cancel()
    }
  }, [trigger, cancel])

  return null
}
