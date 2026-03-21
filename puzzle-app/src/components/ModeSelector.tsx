import type { GameMode } from '../types/game'

interface ModeSelectorProps {
  onSelect: (mode: GameMode) => void
}

export function ModeSelector({ onSelect }: ModeSelectorProps) {
  return (
    <div className="flex flex-col items-center gap-8 p-8 w-full max-w-sm mx-auto">
      <div className="text-center">
        <span className="text-6xl">🧩</span>
        <h2 className="text-2xl font-bold text-purple-700 mt-4">モードをえらんでね！</h2>
      </div>

      <div className="flex flex-col gap-4 w-full">
        <button
          onClick={() => onSelect('easy')}
          className="flex flex-col items-center p-6 bg-green-100 hover:bg-green-200 rounded-3xl border-2 border-green-300 transition-all hover:scale-105 active:scale-95 shadow-md"
        >
          <span className="text-4xl mb-2">⭐</span>
          <span className="text-xl font-bold text-green-700">かんたんモード</span>
          <span className="text-sm text-green-600 mt-1">かたちをマッチさせよう！</span>
        </button>

        <button
          onClick={() => onSelect('hard')}
          className="flex flex-col items-center p-6 bg-orange-100 hover:bg-orange-200 rounded-3xl border-2 border-orange-300 transition-all hover:scale-105 active:scale-95 shadow-md"
        >
          <span className="text-4xl mb-2">🔥</span>
          <span className="text-xl font-bold text-orange-700">むずかしいモード</span>
          <span className="text-sm text-orange-600 mt-1">
            かたちをくみあわせて大きなかたちをつくろう！
          </span>
        </button>
      </div>
    </div>
  )
}
