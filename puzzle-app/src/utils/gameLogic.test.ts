import { describe, it, expect } from 'vitest'
import {
  checkShapeMatch,
  isLevelComplete,
  calculateScore,
  generateLevel,
  shuffleArray,
} from './gameLogic'
import type { Slot } from '../types/game'

describe('checkShapeMatch', () => {
  it('returns true when piece type matches slot target type', () => {
    expect(checkShapeMatch('circle', 'circle')).toBe(true)
    expect(checkShapeMatch('triangle', 'triangle')).toBe(true)
    expect(checkShapeMatch('star', 'star')).toBe(true)
  })

  it('returns false when piece type does not match slot target type', () => {
    expect(checkShapeMatch('circle', 'triangle')).toBe(false)
    expect(checkShapeMatch('star', 'heart')).toBe(false)
    expect(checkShapeMatch('square', 'circle')).toBe(false)
  })
})

describe('isLevelComplete', () => {
  it('returns true when all slots are filled', () => {
    const slots: Slot[] = [
      { id: 'slot-0', targetType: 'circle', filledBy: 'piece-0' },
      { id: 'slot-1', targetType: 'triangle', filledBy: 'piece-1' },
    ]
    expect(isLevelComplete(slots)).toBe(true)
  })

  it('returns false when any slot is empty', () => {
    const slots: Slot[] = [
      { id: 'slot-0', targetType: 'circle', filledBy: 'piece-0' },
      { id: 'slot-1', targetType: 'triangle', filledBy: null },
    ]
    expect(isLevelComplete(slots)).toBe(false)
  })

  it('returns false when all slots are empty', () => {
    const slots: Slot[] = [
      { id: 'slot-0', targetType: 'circle', filledBy: null },
    ]
    expect(isLevelComplete(slots)).toBe(false)
  })

  it('returns false for empty array', () => {
    expect(isLevelComplete([])).toBe(false)
  })
})

describe('calculateScore', () => {
  it('returns levelNumber * 10', () => {
    expect(calculateScore(1)).toBe(10)
    expect(calculateScore(3)).toBe(30)
    expect(calculateScore(5)).toBe(50)
  })
})

describe('generateLevel', () => {
  it('returns a level with the correct level number', () => {
    const level = generateLevel(1)
    expect(level.number).toBe(1)
  })

  it('returns level 1 with 3 slots', () => {
    const level = generateLevel(1)
    expect(level.slots).toHaveLength(3)
  })

  it('returns slots with correct target types for level 1', () => {
    const level = generateLevel(1)
    const slotTypes = level.slots.map((s) => s.targetType).sort()
    expect(slotTypes).toEqual(['circle', 'square', 'triangle'])
  })

  it('returns pieces matching the slots', () => {
    const level = generateLevel(1)
    const slotTypes = level.slots.map((s) => s.targetType).sort()
    const pieceTypes = level.pieces.map((p) => p.type).sort()
    expect(pieceTypes).toEqual(slotTypes)
  })

  it('returns slots with filledBy null', () => {
    const level = generateLevel(1)
    level.slots.forEach((slot) => {
      expect(slot.filledBy).toBeNull()
    })
  })

  it('returns level 4 with 4 slots', () => {
    const level = generateLevel(4)
    expect(level.slots).toHaveLength(4)
  })

  it('returns level 7 with 5 slots', () => {
    const level = generateLevel(7)
    expect(level.slots).toHaveLength(5)
  })

  it('clamps to the last config for high level numbers', () => {
    const level = generateLevel(100)
    expect(level.slots.length).toBeGreaterThan(0)
  })

  it('each piece has a unique id', () => {
    const level = generateLevel(1)
    const ids = level.pieces.map((p) => p.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(ids.length)
  })

  it('each slot has a unique id', () => {
    const level = generateLevel(1)
    const ids = level.slots.map((s) => s.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(ids.length)
  })

  it('pieces have colors', () => {
    const level = generateLevel(1)
    level.pieces.forEach((piece) => {
      expect(piece.color).toBeTruthy()
    })
  })
})

describe('shuffleArray', () => {
  it('returns an array with the same elements', () => {
    const arr = [1, 2, 3, 4, 5]
    const shuffled = shuffleArray(arr)
    expect(shuffled).toHaveLength(arr.length)
    expect(shuffled.sort()).toEqual(arr.sort())
  })

  it('does not mutate the original array', () => {
    const arr = [1, 2, 3]
    const original = [...arr]
    shuffleArray(arr)
    expect(arr).toEqual(original)
  })
})
