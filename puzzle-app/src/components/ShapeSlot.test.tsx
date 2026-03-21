import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ShapeSlot } from './ShapeSlot'

describe('ShapeSlot', () => {
  const baseSlot = { id: 'slot-0', targetType: 'circle' as const, filledBy: null }

  it('shows silhouette when not filled', () => {
    const { container } = render(
      <ShapeSlot slot={baseSlot} filledPiece={null} isWrong={false} onPlace={() => {}} />,
    )
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('renders the target shape type silhouette', () => {
    const { container } = render(
      <ShapeSlot slot={baseSlot} filledPiece={null} isWrong={false} onPlace={() => {}} />,
    )
    expect(container.querySelector('circle')).toBeInTheDocument()
  })

  it('calls onPlace when clicked', () => {
    const onPlace = vi.fn()
    render(
      <ShapeSlot slot={baseSlot} filledPiece={null} isWrong={false} onPlace={onPlace} />,
    )
    fireEvent.click(screen.getByRole('button'))
    expect(onPlace).toHaveBeenCalledWith('slot-0')
  })

  it('shows filled piece color when filled', () => {
    const filledPiece = { id: 'piece-0', type: 'circle' as const, color: '#FF6B6B' }
    const filledSlot = { ...baseSlot, filledBy: 'piece-0' }
    const { container } = render(
      <ShapeSlot slot={filledSlot} filledPiece={filledPiece} isWrong={false} onPlace={() => {}} />,
    )
    const circle = container.querySelector('circle')
    expect(circle).toHaveAttribute('fill', '#FF6B6B')
  })

  it('applies shake class when isWrong is true', () => {
    const { container } = render(
      <ShapeSlot slot={baseSlot} filledPiece={null} isWrong={true} onPlace={() => {}} />,
    )
    expect(container.firstChild).toHaveClass('animate-bounce')
  })

  it('does not apply shake class when isWrong is false', () => {
    const { container } = render(
      <ShapeSlot slot={baseSlot} filledPiece={null} isWrong={false} onPlace={() => {}} />,
    )
    expect(container.firstChild).not.toHaveClass('animate-bounce')
  })
})
