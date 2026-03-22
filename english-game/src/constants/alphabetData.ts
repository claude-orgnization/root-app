import type { LetterData } from '../types/englishGame'

export const ALPHABET_DATA: LetterData[] = [
  { letter: 'A', word: 'Apple', emoji: '🍎', colorClass: 'bg-red-400' },
  { letter: 'B', word: 'Ball', emoji: '⚽', colorClass: 'bg-orange-400' },
  { letter: 'C', word: 'Cat', emoji: '🐱', colorClass: 'bg-yellow-500' },
  { letter: 'D', word: 'Dog', emoji: '🐶', colorClass: 'bg-green-400' },
  { letter: 'E', word: 'Elephant', emoji: '🐘', colorClass: 'bg-teal-400' },
  { letter: 'F', word: 'Fish', emoji: '🐟', colorClass: 'bg-blue-400' },
  { letter: 'G', word: 'Grape', emoji: '🍇', colorClass: 'bg-indigo-400' },
  { letter: 'H', word: 'Hat', emoji: '🎩', colorClass: 'bg-purple-400' },
  { letter: 'I', word: 'Ice cream', emoji: '🍦', colorClass: 'bg-pink-400' },
  { letter: 'J', word: 'Juice', emoji: '🧃', colorClass: 'bg-red-500' },
  { letter: 'K', word: 'Kite', emoji: '🪁', colorClass: 'bg-orange-500' },
  { letter: 'L', word: 'Lion', emoji: '🦁', colorClass: 'bg-amber-400' },
  { letter: 'M', word: 'Moon', emoji: '🌙', colorClass: 'bg-green-500' },
  { letter: 'N', word: 'Nose', emoji: '👃', colorClass: 'bg-teal-500' },
  { letter: 'O', word: 'Orange', emoji: '🍊', colorClass: 'bg-blue-500' },
  { letter: 'P', word: 'Pizza', emoji: '🍕', colorClass: 'bg-indigo-500' },
  { letter: 'Q', word: 'Queen', emoji: '👑', colorClass: 'bg-violet-400' },
  { letter: 'R', word: 'Rainbow', emoji: '🌈', colorClass: 'bg-pink-500' },
  { letter: 'S', word: 'Star', emoji: '⭐', colorClass: 'bg-red-400' },
  { letter: 'T', word: 'Tiger', emoji: '🐯', colorClass: 'bg-orange-400' },
  { letter: 'U', word: 'Umbrella', emoji: '☂️', colorClass: 'bg-yellow-400' },
  { letter: 'V', word: 'Violin', emoji: '🎻', colorClass: 'bg-green-400' },
  { letter: 'W', word: 'Watermelon', emoji: '🍉', colorClass: 'bg-teal-400' },
  { letter: 'X', word: 'Xylophone', emoji: '🎵', colorClass: 'bg-blue-400' },
  { letter: 'Y', word: 'Yarn', emoji: '🧶', colorClass: 'bg-purple-400' },
  { letter: 'Z', word: 'Zebra', emoji: '🦓', colorClass: 'bg-pink-400' },
]

// Pentatonic scale frequencies for pleasant chime sounds (C major pentatonic across 3 octaves)
export const LETTER_FREQUENCIES: number[] = [
  261.63, 293.66, 329.63, 392.0, 440.0,    // C4, D4, E4, G4, A4
  523.25, 587.33, 659.25, 783.99, 880.0,   // C5, D5, E5, G5, A5
  1046.5, 1174.66, 1318.51, 1567.98, 1760.0, // C6, D6, E6, G6, A6
  261.63, 293.66, 329.63, 392.0, 440.0,    // repeat C4–A4
  523.25, 587.33, 659.25, 783.99, 880.0,   // repeat C5–A5
  1046.5,                                   // C6 for Z
]

export const CONFETTI_EMOJIS = ['⭐', '🌟', '✨', '🎉', '🎊', '🎈', '🌈', '🎵', '🏆', '🍎']
