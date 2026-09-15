const shoulder = { x1: 0.32, y1: 0.38, x2: 0.64, y2: 0 } as const

export function homeCurvePoint(progress: number) {
  const t = Math.max(0, Math.min(1, progress))
  const inverse = 1 - t
  return {
    x: 3 * inverse ** 2 * t * shoulder.x1 + 3 * inverse * t ** 2 * shoulder.x2 + t ** 3,
    y: inverse ** 3 + 3 * inverse ** 2 * t * shoulder.y1 + 3 * inverse * t ** 2 * shoulder.y2,
  }
}

export function homeSlopeSample(x: number, width: number, rise: number, direction: 'left' | 'right' = 'right') {
  const fraction = Math.max(0, Math.min(1, x / Math.max(1, width)))
  const target = direction === 'left' ? 1 - fraction : fraction
  let low = 0
  let high = 1
  for (let index = 0; index < 18; index++) {
    const middle = (low + high) / 2
    if (homeCurvePoint(middle).x < target) low = middle
    else high = middle
  }
  const t = (low + high) / 2
  const point = homeCurvePoint(t)
  const before = homeCurvePoint(t - 0.001)
  const after = homeCurvePoint(t + 0.001)
  return {
    y: point.y * rise,
    tangent: (after.y - before.y) * rise / Math.max(0.001, (after.x - before.x) * width) * (direction === 'left' ? -1 : 1),
  }
}

type CardEdge = { left: number; right: number; tangent: number; proximity: number }

export function homeCardPath(width: number, height: number, incoming: CardEdge, outgoing: CardEdge) {
  const depth = Math.min(48, height * 0.12, width * 0.14)
  const edge = ({ left, right, tangent, proximity }: CardEdge) => {
    const lean = Math.min(1, Math.abs(tangent) * 4)
    return {
      left: 5 + depth * proximity * (0.3 + left * 0.5 + (tangent > 0 ? lean * 0.2 : 0)),
      right: 5 + depth * proximity * (0.3 + right * 0.5 + (tangent < 0 ? lean * 0.2 : 0)),
      leftRadius: 18 + depth * proximity * (0.4 + left),
      rightRadius: 18 + depth * proximity * (0.4 + right),
    }
  }
  const top = edge(incoming)
  const bottom = edge(outgoing)
  const bottomLeft = height - bottom.left
  const bottomRight = height - bottom.right
  const controls = (left: number, right: number) => right < left
    ? `${width * shoulder.x1} ${right + (left - right) * shoulder.y1} ${width * shoulder.x2} ${right}`
    : `${width * (1 - shoulder.x2)} ${left} ${width * (1 - shoulder.x1)} ${left + (right - left) * shoulder.y1}`
  return `M 0 ${top.left + top.leftRadius} Q 0 ${top.left} ${top.leftRadius} ${top.left} C ${controls(top.left, top.right)} ${width - top.rightRadius} ${top.right} Q ${width} ${top.right} ${width} ${top.right + top.rightRadius} L ${width} ${bottomRight - bottom.rightRadius} Q ${width} ${bottomRight} ${width - bottom.rightRadius} ${bottomRight} C ${width * 0.64} ${bottomRight + (bottomLeft - bottomRight) * shoulder.y1} ${width * 0.32} ${bottomLeft} ${bottom.leftRadius} ${bottomLeft} Q 0 ${bottomLeft} 0 ${bottomLeft - bottom.leftRadius} Z`
}

export function homeSlopePath(width: number, rise: number, top = 0, extension = 0, direction: 'left' | 'right' = 'right') {
  if (direction === 'right') return homeCurvePath(width, rise, top, extension)
  const bottom = top + rise
  const rightEnd = bottom + extension * (1 - shoulder.y1) * rise / (shoulder.x1 * width)
  return `M ${-extension} ${top} L 0 ${top} C ${width * (1 - shoulder.x2)} ${top + rise * shoulder.y2} ${width * (1 - shoulder.x1)} ${top + rise * shoulder.y1} ${width} ${bottom} L ${width + extension} ${rightEnd}`
}

export function homeCurveExtensionLength(width: number, rise: number, extension: number) {
  return Math.hypot(extension, extension * (1 - shoulder.y1) * rise / (shoulder.x1 * width))
}

export function homeCurvePath(width: number, rise: number, top = 0, extension = 0, reverse = false) {
  const bottom = top + rise
  const leftEnd = bottom + extension * (1 - shoulder.y1) * rise / (shoulder.x1 * width)
  const first = `${width * shoulder.x1} ${top + rise * shoulder.y1}`
  const second = `${width * shoulder.x2} ${top + rise * shoulder.y2}`
  return reverse
    ? `M ${width + extension} ${top} L ${width} ${top} C ${second} ${first} 0 ${bottom} L ${-extension} ${leftEnd}`
    : `M ${-extension} ${leftEnd} L 0 ${bottom} C ${first} ${second} ${width} ${top} L ${width + extension} ${top}`
}
