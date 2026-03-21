import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GameHeader } from './GameHeader'

describe('GameHeader', () => {
  it('displays the level number', () => {
    render(<GameHeader level={3} score={20} />)
    expect(screen.getByText(/3/)).toBeInTheDocument()
  })

  it('displays the score', () => {
    render(<GameHeader level={1} score={50} />)
    expect(screen.getByText(/50/)).toBeInTheDocument()
  })

  it('shows レベル label', () => {
    render(<GameHeader level={1} score={0} />)
    expect(screen.getByText(/レベル/i)).toBeInTheDocument()
  })

  it('shows スコア label', () => {
    render(<GameHeader level={1} score={0} />)
    expect(screen.getByText(/スコア/i)).toBeInTheDocument()
  })
})
