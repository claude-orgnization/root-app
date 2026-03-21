import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ShapePiece } from './ShapePiece'

const piece = { id: 'piece-0', type: 'circle' as const, color: '#FF6B6B' }

describe('ShapePiece', () => {
  it('renders the shape', () => {
    const { container } = render(
      <ShapePiece piece={piece} isDragging={false} onDragStart={() => {}} />,
    )
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('calls onDragStart with piece id and coordinates on mousedown', () => {
    const onDragStart = vi.fn()
    render(<ShapePiece piece={piece} isDragging={false} onDragStart={onDragStart} />)
    fireEvent.mouseDown(screen.getByRole('button'), { clientX: 100, clientY: 200 })
    expect(onDragStart).toHaveBeenCalledWith('piece-0', 100, 200)
  })

  it('shows dragging styling when isDragging is true', () => {
    const { container } = render(
      <ShapePiece piece={piece} isDragging={true} onDragStart={() => {}} />,
    )
    expect(container.firstChild).toHaveClass('opacity-40')
  })

  it('does not show dragging styling when isDragging is false', () => {
    const { container } = render(
      <ShapePiece piece={piece} isDragging={false} onDragStart={() => {}} />,
    )
    expect(container.firstChild).not.toHaveClass('opacity-40')
  })
})
