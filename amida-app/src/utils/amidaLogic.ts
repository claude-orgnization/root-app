import type { Bridge, AmidaConfig, PathPoint } from '../types/amida.ts'

export const LINE_SPACING = 80
export const ROW_HEIGHT = 52
export const PADDING = 48
export const TOP_OFFSET = 64

export function svgWidth(numLines: number): number {
  return PADDING * 2 + (numLines - 1) * LINE_SPACING
}

export function svgHeight(numRows: number): number {
  return TOP_OFFSET + numRows * ROW_HEIGHT + 64
}

export function lineX(col: number): number {
  return PADDING + col * LINE_SPACING
}

export function bridgeY(row: number): number {
  return TOP_OFFSET + row * ROW_HEIGHT + ROW_HEIGHT / 2
}

export function generateBridges(numLines: number, numRows: number): Bridge[] {
  const bridges: Bridge[] = []
  for (let row = 0; row < numRows; row++) {
    const used = new Set<number>()
    for (let col = 0; col < numLines - 1; col++) {
      if (!used.has(col) && !used.has(col + 1) && Math.random() < 0.45) {
        bridges.push({ row, leftCol: col })
        used.add(col)
        used.add(col + 1)
      }
    }
  }
  return bridges
}

export function computePath(startCol: number, config: AmidaConfig): PathPoint[] {
  const points: PathPoint[] = []
  let col = startCol

  points.push({ x: lineX(col), y: TOP_OFFSET })

  for (let row = 0; row < config.numRows; row++) {
    const midY = bridgeY(row)

    points.push({ x: lineX(col), y: midY })

    const rightBridge = config.bridges.find(b => b.row === row && b.leftCol === col)
    const leftBridge = config.bridges.find(b => b.row === row && b.leftCol === col - 1)

    if (rightBridge) {
      col++
      points.push({ x: lineX(col), y: midY })
    } else if (leftBridge) {
      col--
      points.push({ x: lineX(col), y: midY })
    }

    points.push({ x: lineX(col), y: TOP_OFFSET + (row + 1) * ROW_HEIGHT })
  }

  return points
}

export function getResultCol(startCol: number, config: AmidaConfig): number {
  let col = startCol
  for (let row = 0; row < config.numRows; row++) {
    const right = config.bridges.find(b => b.row === row && b.leftCol === col)
    const left = config.bridges.find(b => b.row === row && b.leftCol === col - 1)
    if (right) col++
    else if (left) col--
  }
  return col
}
