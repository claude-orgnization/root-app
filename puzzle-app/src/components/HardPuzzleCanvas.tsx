import type { HardSlot, HardPuzzleConfig, Shape } from '../types/game'
import { ShapeSVG } from './ShapeSVG'
import { ShapePiece } from './ShapePiece'
import { useDragDrop } from '../hooks/useDragDrop'

interface HardPuzzleCanvasProps {
  config: HardPuzzleConfig
  slots: HardSlot[]
  pieces: Shape[]
  wrongSlotId: string | null
  availablePieceIds: string[]
  placePieceById: (pieceId: string, slotId: string) => void
}

export function HardPuzzleCanvas({
  config,
  slots,
  pieces,
  wrongSlotId,
  availablePieceIds,
  placePieceById,
}: HardPuzzleCanvasProps) {
  const pieceById = new Map<string, Shape>(pieces.map((p) => [p.id, p]))
  const { draggingPieceId, dragPos, dragOverSlotId, startDrag } = useDragDrop(placePieceById)

  const availablePieces = availablePieceIds
    .map((id) => pieceById.get(id))
    .filter((p): p is Shape => p !== undefined)

  const draggingPiece = draggingPieceId ? (pieceById.get(draggingPieceId) ?? null) : null

  return (
    <main className="flex flex-col items-center gap-6 p-6 select-none">
      <div className="text-center">
        <h2 className="text-xl font-bold text-orange-700">{config.title}</h2>
        <p className="text-sm text-gray-500 mt-1">{config.subtitle}</p>
      </div>

      <p className="text-lg text-gray-500">
        {draggingPieceId ? 'おきたいばしょにはなしてね！' : 'かたちをドラッグしてね！'}
      </p>

      {/* Puzzle canvas */}
      <section aria-label="パズルキャンバス" className="overflow-x-auto">
        <div
          className="relative bg-amber-50 rounded-3xl border-2 border-dashed border-amber-200 mx-auto"
          style={{ width: config.canvasWidth, height: config.canvasHeight }}
        >
          {slots.map((slot) => {
            const filledPiece = slot.filledBy ? (pieceById.get(slot.filledBy) ?? null) : null
            const isFilled = slot.filledBy !== null
            const isWrong = wrongSlotId === slot.id
            const isDragOver = dragOverSlotId === slot.id
            const shapeSize = Math.min(Math.min(slot.width, slot.height) * 0.7, 100)

            return (
              <div
                key={slot.id}
                className="absolute"
                style={{ left: slot.x, top: slot.y, width: slot.width, height: slot.height }}
                data-slot-id={isFilled ? undefined : slot.id}
              >
                <div
                  className={[
                    'w-full h-full rounded-xl border-2 flex items-center justify-center transition-all',
                    isWrong ? 'animate-bounce' : '',
                    isFilled
                      ? 'border-green-400 bg-green-50'
                      : isWrong
                        ? 'border-red-400 bg-red-50'
                        : isDragOver
                          ? 'border-purple-400 bg-purple-50 scale-105 shadow-lg'
                          : 'border-dashed border-amber-300 bg-white bg-opacity-70',
                  ].join(' ')}
                  aria-label={`スロット ${slot.id}`}
                >
                  {filledPiece ? (
                    <ShapeSVG type={filledPiece.type} color={filledPiece.color} size={shapeSize} />
                  ) : (
                    <ShapeSVG type={slot.targetType} color="#D1D5DB" size={shapeSize} />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Instruction: all pieces must be used */}
      <p className="text-sm text-orange-600 font-medium">
        ⚠️ ピースをぜんぶつかってね！
      </p>

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

      {/* Drag ghost */}
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
