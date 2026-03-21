import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useArticles } from './useArticles'
import * as qiitaApi from '../utils/qiitaApi'
import * as zennApi from '../utils/zennApi'
import type { Article } from '../types/article'

const mockArticle: Article = {
  id: 'qiita-1',
  title: 'テスト記事',
  url: 'https://qiita.com/test',
  created_at: '2024-01-15T10:00:00Z',
  likes_count: 10,
  tags: ['AI'],
  source: 'qiita',
  author: { name: 'testuser', avatar_url: 'https://example.com/avatar.png' },
}

const mockZennArticle: Article = {
  ...mockArticle,
  id: 'zenn-1',
  source: 'zenn',
}

describe('useArticles', () => {
  beforeEach(() => {
    vi.spyOn(qiitaApi, 'fetchQiitaArticles')
    vi.spyOn(zennApi, 'fetchZennArticles')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('初期状態は loading=true', () => {
    vi.mocked(qiitaApi.fetchQiitaArticles).mockResolvedValue({
      articles: [],
      totalCount: 0,
    })

    const { result } = renderHook(() =>
      useArticles({ tags: [], sort: 'created', page: 1, source: 'qiita', dateRange: 'all' })
    )

    expect(result.current.loading).toBe(true)
    expect(result.current.articles).toHaveLength(0)
    expect(result.current.error).toBeNull()
  })

  it('source=qiita の場合、Qiita API のみ呼び出す', async () => {
    vi.mocked(qiitaApi.fetchQiitaArticles).mockResolvedValue({
      articles: [mockArticle],
      totalCount: 1,
    })

    const { result } = renderHook(() =>
      useArticles({ tags: [], sort: 'created', page: 1, source: 'qiita', dateRange: 'all' })
    )

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(qiitaApi.fetchQiitaArticles).toHaveBeenCalledTimes(1)
    expect(zennApi.fetchZennArticles).not.toHaveBeenCalled()
    expect(result.current.articles).toHaveLength(1)
    expect(result.current.totalCount).toBe(1)
  })

  it('source=zenn の場合、Zenn API のみ呼び出す', async () => {
    vi.mocked(zennApi.fetchZennArticles).mockResolvedValue({
      articles: [mockZennArticle],
      totalCount: 1,
    })

    const { result } = renderHook(() =>
      useArticles({ tags: [], sort: 'created', page: 1, source: 'zenn', dateRange: 'all' })
    )

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(zennApi.fetchZennArticles).toHaveBeenCalledTimes(1)
    expect(qiitaApi.fetchQiitaArticles).not.toHaveBeenCalled()
    expect(result.current.articles).toHaveLength(1)
  })

  it('source=all の場合、両方の API を呼び出してマージする', async () => {
    vi.mocked(qiitaApi.fetchQiitaArticles).mockResolvedValue({
      articles: [mockArticle],
      totalCount: 10,
    })
    vi.mocked(zennApi.fetchZennArticles).mockResolvedValue({
      articles: [mockZennArticle],
      totalCount: 5,
    })

    const { result } = renderHook(() =>
      useArticles({ tags: [], sort: 'created', page: 1, source: 'all', dateRange: 'all' })
    )

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(qiitaApi.fetchQiitaArticles).toHaveBeenCalledTimes(1)
    expect(zennApi.fetchZennArticles).toHaveBeenCalledTimes(1)
    expect(result.current.articles).toHaveLength(2)
  })

  it('source=all で sort=likes の場合、likes_count の降順にソートされる', async () => {
    const highLikesArticle = { ...mockArticle, id: 'qiita-high', likes_count: 100 }
    const lowLikesArticle = { ...mockZennArticle, id: 'zenn-low', likes_count: 5 }

    vi.mocked(qiitaApi.fetchQiitaArticles).mockResolvedValue({
      articles: [highLikesArticle],
      totalCount: 1,
    })
    vi.mocked(zennApi.fetchZennArticles).mockResolvedValue({
      articles: [lowLikesArticle],
      totalCount: 1,
    })

    const { result } = renderHook(() =>
      useArticles({ tags: [], sort: 'likes', page: 1, source: 'all', dateRange: 'all' })
    )

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.articles[0].likes_count).toBe(100)
    expect(result.current.articles[1].likes_count).toBe(5)
  })

  it('API エラー時に error が設定される', async () => {
    vi.mocked(qiitaApi.fetchQiitaArticles).mockRejectedValue(new Error('ネットワークエラー'))

    const { result } = renderHook(() =>
      useArticles({ tags: [], sort: 'created', page: 1, source: 'qiita', dateRange: 'all' })
    )

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.error).toBe('ネットワークエラー')
    expect(result.current.articles).toHaveLength(0)
  })

  it('source=all で両方失敗した場合にエラーが設定される', async () => {
    vi.mocked(qiitaApi.fetchQiitaArticles).mockRejectedValue(new Error('Qiita失敗'))
    vi.mocked(zennApi.fetchZennArticles).mockRejectedValue(new Error('Zenn失敗'))

    const { result } = renderHook(() =>
      useArticles({ tags: [], sort: 'created', page: 1, source: 'all', dateRange: 'all' })
    )

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.error).not.toBeNull()
  })

  it('retryCount が変わると再フェッチされる', async () => {
    vi.mocked(qiitaApi.fetchQiitaArticles).mockResolvedValue({
      articles: [],
      totalCount: 0,
    })

    const { result, rerender } = renderHook(
      ({ retryCount }) =>
        useArticles({ tags: [], sort: 'created', page: 1, source: 'qiita', dateRange: 'all', retryCount }),
      { initialProps: { retryCount: 0 } }
    )

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(qiitaApi.fetchQiitaArticles).toHaveBeenCalledTimes(1)

    rerender({ retryCount: 1 })

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(qiitaApi.fetchQiitaArticles).toHaveBeenCalledTimes(2)
  })
})
