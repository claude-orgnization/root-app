import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ErrorMessage } from './ErrorMessage'

describe('ErrorMessage', () => {
  it('エラーメッセージが表示される', () => {
    render(<ErrorMessage message="APIエラーが発生しました" onRetry={vi.fn()} />)
    expect(screen.getByText('APIエラーが発生しました')).toBeInTheDocument()
  })

  it('「再試行」ボタンが表示される', () => {
    render(<ErrorMessage message="エラー" onRetry={vi.fn()} />)
    expect(screen.getByRole('button', { name: '再試行' })).toBeInTheDocument()
  })

  it('「再試行」ボタンクリックで onRetry が呼ばれる', () => {
    const onRetry = vi.fn()
    render(<ErrorMessage message="エラー" onRetry={onRetry} />)
    fireEvent.click(screen.getByRole('button', { name: '再試行' }))
    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it('異なるメッセージを正しく表示する', () => {
    render(<ErrorMessage message="ネットワーク接続エラー" onRetry={vi.fn()} />)
    expect(screen.getByText('ネットワーク接続エラー')).toBeInTheDocument()
  })
})
