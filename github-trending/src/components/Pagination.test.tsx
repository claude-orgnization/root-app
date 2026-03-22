import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Pagination } from './Pagination'

describe('Pagination', () => {
  it('前へ・次へボタンを表示する', () => {
    render(<Pagination page={2} totalCount={100} onPageChange={vi.fn()} />)
    expect(screen.getByText('前へ')).toBeInTheDocument()
    expect(screen.getByText('次へ')).toBeInTheDocument()
  })

  it('ページ1のとき前へボタンがdisabledになる', () => {
    render(<Pagination page={1} totalCount={100} onPageChange={vi.fn()} />)
    expect(screen.getByText('前へ')).toBeDisabled()
  })

  it('最終ページのとき次へボタンがdisabledになる', () => {
    render(<Pagination page={5} totalCount={100} onPageChange={vi.fn()} />)
    expect(screen.getByText('次へ')).toBeDisabled()
  })

  it('前へボタンクリックでpage-1が渡される', async () => {
    const onPageChange = vi.fn()
    render(<Pagination page={3} totalCount={100} onPageChange={onPageChange} />)
    await userEvent.click(screen.getByText('前へ'))
    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  it('次へボタンクリックでpage+1が渡される', async () => {
    const onPageChange = vi.fn()
    render(<Pagination page={3} totalCount={100} onPageChange={onPageChange} />)
    await userEvent.click(screen.getByText('次へ'))
    expect(onPageChange).toHaveBeenCalledWith(4)
  })
})
