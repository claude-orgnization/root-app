import { useState, useCallback, useRef, useEffect } from 'react'

interface DragPos {
  x: number
  y: number
}

interface UseDragDropReturn {
  draggingPieceId: string | null
  dragPos: DragPos | null
  dragOverSlotId: string | null
  startDrag: (pieceId: string, x: number, y: number) => void
}

export function useDragDrop(
  placePieceById: (pieceId: string, slotId: string) => void,
): UseDragDropReturn {
  const [draggingPieceId, setDraggingPieceId] = useState<string | null>(null)
  const [dragPos, setDragPos] = useState<DragPos | null>(null)
  const [dragOverSlotId, setDragOverSlotId] = useState<string | null>(null)

  const draggingRef = useRef<string | null>(null)
  const placePieceRef = useRef(placePieceById)
  placePieceRef.current = placePieceById

  const startDrag = useCallback((pieceId: string, x: number, y: number) => {
    draggingRef.current = pieceId
    setDraggingPieceId(pieceId)
    setDragPos({ x, y })
  }, [])

  useEffect(() => {
    const getSlotId = (x: number, y: number): string | null => {
      // pointer-events-none on ghost lets elementFromPoint skip the ghost element
      const el = document.elementFromPoint(x, y)
      return el?.closest('[data-slot-id]')?.getAttribute('data-slot-id') ?? null
    }

    const handleMove = (x: number, y: number) => {
      if (!draggingRef.current) return
      setDragPos({ x, y })
      setDragOverSlotId(getSlotId(x, y))
    }

    const handleEnd = (x: number, y: number) => {
      if (!draggingRef.current) return
      const slotId = getSlotId(x, y)
      if (slotId) {
        placePieceRef.current(draggingRef.current, slotId)
      }
      draggingRef.current = null
      setDraggingPieceId(null)
      setDragPos(null)
      setDragOverSlotId(null)
    }

    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY)
    const onMouseUp = (e: MouseEvent) => handleEnd(e.clientX, e.clientY)
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      const t = e.touches[0]
      handleMove(t.clientX, t.clientY)
    }
    const onTouchEnd = (e: TouchEvent) => {
      const t = e.changedTouches[0]
      handleEnd(t.clientX, t.clientY)
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
    document.addEventListener('touchmove', onTouchMove, { passive: false })
    document.addEventListener('touchend', onTouchEnd)

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('touchmove', onTouchMove)
      document.removeEventListener('touchend', onTouchEnd)
    }
  }, [])

  return { draggingPieceId, dragPos, dragOverSlotId, startDrag }
}
