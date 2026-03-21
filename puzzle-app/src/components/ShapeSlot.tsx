import type { Shape, Slot } from '../types/game'
import { ShapeSVG } from './ShapeSVG'

interface ShapeSlotProps {
  slot: Slot
  filledPiece: Shape | null
  isWrong: boolean
  isDragOver: boolean
}

export function ShapeSlot({ slot, filledPiece, isWrong, isDragOver }: ShapeSlotProps) {
  const isFilled = slot.filledBy !== null

  return (
    <div
      className={isWrong ? 'animate-bounce' : ''}
      data-slot-id={isFilled ? undefined : slot.id}
    >
      <div
        className={[
          'w-28 h-28 rounded-2xl border-4 flex items-center justify-center transition-all',
          isFilled
            ? 'border-green-400 bg-green-50'
            : isWrong
              ? 'border-red-400 bg-red-50'
              : isDragOver
                ? 'border-purple-400 bg-purple-50 scale-110 shadow-lg'
                : 'border-dashed border-gray-300 bg-white',
        ].join(' ')}
        aria-label={`スロット ${slot.id}`}
      >
        {filledPiece ? (
          <ShapeSVG type={filledPiece.type} color={filledPiece.color} size={80} />
        ) : (
          <ShapeSVG type={slot.targetType} color="#D1D5DB" size={80} />
        )}
      </div>
    </div>
  )
}
