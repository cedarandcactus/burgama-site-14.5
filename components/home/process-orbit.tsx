'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef, type RefObject } from 'react'
import { CatmullRomCurve3, Vector3, type Mesh, type MeshStandardMaterial } from 'three'

const destinations = [.07, .43, .76]
type Props = {
  active: boolean
  phase: RefObject<number>
  onReady: () => void
  onFailure: () => void
}

function Orbit({ active, phase, onReady, onFailure }: Props) {
  const { size, gl, invalidate } = useThree()
  const sphere = useRef<Mesh>(null)
  const nodes = useRef<(Mesh | null)[]>([])
  const started = useRef(false)
  const callbacks = useRef({ onReady, onFailure })
  callbacks.current = { onReady, onFailure }
  const small = size.width < 600
  const radius = small ? 2.6 : 3.2
  const curve = useMemo(() => {
    const points = Array.from({ length: 96 }, (_, index) => {
      const angle = index / 96 * Math.PI * 2
      const cos = Math.cos(angle)
      const sin = Math.sin(angle)
      const x = Math.sign(cos) * Math.abs(cos) ** .58 * size.width * .453
      const y = Math.sign(sin) * Math.abs(sin) ** .58 * size.height * .433 - x / size.width * size.height * .075
      return new Vector3(x, y, Math.sin(angle + .4) * 26 + Math.cos(angle * 2) * 12)
    })
    return new CatmullRomCurve3(points, true, 'centripetal')
  }, [size.width, size.height])
  const stops = useMemo(() => destinations.map(value => curve.getPointAt(value)), [curve])
  const start = useMemo(() => curve.getPointAt(phase.current), [curve, phase])
  const position = useMemo(() => new Vector3(), [])

  useEffect(() => {
    started.current = false
    invalidate()
  }, [active, curve, invalidate])

  useEffect(() => {
    const canvas = gl.domElement
    const lost = (event: Event) => { event.preventDefault(); callbacks.current.onFailure() }
    canvas.addEventListener('webglcontextlost', lost)
    return () => canvas.removeEventListener('webglcontextlost', lost)
  }, [gl])

  useFrame((_, delta) => {
    if (active && started.current) phase.current = (phase.current + Math.min(delta, .05) / 16) % 1
    curve.getPointAt(phase.current, position)
    sphere.current?.position.copy(position)
    nodes.current.forEach((node, index) => {
      if (!node) return
      const distance = Math.abs(phase.current - destinations[index])
      const proximity = Math.max(0, 1 - Math.min(distance, 1 - distance) / .045)
      node.scale.setScalar(1 + proximity * .18)
      ;(node.material as MeshStandardMaterial).emissiveIntensity = proximity * .25
    })
    if (!started.current) { started.current = true; callbacks.current.onReady() }
  })

  return <>
    <ambientLight intensity={1.5} />
    <directionalLight position={[-200, 300, 500]} intensity={3} color="#afc8f2" />
    <directionalLight position={[250, -200, 250]} intensity={1.8} color="#8eafe3" />
    <mesh>
      <tubeGeometry args={[curve, 256, radius, 10, true]} />
      <meshStandardMaterial color="#2d5380" roughness={.3} metalness={.22} />
    </mesh>
    {stops.map((point, index) => <mesh key={index} position={point} ref={node => { nodes.current[index] = node }}>
      <sphereGeometry args={[small ? 5 : 6.5, 20, 14]} />
      <meshStandardMaterial color="#2d5380" emissive="#afc8f2" emissiveIntensity={0} roughness={.4} metalness={.12} />
    </mesh>)}
    <mesh ref={sphere} position={start}>
      <sphereGeometry args={[small ? 8.5 : 11.5, 28, 20]} />
      <meshStandardMaterial color="#011329" roughness={.2} metalness={.25} />
    </mesh>
  </>
}

export default function ProcessOrbit(props: Props) {
  return <Canvas
    orthographic
    camera={{ position: [0, 0, 1000], zoom: 1, near: .1, far: 2000 }}
    dpr={[1, 1.5]}
    frameloop={props.active ? 'always' : 'never'}
    gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
    fallback={null}
    style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
    onCreated={({ gl }) => { gl.setClearColor('#8eafe3', 0); gl.domElement.tabIndex = -1 }}
  >
    <Orbit {...props} />
  </Canvas>
}
