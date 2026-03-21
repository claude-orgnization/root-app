import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { ShapeSlot } from './ShapeSlot'

describe('ShapeSlot', () => {
  const baseSlot = { id: 'slot-0', targetType: 'circle' as const, filledBy: null }

  it('shows silhouette when not filled', () => {
    const { container } = render(
      <ShapeSlot slot={baseSlot} filledPiece={null} isWrong={false} isDragOver={false} />,
    )
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('renders the target shape type silhouette', () => {
    const { container } = render(
      <ShapeSlot slot={baseSlot} filledPiece={null} isWrong={false} isDragOver={false} />,
    )
    expect(container.querySelector('circle')).toBeInTheDocument()
  })

  it('shows filled piece color when filled', () => {
    const filledPiece = { id: 'piece-0', type: 'circle' as const, color: '#FF6B6B' }
    const filledSlot = { ...baseSlot, filledBy: 'piece-0' }
    const { container } = render(
      <ShapeSlot slot={filledSlot} filledPiece={filledPiece} isWrong={false} isDragOver={false} />,
    )
    const circle = container.querySelector('circle')
    expect(circle).toHaveAttribute('fill', '#FF6B6B')
  })

  it('applies shake class when isWrong is true', () => {
    const { container } = render(
      <ShapeSlot slot={baseSlot} filledPiece={null} isWrong={true} isDragOver={false} />,
    )
    expect(container.firstChild).toHaveClass('animate-bounce')
  })

  it('does not apply shake class when isWrong is false', () => {
    const { container } = render(
      <ShapeSlot slot={baseSlot} filledPiece={null} isWrong={false} isDragOver={false} />,
    )
    expect(container.firstChild).not.toHaveClass('animate-bounce')
  })

  it('applies drag-over styling when isDragOver is true', () => {
    const { container } = render(
      <ShapeSlot slot={baseSlot} filledPiece={null} isWrong={false} isDragOver={true} />,
    )
    expect(container.querySelector('[aria-label]')).toHaveClass('border-purple-400')
  })
})
