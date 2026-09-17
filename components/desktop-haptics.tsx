'use client'

import { useEffect, useState, type ComponentType } from 'react'

export function DesktopHaptics() {
  const [Haptics, setHaptics] = useState<ComponentType | null>(null)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return

    let active = true
    void import('./site-haptics').then(({ SiteHaptics }) => {
      if (active) setHaptics(() => SiteHaptics)
    })

    return () => {
      active = false
    }
  }, [])

  return Haptics ? <Haptics /> : null
}
