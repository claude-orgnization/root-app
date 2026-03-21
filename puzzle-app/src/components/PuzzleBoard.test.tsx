import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PuzzleBoard } from './PuzzleBoard'
import type { Level } from '../types/game'

const level: Level = {
  number: 1,
  slots: [
    { id: 'slot-0', targetType: 'circle', filledBy: null },
    { id: 'slot-1', targetType: 'triangle', filledBy: null },
  ],
  pieces: [
    { id: 'piece-0', type: 'triangle', color: '#4ECDC4' },
    { id: 'piece-1', type: 'circle', color: '#FF6B6B' },
  ],
}

describe('PuzzleBoard', () => {
  const defaultProps = {
    level,
    wrongSlotId: null,
    availablePieceIds: ['piece-0', 'piece-1'],
    placePieceById: vi.fn(),
  }

  it('renders all slots', () => {
    render(<PuzzleBoard {...defaultProps} />)
    expect(screen.getAllByLabelText(/スロット/)).toHaveLength(2)
  })

  it('renders all available pieces', () => {
    render(<PuzzleBoard {...defaultProps} />)
    expect(screen.getByRole('button', { name: 'まる' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'さんかく' })).toBeInTheDocument()
  })

  it('does not render placed pieces in the piece tray', () => {
    render(<PuzzleBoard {...defaultProps} availablePieceIds={['piece-0']} />)
    expect(screen.getByRole('button', { name: 'さんかく' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'まる' })).not.toBeInTheDocument()
  })

  it('shows instruction text', () => {
    render(<PuzzleBoard {...defaultProps} />)
    expect(screen.getByText(/ドラッグ/)).toBeInTheDocument()
  })
})
