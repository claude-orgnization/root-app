import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GameHeader } from './GameHeader'

const defaultProps = {
  level: 1,
  score: 0,
  mode: 'easy' as const,
  onModeChange: vi.fn(),
}

describe('GameHeader', () => {
  it('displays the level number', () => {
    render(<GameHeader {...defaultProps} level={3} score={20} />)
    expect(screen.getByText(/3/)).toBeInTheDocument()
  })

  it('displays the score', () => {
    render(<GameHeader {...defaultProps} level={1} score={50} />)
    expect(screen.getByText(/50/)).toBeInTheDocument()
  })

  it('shows レベル label in easy mode', () => {
    render(<GameHeader {...defaultProps} />)
    expect(screen.getByText(/レベル/i)).toBeInTheDocument()
  })

  it('shows パズル label in hard mode', () => {
    render(<GameHeader {...defaultProps} mode="hard" />)
    expect(screen.getByText(/パズル/i)).toBeInTheDocument()
  })

  it('shows スコア label', () => {
    render(<GameHeader {...defaultProps} />)
    expect(screen.getByText(/スコア/i)).toBeInTheDocument()
  })

  it('shows mode toggle button', () => {
    render(<GameHeader {...defaultProps} />)
    expect(screen.getByRole('button', { name: /モードをかえる/i })).toBeInTheDocument()
  })
})
