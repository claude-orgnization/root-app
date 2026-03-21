import type { Shape } from '../types/game'
import { ShapeSVG } from './ShapeSVG'
import { SHAPE_NAMES_JP } from '../constants/shapes'

interface ShapePieceProps {
  piece: Shape
  isSelected: boolean
  onSelect: (pieceId: string) => void
}

export function ShapePiece({ piece, isSelected, onSelect }: ShapePieceProps) {
  return (
    <div className={isSelected ? 'ring-4 ring-yellow-400 rounded-2xl' : ''}>
      <button
        onClick={() => onSelect(piece.id)}
        className={[
          'w-24 h-24 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all active:scale-95',
          isSelected
            ? 'bg-yellow-50 shadow-lg scale-110'
            : 'bg-white shadow-md hover:shadow-lg hover:scale-105',
        ].join(' ')}
        aria-label={SHAPE_NAMES_JP[piece.type]}
      >
        <ShapeSVG type={piece.type} color={piece.color} size={64} />
      </button>
    </div>
  )
}
