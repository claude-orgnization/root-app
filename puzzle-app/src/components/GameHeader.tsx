interface GameHeaderProps {
  level: number
  score: number
}

export function GameHeader({ level, score }: GameHeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-2xl">🧩</span>
        <h1 className="text-xl font-bold text-purple-700">かたちパズル</h1>
      </div>
      <div className="flex gap-6">
        <div className="text-center">
          <p className="text-xs text-gray-500">レベル</p>
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
