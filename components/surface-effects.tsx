'use client'

import { useScrollVelocity } from './use-scroll-velocity'
import styles from './surface-effects.module.css'

export function SurfaceEffects() {
  useScrollVelocity()

  return (
    <>
      <div aria-hidden="true" className={styles.texture} />
      <div
        aria-hidden="true"
        className={styles.glassLens}
        style={{
          backdropFilter: 'blur(var(--glass-blur, 8px)) saturate(1.08)',
          WebkitBackdropFilter: 'blur(var(--glass-blur, 8px)) saturate(1.08)',
        }}
      />
    </>
  )
}
