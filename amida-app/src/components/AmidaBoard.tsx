import { useEffect, useRef, useState } from 'react'
import type { AmidaConfig, PathPoint } from '../types/amida.ts'
import {
  LINE_SPACING,
  ROW_HEIGHT,
  TOP_OFFSET,
  svgWidth,
  svgHeight,
  lineX,
  bridgeY,
  computePath,
  getResultCol,
} from '../utils/amidaLogic.ts'

type Props = {
  config: AmidaConfig
  onReset: () => void
}

const ANIM_INTERVAL = 60

export function AmidaBoard({ config, onReset }: Props) {
  const [selectedLine, setSelectedLine] = useState<number | null>(null)
  const [tracePath, setTracePath] = useState<PathPoint[] | null>(null)
  const [animStep, setAnimStep] = useState(0)
  const [resultCol, setResultCol] = useState<number | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const width = svgWidth(config.numLines)
  const height = svgHeight(config.numRows)
  const bottomY = TOP_OFFSET + config.numRows * ROW_HEIGHT

  function handleLineClick(col: number) {
    if (selectedLine !== null) return
    const path = computePath(col, config)
    const result = getResultCol(col, config)
    setSelectedLine(col)
    setTracePath(path)
    setResultCol(result)
    setAnimStep(0)
  }

  useEffect(() => {
    if (tracePath === null) return
    if (animStep >= tracePath.length - 1) return

    intervalRef.current = setInterval(() => {
      setAnimStep(prev => {
        if (prev >= tracePath.length - 1) {
          clearInterval(intervalRef.current!)
          return prev
        }
        return prev + 1
      })
    }, ANIM_INTERVAL)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [tracePath, animStep])

  function handleReset() {
    setSelectedLine(null)
    setTracePath(null)
    setAnimStep(0)
    setResultCol(null)
    onReset()
  }

  const isAnimDone = tracePath !== null && animStep >= tracePath.length - 1

  const polylinePoints =
    tracePath
      ?.slice(0, animStep + 1)
      .map(p => `${p.x},${p.y}`)
      .join(' ') ?? ''

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm text-gray-500">
        {selectedLine === null ? '上の名前をタップしてスタート！' : isAnimDone ? '' : '移動中...'}
      </p>

      <div className="overflow-x-auto w-full flex justify-center">
        <svg
          width={width}
          height={height}
          className="select-none"
          style={{ minWidth: width }}
        >
          {/* Vertical lines */}
          {Array.from({ length: config.numLines }, (_, col) => (
            <line
              key={col}
              x1={lineX(col)}
              y1={TOP_OFFSET}
              x2={lineX(col)}
              y2={bottomY}
              stroke="#94a3b8"
              strokeWidth={3}
            />
          ))}

          {/* Horizontal bridges */}
          {config.bridges.map((bridge, i) => (
            <line
              key={i}
              x1={lineX(bridge.leftCol)}
              y1={bridgeY(bridge.row)}
              x2={lineX(bridge.leftCol + 1)}
              y2={bridgeY(bridge.row)}
              stroke="#94a3b8"
              strokeWidth={3}
            />
          ))}

          {/* Animated trace path */}
          {tracePath && animStep > 0 && (
            <polyline
              points={polylinePoints}
              fill="none"
              stroke="#f97316"
              strokeWidth={5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Top labels (clickable) */}
          {config.topLabels.map((label, col) => {
            const isSelected = selectedLine === col
            const isDisabled = selectedLine !== null && !isSelected
            return (
              <g
                key={col}
                onClick={() => !isDisabled && handleLineClick(col)}
                style={{ cursor: isDisabled ? 'default' : 'pointer' }}
              >
                <rect
                  x={lineX(col) - LINE_SPACING / 2 + 6}
                  y={4}
                  width={LINE_SPACING - 12}
                  height={TOP_OFFSET - 10}
                  rx={8}
                  fill={isSelected ? '#f97316' : isDisabled ? '#e2e8f0' : '#6366f1'}
                  opacity={isDisabled ? 0.4 : 1}
                />
                <text
                  x={lineX(col)}
                  y={TOP_OFFSET - 14}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize={13}
                  fontWeight="bold"
                >
                  {label.length > 5 ? label.slice(0, 4) + '…' : label}
                </text>
              </g>
            )
          })}

          {/* Bottom labels */}
          {config.bottomLabels.map((label, col) => {
            const isResult = isAnimDone && resultCol === col
            return (
              <g key={col}>
                <rect
                  x={lineX(col) - LINE_SPACING / 2 + 6}
                  y={bottomY + 6}
                  width={LINE_SPACING - 12}
                  height={ROW_HEIGHT - 10}
                  rx={8}
                  fill={isResult ? '#f97316' : '#e2e8f0'}
                />
                <text
                  x={lineX(col)}
                  y={bottomY + 6 + (ROW_HEIGHT - 10) / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={isResult ? 'white' : '#374151'}
                  fontSize={13}
                  fontWeight={isResult ? 'bold' : 'normal'}
                >
                  {label.length > 5 ? label.slice(0, 4) + '…' : label}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Result banner */}
      {isAnimDone && selectedLine !== null && resultCol !== null && (
        <div className="mt-2 px-6 py-4 bg-orange-50 border-2 border-orange-400 rounded-2xl text-center shadow-md">
          <p className="text-orange-600 text-sm font-medium">結果</p>
          <p className="text-2xl font-bold text-orange-700 mt-1">
            {config.topLabels[selectedLine]} → {config.bottomLabels[resultCol]}
          </p>
        </div>
      )}

      <div className="flex gap-3 mt-2">
        {isAnimDone && (
          <button
            onClick={() => {
              setSelectedLine(null)
              setTracePath(null)
              setAnimStep(0)
              setResultCol(null)
            }}
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg font-medium hover:bg-indigo-600 transition-colors"
          >
            別の人も引く
          </button>
        )}
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
        >
          最初からやり直す
        </button>
      </div>
    </div>
  )
}
