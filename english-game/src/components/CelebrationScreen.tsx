import { useMemo } from 'react'
import { CONFETTI_EMOJIS } from '../constants/alphabetData'

interface ConfettiPiece {
  id: number
  emoji: string
  left: number
  delay: number
  duration: number
  size: number
}

function generateConfetti(): ConfettiPiece[] {
  return Array.from({ length: 35 }, (_, i) => ({
    id: i,
    emoji: CONFETTI_EMOJIS[i % CONFETTI_EMOJIS.length] as string,
    left: (i * 2.86 + Math.sin(i) * 15 + 100) % 100,
    delay: (i * 0.09) % 2.5,
    duration: 2.5 + (i % 5) * 0.4,
    size: 24 + (i % 3) * 10,
  }))
}

interface CelebrationScreenProps {
  onRestart: () => void
}

export function CelebrationScreen({ onRestart }: CelebrationScreenProps) {
  const confetti = useMemo(() => generateConfetti(), [])

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-yellow-300 via-pink-300 to-purple-500 flex flex-col items-center justify-center overflow-hidden z-50 animate-fade-in">
      {/* Confetti */}
      {confetti.map((c) => (
        <span
          key={c.id}
          className="absolute animate-fall pointer-events-none"
          style={{
            left: `${c.left}%`,
            top: '-3rem',
            animationDelay: `${c.delay}s`,
            animationDuration: `${c.duration}s`,
            fontSize: `${c.size}px`,
          }}
        >
          {c.emoji}
        </span>
      ))}

      {/* Content */}
      <div className="text-center z-10 px-6">
        <div className="text-7xl sm:text-8xl mb-4 animate-bounce">🏆</div>

        <h1 className="text-4xl sm:text-6xl font-black text-white drop-shadow-lg mb-2">
          やったね！
        </h1>
        <p className="text-2xl sm:text-3xl font-black text-yellow-100 drop-shadow mb-1">
          You did it!
        </p>
        <p className="text-base sm:text-xl font-bold text-white opacity-90 mb-8">
          アルファベット ぜんぶ みつけたよ！🎉
        </p>

        <button
          onClick={onRestart}
          className="bg-white text-purple-600 font-black text-xl sm:text-2xl px-8 py-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-transform touch-manipulation"
        >
          もういちど！ 🔄
        </button>
      </div>
    </div>
  )
}
