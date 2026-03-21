import type { Shape, Slot } from '../types/game'
import { ShapeSVG } from './ShapeSVG'

interface ShapeSlotProps {
  slot: Slot
  filledPiece: Shape | null
  isWrong: boolean
  onPlace: (slotId: string) => void
}

export function ShapeSlot({ slot, filledPiece, isWrong, onPlace }: ShapeSlotProps) {
  const isFilled = slot.filledBy !== null

  return (
    <div className={isWrong ? 'animate-bounce' : ''}>
      <button
        onClick={() => onPlace(slot.id)}
        disabled={isFilled}
        className={[
          'w-28 h-28 rounded-2xl border-4 flex items-center justify-center transition-all',
          isFilled
            ? 'border-green-400 bg-green-50 cursor-default'
            : isWrong
              ? 'border-red-400 bg-red-50'
              : 'border-dashed border-gray-300 bg-white hover:border-purple-400 hover:bg-purple-50 cursor-pointer',
        ].join(' ')}
        aria-label={`スロット ${slot.id}`}
      >
        {filledPiece ? (
          <ShapeSVG type={filledPiece.type} color={filledPiece.color} size={80} />
        ) : (
          <ShapeSVG type={slot.targetType} color="#D1D5DB" size={80} />
        )}
      </button>
    </div>
  )
}
