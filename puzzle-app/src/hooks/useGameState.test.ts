import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useGameState } from './useGameState'
import type { Level } from '../types/game'

const mockLevel1: Level = {
  number: 1,
  slots: [
    { id: 'slot-0', targetType: 'circle', filledBy: null },
    { id: 'slot-1', targetType: 'triangle', filledBy: null },
  ],
  pieces: [
    { id: 'piece-0', type: 'triangle', color: '#4ECDC4' },
    { id: 'piece-1', type: 'circle', color: '#FF6B6B' },
  ],
}

const mockLevel2: Level = {
  number: 2,
  slots: [
    { id: 'slot-0', targetType: 'square', filledBy: null },
    { id: 'slot-1', targetType: 'circle', filledBy: null },
  ],
  pieces: [
    { id: 'piece-0', type: 'circle', color: '#FF6B6B' },
    { id: 'piece-1', type: 'square', color: '#45B7D1' },
  ],
}

vi.mock('../utils/gameLogic', () => ({
  generateLevel: vi.fn((n: number) => (n === 1 ? mockLevel1 : mockLevel2)),
  checkShapeMatch: (a: string, b: string) => a === b,
  isLevelComplete: (slots: Array<{ filledBy: string | null }>) =>
    slots.length > 0 && slots.every((s) => s.filledBy !== null),
  calculateScore: (n: number) => n * 10,
}))

beforeEach(() => {
  vi.clearAllMocks()
})

describe('useGameState', () => {
  it('starts at level 1 with the generated level', () => {
    const { result } = renderHook(() => useGameState())
    expect(result.current.level.number).toBe(1)
    expect(result.current.score).toBe(0)
    expect(result.current.selectedPieceId).toBeNull()
    expect(result.current.isComplete).toBe(false)
  })

  it('selectPiece sets selectedPieceId', () => {
    const { result } = renderHook(() => useGameState())
    act(() => {
      result.current.selectPiece('piece-0')
    })
    expect(result.current.selectedPieceId).toBe('piece-0')
  })

  it('selectPiece deselects if same piece clicked again', () => {
    const { result } = renderHook(() => useGameState())
    act(() => {
      result.current.selectPiece('piece-0')
    })
    act(() => {
      result.current.selectPiece('piece-0')
    })
    expect(result.current.selectedPieceId).toBeNull()
  })

  it('placePiece does nothing if no piece is selected', () => {
    const { result } = renderHook(() => useGameState())
    act(() => {
      result.current.placePiece('slot-0')
    })
    expect(result.current.level.slots[0].filledBy).toBeNull()
  })

  it('placePiece fills slot on correct match', () => {
    const { result } = renderHook(() => useGameState())
    // piece-1 is 'circle', slot-0 is 'circle'
    act(() => {
      result.current.selectPiece('piece-1')
    })
    act(() => {
      result.current.placePiece('slot-0')
    })
    expect(result.current.level.slots[0].filledBy).toBe('piece-1')
    expect(result.current.selectedPieceId).toBeNull()
  })

  it('placePiece does not fill slot on wrong match', () => {
    const { result } = renderHook(() => useGameState())
    // piece-0 is 'triangle', slot-0 is 'circle' — wrong match
    act(() => {
      result.current.selectPiece('piece-0')
    })
    act(() => {
      result.current.placePiece('slot-0')
    })
    expect(result.current.level.slots[0].filledBy).toBeNull()
  })

  it('sets wrongSlotId on wrong match', () => {
    const { result } = renderHook(() => useGameState())
    act(() => {
      result.current.selectPiece('piece-0')
    })
    act(() => {
      result.current.placePiece('slot-0')
    })
    expect(result.current.wrongSlotId).toBe('slot-0')
  })

  it('placePiece does not fill already-filled slot', () => {
    const { result } = renderHook(() => useGameState())
    act(() => {
      result.current.selectPiece('piece-1')
    })
    act(() => {
      result.current.placePiece('slot-0')
    })
    // Now slot-0 is filled. Try to place another piece there.
    act(() => {
      result.current.selectPiece('piece-0')
    })
    act(() => {
      result.current.placePiece('slot-0')
    })
    expect(result.current.level.slots[0].filledBy).toBe('piece-1')
  })

  it('marks level complete when all slots filled', () => {
    const { result } = renderHook(() => useGameState())
    // piece-1=circle → slot-0=circle
    act(() => {
      result.current.selectPiece('piece-1')
    })
    act(() => {
      result.current.placePiece('slot-0')
    })
    // piece-0=triangle → slot-1=triangle
    act(() => {
      result.current.selectPiece('piece-0')
    })
    act(() => {
      result.current.placePiece('slot-1')
    })
    expect(result.current.isComplete).toBe(true)
    expect(result.current.score).toBe(10)
  })

  it('nextLevel advances to next level', () => {
    const { result } = renderHook(() => useGameState())
    act(() => {
      result.current.nextLevel()
    })
    expect(result.current.level.number).toBe(2)
    expect(result.current.isComplete).toBe(false)
  })

  it('restart resets to level 1 with zero score', () => {
    const { result } = renderHook(() => useGameState())
    act(() => {
      result.current.nextLevel()
    })
    act(() => {
      result.current.restart()
    })
    expect(result.current.level.number).toBe(1)
    expect(result.current.score).toBe(0)
    expect(result.current.isComplete).toBe(false)
  })

  it('availablePieceIds excludes placed pieces', () => {
    const { result } = renderHook(() => useGameState())
    expect(result.current.availablePieceIds).toHaveLength(2)
    // Place piece-1 (circle) in slot-0 (circle)
    act(() => {
      result.current.selectPiece('piece-1')
    })
    act(() => {
      result.current.placePiece('slot-0')
    })
    expect(result.current.availablePieceIds).toHaveLength(1)
    expect(result.current.availablePieceIds).not.toContain('piece-1')
  })
})
