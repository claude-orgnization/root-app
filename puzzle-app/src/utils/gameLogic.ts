import type { Level, Shape, ShapeType, Slot } from '../types/game'
import { LEVEL_SHAPE_CONFIGS, SHAPE_COLORS } from '../constants/shapes'

export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export function generateLevel(levelNumber: number): Level {
  const configIndex = Math.min(levelNumber - 1, LEVEL_SHAPE_CONFIGS.length - 1)
  const shapeTypes = LEVEL_SHAPE_CONFIGS[configIndex]

  const slots: Slot[] = shapeTypes.map((type, i) => ({
    id: `slot-${i}`,
    targetType: type,
    filledBy: null,
  }))

  const pieces: Shape[] = shuffleArray([...shapeTypes]).map((type, i) => ({
    id: `piece-${i}`,
    type,
    color: SHAPE_COLORS[type],
  }))

  return { number: levelNumber, slots, pieces }
}

export function checkShapeMatch(
  pieceType: ShapeType,
  slotTargetType: ShapeType,
): boolean {
  return pieceType === slotTargetType
}

export function isLevelComplete(slots: Slot[]): boolean {
  return slots.length > 0 && slots.every((slot) => slot.filledBy !== null)
}

export function calculateScore(levelNumber: number): number {
  return levelNumber * 10
}
