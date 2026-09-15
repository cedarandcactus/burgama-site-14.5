const shoulder = { x1: 0.32, y1: 0.38, x2: 0.64, y2: 0 } as const

export function homeCurvePoint(progress: number) {
  const t = Math.max(0, Math.min(1, progress))
  const inverse = 1 - t
  return {
    x: 3 * inverse ** 2 * t * shoulder.x1 + 3 * inverse * t ** 2 * shoulder.x2 + t ** 3,
    y: inverse ** 3 + 3 * inverse ** 2 * t * shoulder.y1 + 3 * inverse * t ** 2 * shoulder.y2,
  }
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
