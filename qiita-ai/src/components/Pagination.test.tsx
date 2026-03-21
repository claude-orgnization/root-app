import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Pagination } from './Pagination'

describe('Pagination', () => {
  it('totalCount が PER_PAGE(20) 以下のとき何も表示しない', () => {
    const { container } = render(
      <Pagination page={1} totalCount={15} onPageChange={vi.fn()} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('totalCount=20 のとき（1ページのみ）何も表示しない', () => {
    const { container } = render(
      <Pagination page={1} totalCount={20} onPageChange={vi.fn()} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('totalCount=21 のとき（2ページ）ページネーションが表示される', () => {
    render(<Pagination page={1} totalCount={21} onPageChange={vi.fn()} />)
    expect(screen.getByText('1 / 2')).toBeInTheDocument()
  })

  it('現在ページ・総ページ数が表示される', () => {
    render(<Pagination page={2} totalCount={100} onPageChange={vi.fn()} />)
    expect(screen.getByText('2 / 5')).toBeInTheDocument()
  })

  it('最初のページでは「前へ」ボタンが無効になる', () => {
    render(<Pagination page={1} totalCount={100} onPageChange={vi.fn()} />)
    const prevButton = screen.getByText('← 前へ')
    expect(prevButton).toBeDisabled()
  })

  it('最後のページでは「次へ」ボタンが無効になる', () => {
    render(<Pagination page={5} totalCount={100} onPageChange={vi.fn()} />)
    const nextButton = screen.getByText('次へ →')
    expect(nextButton).toBeDisabled()
  })

  it('中間ページでは両方のボタンが有効', () => {
    render(<Pagination page={3} totalCount={100} onPageChange={vi.fn()} />)
    expect(screen.getByText('← 前へ')).not.toBeDisabled()
    expect(screen.getByText('次へ →')).not.toBeDisabled()
  })

  it('「前へ」ボタンクリックで page-1 が渡される', () => {
    const onPageChange = vi.fn()
    render(<Pagination page={3} totalCount={100} onPageChange={onPageChange} />)
    fireEvent.click(screen.getByText('← 前へ'))
    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  it('「次へ」ボタンクリックで page+1 が渡される', () => {
    const onPageChange = vi.fn()
    render(<Pagination page={3} totalCount={100} onPageChange={onPageChange} />)
    fireEvent.click(screen.getByText('次へ →'))
    expect(onPageChange).toHaveBeenCalledWith(4)
  })
})
