/**
 * インテグレーションテスト: FilterSidebar + ArticleList の連携
 *
 * ユーザーがフィルターを操作したとき、ArticleList に正しいデータが渡されるかを検証する。
 * useArticles フックをモックし、フィルター変更によるコールバックが適切に呼ばれることを確認する。
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useState } from 'react'
import { FilterSidebar } from '../../components/FilterSidebar'
import { ArticleList } from '../../components/ArticleList'
import type { Article, SourceFilter } from '../../types/article'
import type { SortOrder, DateRange } from '../../types/qiita'
import * as qiitaApi from '../../utils/qiitaApi'
import * as zennApi from '../../utils/zennApi'
import { useArticles } from '../../hooks/useArticles'

// FilterSidebar + ArticleList を組み合わせたコンポーネント（HomePage の簡易版）
function TestPage() {
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sort, setSort] = useState<SortOrder>('created')
  const [dateRange, setDateRange] = useState<DateRange>('all')
  const [source, setSource] = useState<SourceFilter>('all')

  const { articles, loading } = useArticles({
    tags: selectedTags,
    sort,
    page: 1,
    source,
    dateRange,
  })

  return (
    <div>
      <FilterSidebar
        selectedTags={selectedTags}
        sort={sort}
        dateRange={dateRange}
        source={source}
        onTagsChange={setSelectedTags}
        onSortChange={setSort}
        onDateRangeChange={setDateRange}
        onSourceChange={setSource}
      />
      <ArticleList articles={articles} loading={loading} />
    </div>
  )
}

const mockQiitaArticle: Article = {
  id: 'qiita-1',
  title: 'Qiita AI 記事',
  url: 'https://qiita.com/test/items/1',
  created_at: '2024-01-15T12:00:00Z',
  likes_count: 20,
  tags: ['AI'],
  source: 'qiita',
  author: { name: 'testuser', avatar_url: 'https://example.com/avatar.png' },
}

const mockZennArticle: Article = {
  id: 'zenn-1',
  title: 'Zenn LLM 記事',
  url: 'https://zenn.dev/zennuser/articles/1',
  created_at: '2024-02-10T12:00:00Z',
  likes_count: 15,
  tags: ['LLM'],
  source: 'zenn',
  author: { name: 'zennuser', avatar_url: 'https://example.com/zenn-avatar.png' },
}

describe('FilterSidebar + ArticleList インテグレーション', () => {
  beforeEach(() => {
    vi.spyOn(qiitaApi, 'fetchQiitaArticles')
    vi.spyOn(zennApi, 'fetchZennArticles')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('初期状態で記事が表示される（source=all）', async () => {
    vi.mocked(qiitaApi.fetchQiitaArticles).mockResolvedValue({
      articles: [mockQiitaArticle],
      totalCount: 1,
    })
    vi.mocked(zennApi.fetchZennArticles).mockResolvedValue({
      articles: [mockZennArticle],
      totalCount: 1,
    })

    render(<TestPage />)

    await waitFor(() => {
      expect(screen.getByText('Qiita AI 記事')).toBeInTheDocument()
      expect(screen.getByText('Zenn LLM 記事')).toBeInTheDocument()
    })
  })

  it('ソースを Qiita に変更すると fetchQiitaArticles のみ呼ばれる', async () => {
    vi.mocked(qiitaApi.fetchQiitaArticles).mockResolvedValue({
      articles: [mockQiitaArticle],
      totalCount: 1,
    })
    vi.mocked(zennApi.fetchZennArticles).mockResolvedValue({
      articles: [],
      totalCount: 0,
    })

    render(<TestPage />)

    await waitFor(() => expect(screen.queryByText('記事が見つかりませんでした')).not.toBeInTheDocument())

    vi.mocked(qiitaApi.fetchQiitaArticles).mockClear()
    vi.mocked(zennApi.fetchZennArticles).mockClear()
    vi.mocked(qiitaApi.fetchQiitaArticles).mockResolvedValue({
      articles: [mockQiitaArticle],
      totalCount: 1,
    })

    fireEvent.click(screen.getByLabelText('Qiita'))

    await waitFor(() => {
      expect(qiitaApi.fetchQiitaArticles).toHaveBeenCalled()
      expect(zennApi.fetchZennArticles).not.toHaveBeenCalled()
    })
  })

  it('タグを選択すると API が再フェッチされる', async () => {
    vi.mocked(qiitaApi.fetchQiitaArticles).mockResolvedValue({
      articles: [mockQiitaArticle],
      totalCount: 1,
    })
    vi.mocked(zennApi.fetchZennArticles).mockResolvedValue({
      articles: [],
      totalCount: 0,
    })

    render(<TestPage />)

    await waitFor(() => expect(screen.getByText('Qiita AI 記事')).toBeInTheDocument())

    const initialCallCount = vi.mocked(qiitaApi.fetchQiitaArticles).mock.calls.length

    fireEvent.click(screen.getByLabelText('AI'))

    await waitFor(() => {
      expect(vi.mocked(qiitaApi.fetchQiitaArticles).mock.calls.length).toBeGreaterThan(initialCallCount)
    })
  })

  it('フィルターをリセットするとデフォルト状態に戻る', async () => {
    vi.mocked(qiitaApi.fetchQiitaArticles).mockResolvedValue({
      articles: [],
      totalCount: 0,
    })
    vi.mocked(zennApi.fetchZennArticles).mockResolvedValue({
      articles: [],
      totalCount: 0,
    })

    render(<TestPage />)

    // タグを選択してリセットボタンを表示させる
    fireEvent.click(screen.getByLabelText('AI'))

    await waitFor(() => {
      expect(screen.getByText('フィルターをリセット')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('フィルターをリセット'))

    await waitFor(() => {
      expect(screen.queryByText('フィルターをリセット')).not.toBeInTheDocument()
    })
  })
})
