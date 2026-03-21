import type { Level, Shape } from '../types/game'
import { ShapeSlot } from './ShapeSlot'
import { ShapePiece } from './ShapePiece'
import { ShapeSVG } from './ShapeSVG'
import { useDragDrop } from '../hooks/useDragDrop'

interface PuzzleBoardProps {
  level: Level
  wrongSlotId: string | null
  availablePieceIds: string[]
  placePieceById: (pieceId: string, slotId: string) => void
}

export function PuzzleBoard({
  level,
  wrongSlotId,
  availablePieceIds,
  placePieceById,
}: PuzzleBoardProps) {
  const pieceById = new Map<string, Shape>(
    level.pieces.map((p) => [p.id, p]),
  )

  const { draggingPieceId, dragPos, dragOverSlotId, startDrag } = useDragDrop(placePieceById)

  const availablePieces = availablePieceIds
    .map((id) => pieceById.get(id))
    .filter((p): p is Shape => p !== undefined)

  const draggingPiece = draggingPieceId ? (pieceById.get(draggingPieceId) ?? null) : null

  return (
    <main className="flex flex-col items-center gap-8 p-6 select-none">
      <p className="text-lg text-gray-500">
        {draggingPieceId ? 'おきたいばしょにはなしてね！' : 'かたちをドラッグしてね！'}
      </p>

      {/* Slot area */}
      <section aria-label="パズルボード">
        <div className="flex flex-wrap gap-4 justify-center max-w-xl">
          {level.slots.map((slot) => {
            const filledPiece = slot.filledBy ? (pieceById.get(slot.filledBy) ?? null) : null
            return (
              <ShapeSlot
                key={slot.id}
                slot={slot}
                filledPiece={filledPiece}
                isWrong={wrongSlotId === slot.id}
                isDragOver={dragOverSlotId === slot.id}
              />
            )
          })}
        </div>
      </section>

      {/* Piece tray */}
      <section aria-label="ピーストレイ" className="w-full max-w-xl">
        <div className="bg-white rounded-3xl p-4 shadow-inner border border-gray-100">
          <div className="flex flex-wrap gap-4 justify-center">
            {availablePieces.map((piece) => (
              <ShapePiece
                key={piece.id}
                piece={piece}
                isDragging={draggingPieceId === piece.id}
                onDragStart={startDrag}
              />
            ))}
            {availablePieces.length === 0 && (
              <p className="text-gray-400 py-4">ぜんぶおわったよ！</p>
            )}
          </div>
        </div>
      </section>

      {/* Drag ghost — pointer-events-none so elementFromPoint skips it */}
      {draggingPiece && dragPos && (
        <div
          className="fixed pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2"
          style={{ left: dragPos.x, top: dragPos.y }}
        >
          <div className="w-24 h-24 rounded-2xl bg-white shadow-2xl flex items-center justify-center opacity-90 scale-110">
            <ShapeSVG type={draggingPiece.type} color={draggingPiece.color} size={64} />
          </div>
        </div>
      )}
    </main>
  )
}
