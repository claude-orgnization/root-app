interface LevelCompleteProps {
  score: number
  level: number
  onNextLevel: () => void
  onRestart: () => void
}

export function LevelComplete({ score, level, onNextLevel, onRestart }: LevelCompleteProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-8 p-6">
      <div className="text-center">
        <p className="text-6xl mb-4">🎉</p>
        <h2 className="text-4xl font-bold text-purple-700 mb-2">やったね！クリア！</h2>
        <p className="text-xl text-gray-600">レベル {level} すごい！</p>
      </div>

      <div className="bg-yellow-100 rounded-3xl px-12 py-6 text-center shadow-md">
        <p className="text-gray-500 text-sm">スコア</p>
        <p className="text-5xl font-bold text-yellow-500">{score}</p>
        <p className="text-yellow-400 text-2xl mt-1">⭐⭐⭐</p>
      </div>

      <div className="flex gap-4">
        <button
          onClick={onNextLevel}
          className="px-8 py-4 bg-purple-500 hover:bg-purple-600 text-white text-xl font-bold rounded-2xl shadow-lg active:scale-95 transition-all"
          aria-label="つぎのレベルへ"
        >
          つぎへ →
        </button>
        <button
          onClick={onRestart}
          className="px-8 py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xl font-bold rounded-2xl shadow-md active:scale-95 transition-all"
          aria-label="もういちどあそぶ"
        >
          もういちど
        </button>
      </div>
    </div>
  )
}
