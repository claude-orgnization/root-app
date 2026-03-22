import { useState, useEffect } from 'react'
import { ALPHABET_DATA } from './constants/alphabetData'
import { LetterCard } from './components/LetterCard'
import { CelebrationScreen } from './components/CelebrationScreen'
import { useSound } from './hooks/useSound'

const TOTAL_LETTERS = ALPHABET_DATA.length

function App() {
  const [exploredLetters, setExploredLetters] = useState<Set<string>>(new Set())
  const [showCelebration, setShowCelebration] = useState(false)
  const { playLetter, playVictory } = useSound()

  const handlePlay = (letter: string, word: string) => {
    playLetter(letter, word)
    setExploredLetters((prev) => {
      if (prev.has(letter)) return prev
      const next = new Set(prev)
      next.add(letter)
      return next
    })
  }

  useEffect(() => {
    if (exploredLetters.size === TOTAL_LETTERS) {
      const timer = setTimeout(() => {
        setShowCelebration(true)
        playVictory()
      }, 600)
      return () => clearTimeout(timer)
    }
  }, [exploredLetters, playVictory])

  const handleRestart = () => {
    setExploredLetters(new Set())
    setShowCelebration(false)
  }

  const progress = exploredLetters.size
  const progressPercent = (progress / TOTAL_LETTERS) * 100

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 via-blue-100 to-purple-200 p-3 sm:p-6">
      {showCelebration && <CelebrationScreen onRestart={handleRestart} />}

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6">
          <h1 className="text-3xl sm:text-5xl font-black text-purple-700 drop-shadow-sm">
            🔤 ABC アドベンチャー
          </h1>
          <p className="text-base sm:text-lg text-purple-600 font-bold mt-1">
            もじを おしてみよう！
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-4 sm:mb-6 bg-white rounded-2xl p-3 shadow-md">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm sm:text-base font-bold text-purple-600">
              ⭐ みつけた もじ
            </span>
            <span className="text-sm sm:text-base font-black text-purple-700">
              {progress} / {TOTAL_LETTERS}
            </span>
          </div>
          <div className="h-4 sm:h-5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Alphabet grid */}
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-7 gap-2 sm:gap-3">
          {ALPHABET_DATA.map((data) => (
            <LetterCard
              key={data.letter}
              data={data}
              isExplored={exploredLetters.has(data.letter)}
              onPlay={handlePlay}
            />
          ))}
        </div>

        {/* Footer hint */}
        <p className="text-center text-xs sm:text-sm text-purple-400 font-bold mt-4 opacity-70">
          タップして えいごの はつおんを きこう！🔊
        </p>
      </div>
    </div>
  )
}

export default App
