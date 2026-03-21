import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { LevelComplete } from './LevelComplete'

describe('LevelComplete', () => {
  it('shows congratulations message', () => {
    render(<LevelComplete score={10} level={1} onNextLevel={() => {}} onRestart={() => {}} />)
    expect(screen.getByText(/クリア|すごい|やったね/i)).toBeInTheDocument()
  })

  it('displays the score', () => {
    render(<LevelComplete score={30} level={3} onNextLevel={() => {}} onRestart={() => {}} />)
    expect(screen.getByText(/30/)).toBeInTheDocument()
  })

  it('calls onNextLevel when next level button is clicked', () => {
    const onNextLevel = vi.fn()
    render(<LevelComplete score={10} level={1} onNextLevel={onNextLevel} onRestart={() => {}} />)
    fireEvent.click(screen.getByRole('button', { name: /つぎ|next/i }))
    expect(onNextLevel).toHaveBeenCalledOnce()
  })

  it('calls onRestart when restart button is clicked', () => {
    const onRestart = vi.fn()
    render(<LevelComplete score={10} level={1} onNextLevel={() => {}} onRestart={onRestart} />)
    fireEvent.click(screen.getByRole('button', { name: /もういちど|restart/i }))
    expect(onRestart).toHaveBeenCalledOnce()
  })
})
