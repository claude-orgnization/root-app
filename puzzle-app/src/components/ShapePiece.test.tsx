import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ShapePiece } from './ShapePiece'

const piece = { id: 'piece-0', type: 'circle' as const, color: '#FF6B6B' }

describe('ShapePiece', () => {
  it('renders the shape', () => {
    const { container } = render(
      <ShapePiece piece={piece} isSelected={false} onSelect={() => {}} />,
    )
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('calls onSelect with piece id when clicked', () => {
    const onSelect = vi.fn()
    render(<ShapePiece piece={piece} isSelected={false} onSelect={onSelect} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onSelect).toHaveBeenCalledWith('piece-0')
  })

  it('shows selected styling when isSelected is true', () => {
    const { container } = render(
      <ShapePiece piece={piece} isSelected={true} onSelect={() => {}} />,
    )
    expect(container.firstChild).toHaveClass('ring-4')
  })

  it('does not show selected styling when isSelected is false', () => {
    const { container } = render(
      <ShapePiece piece={piece} isSelected={false} onSelect={() => {}} />,
    )
    expect(container.firstChild).not.toHaveClass('ring-4')
  })
})
