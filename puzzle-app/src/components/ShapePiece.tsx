import type { Shape } from '../types/game'
import { ShapeSVG } from './ShapeSVG'
import { SHAPE_NAMES_JP } from '../constants/shapes'

interface ShapePieceProps {
  piece: Shape
  isDragging: boolean
  onDragStart: (pieceId: string, x: number, y: number) => void
}

export function ShapePiece({ piece, isDragging, onDragStart }: ShapePieceProps) {
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    onDragStart(piece.id, e.clientX, e.clientY)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
    const t = e.touches[0]
    onDragStart(piece.id, t.clientX, t.clientY)
  }

  return (
    <div
      className={[
        'w-24 h-24 rounded-2xl flex items-center justify-center',
        'bg-white shadow-md cursor-grab active:cursor-grabbing touch-none select-none transition-all',
        isDragging ? 'opacity-40 scale-95' : 'hover:shadow-lg hover:scale-105',
      ].join(' ')}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      aria-label={SHAPE_NAMES_JP[piece.type]}
      role="button"
    >
      <ShapeSVG type={piece.type} color={piece.color} size={64} />
    </div>
  )
}
