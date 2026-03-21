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

export interface TangramSlotDef {
  id: string
  targetType: ShapeType
  points: string // SVG polygon points in canvas coordinates
}

export interface TangramSlot extends TangramSlotDef {
  filledBy: string | null
}

export interface TangramPuzzleConfig {
  id: number
  title: string
  subtitle: string
  canvasWidth: number
  canvasHeight: number
  outlinePath: string // SVG path for the complete combined silhouette
  slots: TangramSlotDef[]
}
