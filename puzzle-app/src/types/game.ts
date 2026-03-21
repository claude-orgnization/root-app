export type ShapeType =
  | 'circle'
  | 'triangle'
  | 'square'
  | 'star'
  | 'heart'
  | 'pentagon'
  | 'hexagon'
  | 'parallelogram'

export type GameMode = 'easy' | 'hard'

export interface Shape {
  id: string
  type: ShapeType
  color: string
}

export interface Slot {
  id: string
  targetType: ShapeType
  filledBy: string | null
}

export interface Level {
  number: number
  slots: Slot[]
  pieces: Shape[]
}

export interface HardSlot {
  id: string
  targetType: ShapeType
  filledBy: string | null
  x: number
  y: number
  width: number
  height: number
}

export interface HardPuzzleConfig {
  id: number
  title: string
  subtitle: string
  canvasWidth: number
  canvasHeight: number
  slots: Omit<HardSlot, 'filledBy'>[]
}
