import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { fetchQiitaArticles } from './qiitaApi'
import type { QiitaArticle } from '../types/qiita'

const mockArticle: QiitaArticle = {
  id: 'abc123',
  title: 'テスト記事',
  url: 'https://qiita.com/testuser/items/abc123',
  created_at: '2024-01-15T10:00:00+09:00',
  likes_count: 42,
  tags: [
    { name: 'AI', versions: [] },
    { name: 'LLM', versions: [] },
  ],
  user: {
    id: 'testuser',
    name: 'テストユーザー',
    profile_image_url: 'https://example.com/avatar.png',
  },
}

function createMockResponse(data: unknown, totalCount = 0, ok = true) {
  return {
    ok,
    status: ok ? 200 : 403,
    json: vi.fn().mockResolvedValue(data),
    headers: { get: vi.fn().mockReturnValue(String(totalCount)) },
  } as unknown as Response
}

describe('fetchQiitaArticles', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('記事一覧を正しく取得し Article 型に変換する', async () => {
    vi.mocked(fetch).mockResolvedValue(createMockResponse([mockArticle], 100))

    const result = await fetchQiitaArticles({ tags: [], sort: 'created', page: 1 })

    expect(result.totalCount).toBe(100)
    expect(result.articles).toHaveLength(1)
    expect(result.articles[0]).toEqual({
      id: 'qiita-abc123',
      title: 'テスト記事',
      url: 'https://qiita.com/testuser/items/abc123',
      created_at: '2024-01-15T10:00:00+09:00',
      likes_count: 42,
      tags: ['AI', 'LLM'],
      source: 'qiita',
      author: {
        name: 'testuser',
        avatar_url: 'https://example.com/avatar.png',
      },
    })
  })

  it('API エラー時に例外をスローする', async () => {
    vi.mocked(fetch).mockResolvedValue(createMockResponse(null, 0, false))

    await expect(
      fetchQiitaArticles({ tags: [], sort: 'created', page: 1 })
    ).rejects.toThrow('Qiita API error: 403')
  })

  it('タグが指定された場合、クエリに tag: が含まれる', async () => {
    vi.mocked(fetch).mockResolvedValue(createMockResponse([], 0))

    await fetchQiitaArticles({ tags: ['AI', 'LLM'], sort: 'created', page: 1 })

    const callUrl = vi.mocked(fetch).mock.calls[0][0] as string
    const url = new URL(callUrl)
    const query = url.searchParams.get('query') ?? ''
    expect(query).toContain('tag:AI')
    expect(query).toContain('tag:LLM')
  })

  it('タグが空の場合、DEFAULT_QUERY が使用される', async () => {
    vi.mocked(fetch).mockResolvedValue(createMockResponse([], 0))

    await fetchQiitaArticles({ tags: [], sort: 'created', page: 1 })

    const callUrl = vi.mocked(fetch).mock.calls[0][0] as string
    const url = new URL(callUrl)
    const query = url.searchParams.get('query') ?? ''
    expect(query).toContain('tag:AI')
    expect(query).toContain('tag:ChatGPT')
  })

  it('sort=likes の場合、クエリに sort:likes が含まれる', async () => {
    vi.mocked(fetch).mockResolvedValue(createMockResponse([], 0))

    await fetchQiitaArticles({ tags: [], sort: 'likes', page: 1 })

    const callUrl = vi.mocked(fetch).mock.calls[0][0] as string
    const url = new URL(callUrl)
    const query = url.searchParams.get('query') ?? ''
    expect(query).toContain('sort:likes')
  })

  it('sort=created の場合、クエリに sort:likes が含まれない', async () => {
    vi.mocked(fetch).mockResolvedValue(createMockResponse([], 0))

    await fetchQiitaArticles({ tags: [], sort: 'created', page: 1 })

    const callUrl = vi.mocked(fetch).mock.calls[0][0] as string
    const url = new URL(callUrl)
    const query = url.searchParams.get('query') ?? ''
    expect(query).not.toContain('sort:likes')
  })

  it('ページ番号が URL パラメータに含まれる', async () => {
    vi.mocked(fetch).mockResolvedValue(createMockResponse([], 0))

    await fetchQiitaArticles({ tags: [], sort: 'created', page: 3 })

    const callUrl = vi.mocked(fetch).mock.calls[0][0] as string
    const url = new URL(callUrl)
    expect(url.searchParams.get('page')).toBe('3')
  })

  it('dateRange=week の場合、クエリに created:>= が含まれる', async () => {
    vi.mocked(fetch).mockResolvedValue(createMockResponse([], 0))

    await fetchQiitaArticles({ tags: [], sort: 'created', page: 1, dateRange: 'week' })

    const callUrl = vi.mocked(fetch).mock.calls[0][0] as string
    const url = new URL(callUrl)
    const query = url.searchParams.get('query') ?? ''
    expect(query).toContain('created:>=')
  })

  it('dateRange=all の場合、クエリに created:>= が含まれない', async () => {
    vi.mocked(fetch).mockResolvedValue(createMockResponse([], 0))

    await fetchQiitaArticles({ tags: [], sort: 'created', page: 1, dateRange: 'all' })

    const callUrl = vi.mocked(fetch).mock.calls[0][0] as string
    const url = new URL(callUrl)
    const query = url.searchParams.get('query') ?? ''
    expect(query).not.toContain('created:>=')
  })

  it('Total-Count ヘッダーが null の場合、totalCount は 0 になる', async () => {
    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue([]),
      headers: { get: vi.fn().mockReturnValue(null) },
    } as unknown as Response
    vi.mocked(fetch).mockResolvedValue(mockResponse)

    const result = await fetchQiitaArticles({ tags: [], sort: 'created', page: 1 })
    expect(result.totalCount).toBe(0)
  })
})
