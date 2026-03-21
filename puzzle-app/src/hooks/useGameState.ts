import { useState, useCallback, useRef } from 'react'
import type { Level, Slot } from '../types/game'
import {
  generateLevel,
  checkShapeMatch,
  isLevelComplete,
  calculateScore,
} from '../utils/gameLogic'

interface GameHookReturn {
  level: Level
  score: number
  selectedPieceId: string | null
  isComplete: boolean
  wrongSlotId: string | null
  availablePieceIds: string[]
  selectPiece: (pieceId: string) => void
  placePiece: (slotId: string) => void
  placePieceById: (pieceId: string, slotId: string) => void
  nextLevel: () => void
  restart: () => void
}

export function useGameState(): GameHookReturn {
  const [level, setLevel] = useState<Level>(() => generateLevel(1))
  const [score, setScore] = useState(0)
  const [selectedPieceId, setSelectedPieceId] = useState<string | null>(null)
  const [isComplete, setIsComplete] = useState(false)
  const [wrongSlotId, setWrongSlotId] = useState<string | null>(null)
  const wrongSlotTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const placedPieceIds = level.slots
    .filter((slot) => slot.filledBy !== null)
    .map((slot) => slot.filledBy as string)

  const availablePieceIds = level.pieces
    .filter((piece) => !placedPieceIds.includes(piece.id))
    .map((piece) => piece.id)

  const selectPiece = useCallback((pieceId: string) => {
    setSelectedPieceId((prev) => (prev === pieceId ? null : pieceId))
  }, [])

  const placePiece = useCallback(
    (slotId: string) => {
      if (!selectedPieceId) return

      const slot = level.slots.find((s) => s.id === slotId)
      if (!slot || slot.filledBy !== null) return

      const piece = level.pieces.find((p) => p.id === selectedPieceId)
      if (!piece) return

      if (checkShapeMatch(piece.type, slot.targetType)) {
        const newSlots: Slot[] = level.slots.map((s) =>
          s.id === slotId ? { ...s, filledBy: selectedPieceId } : s,
        )
        setLevel({ ...level, slots: newSlots })
        setSelectedPieceId(null)
        if (isLevelComplete(newSlots)) {
          setIsComplete(true)
          setScore((prev) => prev + calculateScore(level.number))
        }
      } else {
        if (wrongSlotTimeout.current) {
          clearTimeout(wrongSlotTimeout.current)
        }
        setWrongSlotId(slotId)
        wrongSlotTimeout.current = setTimeout(() => {
          setWrongSlotId(null)
        }, 600)
        setSelectedPieceId(null)
      }
    },
    [selectedPieceId, level],
  )

  const placePieceById = useCallback(
    (pieceId: string, slotId: string) => {
      const slot = level.slots.find((s) => s.id === slotId)
      if (!slot || slot.filledBy !== null) return

      const piece = level.pieces.find((p) => p.id === pieceId)
      if (!piece) return

      if (checkShapeMatch(piece.type, slot.targetType)) {
        const newSlots: Slot[] = level.slots.map((s) =>
          s.id === slotId ? { ...s, filledBy: pieceId } : s,
        )
        setLevel({ ...level, slots: newSlots })
        if (isLevelComplete(newSlots)) {
          setIsComplete(true)
          setScore((prev) => prev + calculateScore(level.number))
        }
      } else {
        if (wrongSlotTimeout.current) {
          clearTimeout(wrongSlotTimeout.current)
        }
        setWrongSlotId(slotId)
        wrongSlotTimeout.current = setTimeout(() => {
          setWrongSlotId(null)
        }, 600)
      }
    },
    [level],
  )

  const nextLevel = useCallback(() => {
    setLevel((prev) => generateLevel(prev.number + 1))
    setIsComplete(false)
    setSelectedPieceId(null)
    setWrongSlotId(null)
  }, [])

  const restart = useCallback(() => {
    setLevel(generateLevel(1))
    setScore(0)
    setIsComplete(false)
    setSelectedPieceId(null)
    setWrongSlotId(null)
  }, [])

  return {
    level,
    score,
    selectedPieceId,
    isComplete,
    wrongSlotId,
    availablePieceIds,
    selectPiece,
    placePiece,
    placePieceById,
    nextLevel,
    restart,
  }
}
