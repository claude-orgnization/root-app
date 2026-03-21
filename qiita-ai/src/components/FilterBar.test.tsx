import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { FilterBar } from './FilterBar'
import { AI_TAGS } from '../constants/tags'

const defaultProps = {
  selectedTags: [],
  sort: 'created' as const,
  source: 'all' as const,
  onTagsChange: vi.fn(),
  onSortChange: vi.fn(),
  onSourceChange: vi.fn(),
}

describe('FilterBar', () => {
  it('AI_TAGS のすべてのタグが表示される', () => {
    render(<FilterBar {...defaultProps} />)
    for (const tag of AI_TAGS) {
      expect(screen.getByRole('button', { name: tag })).toBeInTheDocument()
    }
  })

  it('ソースフィルターボタン（すべて・Qiita・Zenn）が表示される', () => {
    render(<FilterBar {...defaultProps} />)
    expect(screen.getByRole('button', { name: 'すべて' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Qiita' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Zenn' })).toBeInTheDocument()
  })

  it('ソートセレクトが表示される', () => {
    render(<FilterBar {...defaultProps} />)
    expect(screen.getByRole('combobox')).toBeInTheDocument()
    expect(screen.getByRole('option', { name: '新着順' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'いいね数順' })).toBeInTheDocument()
  })

  it('タグをクリックすると onTagsChange が呼ばれる（追加）', () => {
    const onTagsChange = vi.fn()
    render(<FilterBar {...defaultProps} onTagsChange={onTagsChange} />)
    fireEvent.click(screen.getByRole('button', { name: 'AI' }))
    expect(onTagsChange).toHaveBeenCalledWith(['AI'])
  })

  it('選択済みタグをクリックすると onTagsChange が呼ばれる（削除）', () => {
    const onTagsChange = vi.fn()
    render(<FilterBar {...defaultProps} selectedTags={['AI']} onTagsChange={onTagsChange} />)
    fireEvent.click(screen.getByRole('button', { name: 'AI' }))
    expect(onTagsChange).toHaveBeenCalledWith([])
  })

  it('複数のタグが選択されているとき、1つを削除すると残りが渡される', () => {
    const onTagsChange = vi.fn()
    render(<FilterBar {...defaultProps} selectedTags={['AI', 'LLM']} onTagsChange={onTagsChange} />)
    fireEvent.click(screen.getByRole('button', { name: 'AI' }))
    expect(onTagsChange).toHaveBeenCalledWith(['LLM'])
  })

  it('ソースボタンクリックで onSourceChange が呼ばれる', () => {
    const onSourceChange = vi.fn()
    render(<FilterBar {...defaultProps} onSourceChange={onSourceChange} />)
    fireEvent.click(screen.getByRole('button', { name: 'Qiita' }))
    expect(onSourceChange).toHaveBeenCalledWith('qiita')
  })

  it('ソート変更で onSortChange が呼ばれる', () => {
    const onSortChange = vi.fn()
    render(<FilterBar {...defaultProps} onSortChange={onSortChange} />)
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'likes' } })
    expect(onSortChange).toHaveBeenCalledWith('likes')
  })

  it('現在の sort 値がセレクトに反映される', () => {
    render(<FilterBar {...defaultProps} sort="likes" />)
    const select = screen.getByRole('combobox') as HTMLSelectElement
    expect(select.value).toBe('likes')
  })
})
