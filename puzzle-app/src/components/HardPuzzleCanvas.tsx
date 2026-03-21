import type { TangramSlot, TangramPuzzleConfig, Shape } from '../types/game'
import { ShapeSVG } from './ShapeSVG'
import { ShapePiece } from './ShapePiece'
import { useDragDrop } from '../hooks/useDragDrop'
import { SHAPE_NAMES_JP } from '../constants/shapes'

interface HardPuzzleCanvasProps {
  config: TangramPuzzleConfig
  slots: TangramSlot[]
  pieces: Shape[]
  wrongSlotId: string | null
  availablePieceIds: string[]
  placePieceById: (pieceId: string, slotId: string) => void
}

function parseCentroid(points: string): { x: number; y: number } {
  const pts = points.split(' ').map((pt) => {
    const [x, y] = pt.split(',').map(Number)
    return { x, y }
  })
  const cx = pts.reduce((sum, p) => sum + p.x, 0) / pts.length
  const cy = pts.reduce((sum, p) => sum + p.y, 0) / pts.length
  return { x: cx, y: cy }
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
    <main className="flex flex-col items-center gap-6 p-4 select-none">
      <div className="text-center">
        <h2 className="text-xl font-bold text-orange-700">{config.title}</h2>
        <p className="text-sm text-gray-500 mt-1">{config.subtitle}</p>
      </div>

      <p className="text-lg text-gray-500">
        {draggingPieceId ? 'おきたいばしょにはなしてね！' : 'かたちをドラッグしてね！'}
      </p>

      {/* SVG Tangram Canvas */}
      <section aria-label="パズルキャンバス" className="overflow-x-auto">
        <svg
          width={config.canvasWidth}
          height={config.canvasHeight}
          viewBox={`0 0 ${config.canvasWidth} ${config.canvasHeight}`}
          className="rounded-3xl border-2 border-amber-200 bg-amber-50"
        >
          {/* Combined silhouette outline */}
          <path
            d={config.outlinePath}
            fill="none"
            stroke="#FCD34D"
            strokeWidth="3"
            strokeDasharray="8,5"
            pointerEvents="none"
          />

          {/* Slot polygons — filled with piece color or light gray */}
          {slots.map((slot) => {
            const filledPiece = slot.filledBy ? (pieceById.get(slot.filledBy) ?? null) : null
            const isFilled = slot.filledBy !== null
            const isWrong = wrongSlotId === slot.id
            const isDragOver = dragOverSlotId === slot.id

            let fillColor = '#E5E7EB' // gray-200 (empty)
            if (isFilled && filledPiece) fillColor = filledPiece.color
            else if (isWrong) fillColor = '#FCA5A5' // red-300
            else if (isDragOver) fillColor = '#C4B5FD' // purple-300

            return (
              <polygon
                key={slot.id}
                points={slot.points}
                fill={fillColor}
                stroke={isFilled ? '#ffffff' : '#D1D5DB'}
                strokeWidth={isFilled ? '1' : '1.5'}
                data-slot-id={isFilled ? undefined : slot.id}
                style={{ cursor: isFilled ? 'default' : 'pointer', transition: 'fill 0.15s' }}
              />
            )
          })}

          {/* Shape name hints inside empty slots */}
          {slots.map((slot) => {
            if (slot.filledBy !== null) return null
            const { x: cx, y: cy } = parseCentroid(slot.points)
            return (
              <text
                key={`label-${slot.id}`}
                x={cx}
                y={cy}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="13"
                fill="#9CA3AF"
                pointerEvents="none"
                style={{ userSelect: 'none' }}
              >
                {SHAPE_NAMES_JP[slot.targetType]}
              </text>
            )
          })}
        </svg>
      </section>

      {/* Instruction */}
      <p className="text-sm text-orange-600 font-medium">⚠️ ピースをぜんぶつかってね！</p>

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
