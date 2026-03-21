import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
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
    selectedPieceId: null,
    wrongSlotId: null,
    availablePieceIds: ['piece-0', 'piece-1'],
    selectPiece: vi.fn(),
    placePiece: vi.fn(),
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

  it('calls selectPiece when a piece is clicked', () => {
    const selectPiece = vi.fn()
    render(<PuzzleBoard {...defaultProps} selectPiece={selectPiece} />)
    fireEvent.click(screen.getByRole('button', { name: 'まる' }))
    expect(selectPiece).toHaveBeenCalledWith('piece-1')
  })

  it('calls placePiece when a slot is clicked', () => {
    const placePiece = vi.fn()
    render(<PuzzleBoard {...defaultProps} placePiece={placePiece} />)
    fireEvent.click(screen.getAllByLabelText(/スロット/)[0])
    expect(placePiece).toHaveBeenCalledWith('slot-0')
  })

  it('does not render placed pieces in the piece tray', () => {
    render(<PuzzleBoard {...defaultProps} availablePieceIds={['piece-0']} />)
    expect(screen.getByRole('button', { name: 'さんかく' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'まる' })).not.toBeInTheDocument()
  })

  it('shows instruction text', () => {
    render(<PuzzleBoard {...defaultProps} />)
    expect(screen.getByText(/えらんで|タップ|クリック/i)).toBeInTheDocument()
  })
})
