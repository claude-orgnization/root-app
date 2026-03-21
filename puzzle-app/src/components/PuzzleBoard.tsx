import type { Level, Shape } from '../types/game'
import { ShapeSlot } from './ShapeSlot'
import { ShapePiece } from './ShapePiece'

interface PuzzleBoardProps {
  level: Level
  selectedPieceId: string | null
  wrongSlotId: string | null
  availablePieceIds: string[]
  selectPiece: (pieceId: string) => void
  placePiece: (slotId: string) => void
}

export function PuzzleBoard({
  level,
  selectedPieceId,
  wrongSlotId,
  availablePieceIds,
  selectPiece,
  placePiece,
}: PuzzleBoardProps) {
  const pieceById = new Map<string, Shape>(
    level.pieces.map((p) => [p.id, p]),
  )

  const availablePieces = availablePieceIds
    .map((id) => pieceById.get(id))
    .filter((p): p is Shape => p !== undefined)

  return (
    <main className="flex flex-col items-center gap-8 p-6">
      <p className="text-lg text-gray-500">
        {selectedPieceId
          ? 'はめたいばしょをタップしてね！'
          : 'かたちをえらんでね！'}
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
                onPlace={placePiece}
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
                isSelected={selectedPieceId === piece.id}
                onSelect={selectPiece}
              />
            ))}
            {availablePieces.length === 0 && (
              <p className="text-gray-400 py-4">ぜんぶおわったよ！</p>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
