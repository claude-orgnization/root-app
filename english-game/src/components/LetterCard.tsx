import { useState } from 'react'
import type { LetterData } from '../types/englishGame'

interface LetterCardProps {
  data: LetterData
  isExplored: boolean
  onPlay: (letter: string, word: string) => void
}

export function LetterCard({ data, isExplored, onPlay }: LetterCardProps) {
  const [isPopping, setIsPopping] = useState(false)

  const handleClick = () => {
    if (isPopping) return
    setIsPopping(true)
    onPlay(data.letter, data.word)
    setTimeout(() => setIsPopping(false), 350)
  }

  return (
    <button
      onClick={handleClick}
      className={`
        ${data.colorClass}
        ${isPopping ? 'animate-pop' : ''}
        ${isExplored ? 'ring-4 ring-white ring-offset-2 ring-offset-transparent brightness-110' : 'opacity-85 hover:opacity-100'}
        relative rounded-2xl p-2 flex flex-col items-center justify-center
        text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95
        transition-all duration-200 ease-out
        cursor-pointer select-none
        min-h-[100px] sm:min-h-[120px]
        touch-manipulation
      `}
      aria-label={`${data.letter} for ${data.word}`}
    >
      {isExplored && (
        <span className="absolute top-1 right-1 text-xs leading-none">⭐</span>
      )}
      <span className="text-3xl sm:text-4xl font-black leading-none drop-shadow">
        {data.letter}
      </span>
      <span className="text-xl sm:text-2xl mt-1">{data.emoji}</span>
      <span className="text-[10px] sm:text-xs font-bold mt-1 opacity-95 text-center leading-tight px-1">
        {data.word}
      </span>
    </button>
  )
}
