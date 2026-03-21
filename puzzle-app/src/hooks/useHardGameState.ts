import { useState, useCallback, useRef } from 'react'
import type { HardSlot, HardPuzzleConfig, Shape } from '../types/game'
import { HARD_PUZZLE_CONFIGS } from '../constants/hardPuzzles'
import { SHAPE_COLORS } from '../constants/shapes'
import { shuffleArray } from '../utils/gameLogic'

interface HardGameHookReturn {
  puzzleIndex: number
  config: HardPuzzleConfig
  slots: HardSlot[]
  pieces: Shape[]
  score: number
  isComplete: boolean
  wrongSlotId: string | null
  availablePieceIds: string[]
  placePieceById: (pieceId: string, slotId: string) => void
  nextPuzzle: () => void
  restart: () => void
}

function buildSlots(config: HardPuzzleConfig): HardSlot[] {
  return config.slots.map((s) => ({ ...s, filledBy: null }))
}

function buildPieces(config: HardPuzzleConfig): Shape[] {
  return shuffleArray(
    config.slots.map((s, i) => ({
      id: `hp${config.id}-${i}`,
      type: s.targetType,
      color: SHAPE_COLORS[s.targetType],
    })),
  )
}

export function useHardGameState(): HardGameHookReturn {
  const [puzzleIndex, setPuzzleIndex] = useState(0)
  const [slots, setSlots] = useState<HardSlot[]>(() => buildSlots(HARD_PUZZLE_CONFIGS[0]))
  const [pieces, setPieces] = useState<Shape[]>(() => buildPieces(HARD_PUZZLE_CONFIGS[0]))
  const [score, setScore] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [wrongSlotId, setWrongSlotId] = useState<string | null>(null)
  const wrongSlotTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const placedPieceIds = slots.filter((s) => s.filledBy !== null).map((s) => s.filledBy as string)
  const availablePieceIds = pieces.filter((p) => !placedPieceIds.includes(p.id)).map((p) => p.id)

  const placePieceById = useCallback(
    (pieceId: string, slotId: string) => {
      const slot = slots.find((s) => s.id === slotId)
      if (!slot || slot.filledBy !== null) return

      const piece = pieces.find((p) => p.id === pieceId)
      if (!piece) return

      if (piece.type === slot.targetType) {
        const newSlots = slots.map((s) => (s.id === slotId ? { ...s, filledBy: pieceId } : s))
        setSlots(newSlots)
        if (newSlots.every((s) => s.filledBy !== null)) {
          setIsComplete(true)
          setScore((prev) => prev + (puzzleIndex + 1) * 20)
        }
      } else {
        if (wrongSlotTimeout.current) clearTimeout(wrongSlotTimeout.current)
        setWrongSlotId(slotId)
        wrongSlotTimeout.current = setTimeout(() => setWrongSlotId(null), 600)
      }
    },
    [slots, pieces, puzzleIndex],
  )

  const nextPuzzle = useCallback(() => {
    const nextIndex = (puzzleIndex + 1) % HARD_PUZZLE_CONFIGS.length
    const nextConfig = HARD_PUZZLE_CONFIGS[nextIndex]
    setPuzzleIndex(nextIndex)
    setSlots(buildSlots(nextConfig))
    setPieces(buildPieces(nextConfig))
    setIsComplete(false)
    setWrongSlotId(null)
  }, [puzzleIndex])

  const restart = useCallback(() => {
    const firstConfig = HARD_PUZZLE_CONFIGS[0]
    setPuzzleIndex(0)
    setSlots(buildSlots(firstConfig))
    setPieces(buildPieces(firstConfig))
    setScore(0)
    setIsComplete(false)
    setWrongSlotId(null)
  }, [])

  return {
    puzzleIndex,
    config: HARD_PUZZLE_CONFIGS[puzzleIndex],
    slots,
    pieces,
    score,
    isComplete,
    wrongSlotId,
    availablePieceIds,
    placePieceById,
    nextPuzzle,
    restart,
  }
}
