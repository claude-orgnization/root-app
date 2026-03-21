import type { GameMode } from '../types/game'

interface GameHeaderProps {
  level: number
  score: number
  mode: GameMode
  onModeChange: () => void
}

export function GameHeader({ level, score, mode, onModeChange }: GameHeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-2xl">🧩</span>
        <h1 className="text-xl font-bold text-purple-700">かたちパズル</h1>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={onModeChange}
          className="text-xs px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors font-medium"
          aria-label="モードをかえる"
        >
          {mode === 'easy' ? '⭐ かんたん' : '🔥 むずかしい'}
        </button>
        <div className="text-center">
          <p className="text-xs text-gray-500">{mode === 'easy' ? 'レベル' : 'パズル'}</p>
          <p className="text-2xl font-bold text-purple-600">{level}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">スコア</p>
          <p className="text-2xl font-bold text-yellow-500">{score}</p>
        </div>
      </div>
    </header>
  )
}
