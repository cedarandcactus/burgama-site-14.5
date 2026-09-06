'use client'

import { useEffect, useRef, useState } from 'react'
import { fragmentShader, vertexShader } from './landscape-shaders'
import styles from './act-opening.module.css'

export function LandscapeScene({ paused }: { paused: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const controlRef = useRef<((paused: boolean) => void) | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const hero = canvas?.closest('section')
    if (!canvas || !hero) return
    const gl = canvas.getContext('webgl2', { alpha: false, antialias: false, depth: false, powerPreference: 'low-power' })
    if (!gl) return
    const program = gl.createProgram()
    const buffer = gl.createBuffer()
    if (!program || !buffer) return
    const shaders: WebGLShader[] = []
    const dispose = () => {
      shaders.forEach(shader => gl.deleteShader(shader))
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
    }
    for (const [type, source] of [[gl.VERTEX_SHADER, vertexShader], [gl.FRAGMENT_SHADER, fragmentShader]] as const) {
      const shader = gl.createShader(type)
      if (!shader) { dispose(); return }
      shaders.push(shader)
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) { dispose(); return }
      gl.attachShader(program, shader)
    }
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { dispose(); return }
    gl.useProgram(program)
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const position = gl.getAttribLocation(program, 'aPosition')
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)
    const resolution = gl.getUniformLocation(program, 'uResolution')
    const clock = gl.getUniformLocation(program, 'uTime')
    const impulses = gl.getUniformLocation(program, 'uRipples[0]')
    const ripples = new Float32Array(16)
    const palette = getComputedStyle(hero)
    const parseColor = (token: string, fallback: string) => {
      const raw = palette.getPropertyValue(token).trim()
      const hex = /^#[\da-f]{6}$/i.test(raw) ? raw.slice(1) : fallback
      return [0, 2, 4].map(index => parseInt(hex.slice(index, index + 2), 16) / 255)
    }
    for (const [uniform, token, fallback] of [
      ['uNavy', '--brand-navy', '080d20'], ['uBlue', '--brand-blue', '939edf'],
      ['uYellow', '--brand-yellow', 'f3d85e'], ['uWhite', '--brand-white', 'f5f4ef'],
    ]) gl.uniform3fv(gl.getUniformLocation(program, uniform), parseColor(token, fallback))
    const media = matchMedia('(prefers-reduced-motion: reduce)')
    let reduced = media.matches
    let stopped = false
    let visible = true
    let lost = false
    let frame = 0
    let time = 0
    let last = 0
    let previousDraw = 0
    let nextRipple = 0
    let lastPointer = 0
    const draw = () => {
      if (lost) return
      gl.uniform2f(resolution, canvas.width, canvas.height)
      gl.uniform1f(clock, time)
      gl.uniform4fv(impulses, ripples)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }
    const tick = (now: number) => {
      time += last ? Math.min((now - last) / 1000, 0.06) : 0
      last = now
      if (now - previousDraw >= 1000 / 30) { draw(); previousDraw = now }
      frame = requestAnimationFrame(tick)
    }
    const sync = () => {
      cancelAnimationFrame(frame)
      last = 0
      if (!stopped && !reduced && visible && !document.hidden && !lost) frame = requestAnimationFrame(tick)
    }
    controlRef.current = value => { stopped = value; sync() }
    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect()
      const mobile = width < 600
      const ratio = Math.min(devicePixelRatio || 1, mobile ? 1 : 1.25, (mobile ? 850 : 1400) / Math.max(width, height))
      canvas.width = Math.max(1, Math.round(width * ratio))
      canvas.height = Math.max(1, Math.round(height * ratio))
      gl.viewport(0, 0, canvas.width, canvas.height)
      draw()
    }
    const onPointer = (event: PointerEvent) => {
      if (event.target instanceof Element && event.target.closest('a, button')) return
      if (stopped || reduced || !visible || document.hidden || lost || performance.now() - lastPointer < 180) return
      const box = canvas.getBoundingClientRect()
      const x = (event.clientX - box.left) / box.width
      const y = 1 - (event.clientY - box.top) / box.height
      if (y < 0 || y > 0.43 || x < 0 || x > 1) return
      ripples.set([x, y, time, 1], nextRipple * 4)
      nextRipple = (nextRipple + 1) % (box.width < 600 ? 2 : 4)
      lastPointer = performance.now()
    }
    const onMotion = () => { reduced = media.matches; ripples.fill(0); draw(); sync() }
    const onLost = (event: Event) => { event.preventDefault(); lost = true; setReady(false); sync() }
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    const visibility = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync() })
    visibility.observe(hero)
    hero.addEventListener('pointermove', onPointer as EventListener, { passive: true })
    hero.addEventListener('pointerdown', onPointer as EventListener, { passive: true })
    document.addEventListener('visibilitychange', sync)
    media.addEventListener('change', onMotion)
    canvas.addEventListener('webglcontextlost', onLost)
    resize()
    setReady(true)
    sync()
    return () => {
      cancelAnimationFrame(frame)
      controlRef.current = null
      observer.disconnect()
      visibility.disconnect()
      hero.removeEventListener('pointermove', onPointer as EventListener)
      hero.removeEventListener('pointerdown', onPointer as EventListener)
      document.removeEventListener('visibilitychange', sync)
      media.removeEventListener('change', onMotion)
      canvas.removeEventListener('webglcontextlost', onLost)
      dispose()
    }
  }, [])

  useEffect(() => { controlRef.current?.(paused) }, [paused])

  return (
    <div className={styles.scene} aria-hidden="true" data-scene-ready={ready}>
      <div className={styles.fallback}><div className={styles.hills} /><div className={styles.water} /></div>
      <canvas ref={canvasRef} className={styles.canvas} style={{ opacity: ready ? 1 : 0 }} />
      <div className={styles.scrim} />
    </div>
  )
}
