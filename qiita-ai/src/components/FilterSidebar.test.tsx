import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { FilterSidebar } from './FilterSidebar'
import { AI_TAGS } from '../constants/tags'

const defaultProps = {
  selectedTags: [],
  sort: 'created' as const,
  dateRange: 'all' as const,
  source: 'all' as const,
  onTagsChange: vi.fn(),
  onSortChange: vi.fn(),
  onDateRangeChange: vi.fn(),
  onSourceChange: vi.fn(),
}

describe('FilterSidebar', () => {
  it('"フィルター" ヘッダーが表示される', () => {
    render(<FilterSidebar {...defaultProps} />)
    expect(screen.getByText('フィルター')).toBeInTheDocument()
  })

  it('AI_TAGS のすべてのタグチェックボックスが表示される', () => {
    render(<FilterSidebar {...defaultProps} />)
    for (const tag of AI_TAGS) {
      expect(screen.getByLabelText(tag)).toBeInTheDocument()
    }
  })

  it('ソースラジオボタン（すべて・Qiita・Zenn）が表示される', () => {
    render(<FilterSidebar {...defaultProps} />)
    expect(screen.getByLabelText('すべて')).toBeInTheDocument()
    expect(screen.getByLabelText('Qiita')).toBeInTheDocument()
    expect(screen.getByLabelText('Zenn')).toBeInTheDocument()
  })

  it('期間フィルターオプションが表示される', () => {
    render(<FilterSidebar {...defaultProps} />)
    expect(screen.getByLabelText('全期間')).toBeInTheDocument()
    expect(screen.getByLabelText('今週')).toBeInTheDocument()
    expect(screen.getByLabelText('今月')).toBeInTheDocument()
    expect(screen.getByLabelText('3ヶ月以内')).toBeInTheDocument()
  })

  it('ソートセレクトが表示される', () => {
    render(<FilterSidebar {...defaultProps} />)
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('タグチェックボックスをクリックすると onTagsChange が呼ばれる（追加）', () => {
    const onTagsChange = vi.fn()
    render(<FilterSidebar {...defaultProps} onTagsChange={onTagsChange} />)
    fireEvent.click(screen.getByLabelText('AI'))
    expect(onTagsChange).toHaveBeenCalledWith(['AI'])
  })

  it('選択済みタグを再度クリックすると onTagsChange が呼ばれる（削除）', () => {
    const onTagsChange = vi.fn()
    render(<FilterSidebar {...defaultProps} selectedTags={['AI']} onTagsChange={onTagsChange} />)
    fireEvent.click(screen.getByLabelText('AI'))
    expect(onTagsChange).toHaveBeenCalledWith([])
  })

  it('ソースラジオボタン変更で onSourceChange が呼ばれる', () => {
    const onSourceChange = vi.fn()
    render(<FilterSidebar {...defaultProps} onSourceChange={onSourceChange} />)
    fireEvent.click(screen.getByLabelText('Qiita'))
    expect(onSourceChange).toHaveBeenCalledWith('qiita')
  })

  it('期間ラジオボタン変更で onDateRangeChange が呼ばれる', () => {
    const onDateRangeChange = vi.fn()
    render(<FilterSidebar {...defaultProps} onDateRangeChange={onDateRangeChange} />)
    fireEvent.click(screen.getByLabelText('今週'))
    expect(onDateRangeChange).toHaveBeenCalledWith('week')
  })

  it('ソート変更で onSortChange が呼ばれる', () => {
    const onSortChange = vi.fn()
    render(<FilterSidebar {...defaultProps} onSortChange={onSortChange} />)
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'likes' } })
    expect(onSortChange).toHaveBeenCalledWith('likes')
  })

  it('デフォルト状態（全フィルターがデフォルト）ではリセットボタンが表示されない', () => {
    render(<FilterSidebar {...defaultProps} />)
    expect(screen.queryByText('フィルターをリセット')).not.toBeInTheDocument()
  })

  it('タグが選択されているときリセットボタンが表示される', () => {
    render(<FilterSidebar {...defaultProps} selectedTags={['AI']} />)
    expect(screen.getByText('フィルターをリセット')).toBeInTheDocument()
  })

  it('dateRange が all 以外のときリセットボタンが表示される', () => {
    render(<FilterSidebar {...defaultProps} dateRange="week" />)
    expect(screen.getByText('フィルターをリセット')).toBeInTheDocument()
  })

  it('リセットボタンクリックで全フィルターがリセットされる', () => {
    const onTagsChange = vi.fn()
    const onDateRangeChange = vi.fn()
    const onSortChange = vi.fn()
    const onSourceChange = vi.fn()
    render(
      <FilterSidebar
        {...defaultProps}
        selectedTags={['AI']}
        dateRange="week"
        sort="likes"
        source="qiita"
        onTagsChange={onTagsChange}
        onDateRangeChange={onDateRangeChange}
        onSortChange={onSortChange}
        onSourceChange={onSourceChange}
      />
    )
    fireEvent.click(screen.getByText('フィルターをリセット'))
    expect(onTagsChange).toHaveBeenCalledWith([])
    expect(onDateRangeChange).toHaveBeenCalledWith('all')
    expect(onSortChange).toHaveBeenCalledWith('created')
    expect(onSourceChange).toHaveBeenCalledWith('all')
  })
})
