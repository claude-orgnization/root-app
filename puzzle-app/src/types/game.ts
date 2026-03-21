export type ShapeType =
  | 'circle'
  | 'triangle'
  | 'square'
  | 'star'
  | 'heart'
  | 'pentagon'
  | 'hexagon'

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
