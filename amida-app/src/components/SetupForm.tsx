import { useState } from 'react'
import type { AmidaConfig } from '../types/amida.ts'
import { generateBridges } from '../utils/amidaLogic.ts'

type Props = {
  onStart: (config: AmidaConfig) => void
}

const DEFAULT_PRIZES = ['1等', '2等', '3等', '4等', '5等', '6等', 'ハズレ', 'ハズレ']

export function SetupForm({ onStart }: Props) {
  const [numLines, setNumLines] = useState(4)
  const [names, setNames] = useState<string[]>(
    Array.from({ length: 8 }, (_, i) => `プレイヤー${i + 1}`)
  )
  const [prizes, setPrizes] = useState<string[]>(DEFAULT_PRIZES)

  function handleGenerate() {
    const topLabels = names.slice(0, numLines)
    const bottomLabels = prizes.slice(0, numLines)
    const numRows = numLines * 2 + 2
    const bridges = generateBridges(numLines, numRows)
    onStart({ numLines, numRows, bridges, topLabels, bottomLabels })
  }

  function updateName(i: number, value: string) {
    setNames(prev => prev.map((n, idx) => (idx === i ? value : n)))
  }

  function updatePrize(i: number, value: string) {
    setPrizes(prev => prev.map((p, idx) => (idx === i ? value : p)))
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 w-full max-w-md">
      <h2 className="text-lg font-bold text-gray-700 mb-4">設定</h2>

      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-600 mb-2">人数</label>
        <div className="flex gap-2">
          {[2, 3, 4, 5, 6].map(n => (
            <button
              key={n}
              onClick={() => setNumLines(n)}
              className={`w-10 h-10 rounded-full font-bold text-sm transition-colors ${
                numLines === n
                  ? 'bg-indigo-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-2">参加者名</p>
          <div className="flex flex-col gap-2">
            {Array.from({ length: numLines }, (_, i) => (
              <input
                key={i}
                type="text"
                value={names[i] ?? ''}
                onChange={e => updateName(i, e.target.value)}
                maxLength={8}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                placeholder={`プレイヤー${i + 1}`}
              />
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600 mb-2">結果</p>
          <div className="flex flex-col gap-2">
            {Array.from({ length: numLines }, (_, i) => (
              <input
                key={i}
                type="text"
                value={prizes[i] ?? ''}
                onChange={e => updatePrize(i, e.target.value)}
                maxLength={8}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                placeholder={`結果${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={handleGenerate}
        className="w-full py-3 bg-indigo-500 text-white rounded-xl font-bold text-base hover:bg-indigo-600 active:scale-95 transition-all"
      >
        あみだを作る！
      </button>
    </div>
  )
}
