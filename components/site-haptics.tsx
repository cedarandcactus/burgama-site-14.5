'use client'

import { useEffect } from 'react'
import { useWebHaptics } from 'web-haptics/react'

const controls = 'button, a[href], summary, input[type="checkbox"], input[type="radio"], [role="button"], [role="tab"], [role="switch"], [role="checkbox"], [role="radio"]'

export function SiteHaptics() {
  const { trigger, cancel } = useWebHaptics({ debug: false, showSwitch: false })

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    const onClick = (event: MouseEvent) => {
      if (!event.isTrusted || event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey || reducedMotion.matches) return
      const target = event.target instanceof Element ? event.target.closest(controls) : null
      if (!target || target.matches(':disabled') || target.closest('[aria-disabled="true"], [aria-busy="true"], [inert], [data-haptics="off"]')) return

      // Keep native navigation and form actions independent of optional device feedback.
      void trigger(15, { intensity: 0.4 })?.catch(() => {})
    }
    const onPreferenceChange = () => {
      if (reducedMotion.matches) cancel()
    }

    document.addEventListener('click', onClick, true)
    reducedMotion.addEventListener('change', onPreferenceChange)
    return () => {
      document.removeEventListener('click', onClick, true)
      reducedMotion.removeEventListener('change', onPreferenceChange)
      cancel()
    }
  }, [trigger, cancel])

  return null
}
