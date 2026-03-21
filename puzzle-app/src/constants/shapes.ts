import type { ShapeType } from '../types/game'

export const SHAPE_COLORS: Record<ShapeType, string> = {
  circle: '#FF6B6B',
  triangle: '#4ECDC4',
  square: '#45B7D1',
  star: '#FFA726',
  heart: '#EC407A',
  pentagon: '#66BB6A',
  hexagon: '#AB47BC',
}

export const SHAPE_NAMES_JP: Record<ShapeType, string> = {
  circle: 'まる',
  triangle: 'さんかく',
  square: 'しかく',
  star: 'ほし',
  heart: 'はーと',
  pentagon: 'ごかっけい',
  hexagon: 'ろっかっけい',
}

export const LEVEL_SHAPE_CONFIGS: ShapeType[][] = [
  ['circle', 'triangle', 'square'],
  ['square', 'circle', 'triangle'],
  ['triangle', 'square', 'circle'],
  ['circle', 'triangle', 'square', 'star'],
  ['circle', 'heart', 'triangle', 'square'],
  ['star', 'heart', 'circle', 'triangle'],
  ['circle', 'triangle', 'square', 'star', 'heart'],
  ['pentagon', 'circle', 'triangle', 'square', 'star'],
  ['hexagon', 'pentagon', 'circle', 'triangle', 'heart'],
  ['circle', 'triangle', 'square', 'star', 'heart', 'pentagon'],
]
