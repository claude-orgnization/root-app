import { useCallback } from 'react'
import { LETTER_FREQUENCIES } from '../constants/alphabetData'

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

function playChime(frequency: number, duration = 0.6): void {
  try {
    const ctx = new AudioContext()
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime)
    gainNode.gain.setValueAtTime(0.35, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + duration)
  } catch {
    // AudioContext not supported
  }
}

function speakText(text: string): void {
  if (!window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'en-US'
  utterance.rate = 0.75
  utterance.pitch = 1.1
  window.speechSynthesis.speak(utterance)
}

export function useSound() {
  const playLetter = useCallback((letter: string, word: string) => {
    const index = LETTERS.indexOf(letter)
    if (index >= 0 && index < LETTER_FREQUENCIES.length) {
      playChime(LETTER_FREQUENCIES[index] as number)
    }
    setTimeout(() => {
      speakText(`${letter}. ${word}`)
    }, 250)
  }, [])

  const playVictory = useCallback(() => {
    // Ascending fanfare using pentatonic scale
    const notes = [261.63, 329.63, 392.0, 523.25, 659.25, 783.99, 1046.5]
    notes.forEach((freq, i) => {
      setTimeout(() => playChime(freq, 0.5), i * 140)
    })
    setTimeout(() => {
      speakText('You did it! Amazing!')
    }, 1200)
  }, [])

  return { playLetter, playVictory }
}
