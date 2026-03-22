import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FilterBar } from './FilterBar'

describe('FilterBar', () => {
  const defaultProps = {
    dateRange: 'week' as const,
    language: 'All',
    onDateRangeChange: vi.fn(),
    onLanguageChange: vi.fn(),
  }

  it('期間フィルターのボタンを表示する', () => {
    render(<FilterBar {...defaultProps} />)
    expect(screen.getByText('今日')).toBeInTheDocument()
    expect(screen.getByText('今週')).toBeInTheDocument()
    expect(screen.getByText('今月')).toBeInTheDocument()
  })

  it('言語フィルターのセレクトを表示する', () => {
    render(<FilterBar {...defaultProps} />)
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('期間ボタンクリックでコールバックが呼ばれる', async () => {
    const onDateRangeChange = vi.fn()
    render(<FilterBar {...defaultProps} onDateRangeChange={onDateRangeChange} />)
    await userEvent.click(screen.getByText('今日'))
    expect(onDateRangeChange).toHaveBeenCalledWith('today')
  })

  it('言語変更でコールバックが呼ばれる', async () => {
    const onLanguageChange = vi.fn()
    render(<FilterBar {...defaultProps} onLanguageChange={onLanguageChange} />)
    await userEvent.selectOptions(screen.getByRole('combobox'), 'TypeScript')
    expect(onLanguageChange).toHaveBeenCalledWith('TypeScript')
  })
})
