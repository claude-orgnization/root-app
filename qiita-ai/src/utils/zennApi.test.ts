import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { fetchZennArticles } from './zennApi'

interface ZennArticleRaw {
  id: number
  title: string
  slug: string
  published_at: string
  liked_count: number
  user: { username: string; name: string; avatar_small_url: string }
  topics: { name: string; display_name: string }[]
}

interface ZennResponse {
  articles: ZennArticleRaw[]
  next_page: number | null
}

const mockZennArticle: ZennArticleRaw = {
  id: 1001,
  title: 'Zenn テスト記事',
  slug: 'test-article-slug',
  published_at: '2024-02-10T09:00:00+09:00',
  liked_count: 30,
  user: {
    username: 'zennuser',
    name: 'Zenn ユーザー',
    avatar_small_url: 'https://example.com/zenn-avatar.png',
  },
  topics: [{ name: 'llm', display_name: 'LLM' }],
}

function createZennResponse(articles: ZennArticleRaw[], nextPage: number | null = null): ZennResponse {
  return { articles, next_page: nextPage }
}

function createMockFetch(responses: ZennResponse[], ok = true) {
  let callIndex = 0
  return vi.fn().mockImplementation(() => {
    const response = responses[callIndex % responses.length]
    callIndex++
    return Promise.resolve({
      ok,
      status: ok ? 200 : 500,
      json: () => Promise.resolve(response),
    })
  })
}

describe('fetchZennArticles', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('記事一覧を正しく取得し Article 型に変換する', async () => {
    vi.stubGlobal('fetch', createMockFetch([createZennResponse([mockZennArticle])]))

    const result = await fetchZennArticles({ tags: ['LLM'], sort: 'created', page: 1 })

    expect(result.articles).toHaveLength(1)
    expect(result.articles[0]).toEqual({
      id: 'zenn-1001',
      title: 'Zenn テスト記事',
      url: 'https://zenn.dev/zennuser/articles/test-article-slug',
      created_at: '2024-02-10T09:00:00+09:00',
      likes_count: 30,
      tags: ['LLM'],
      source: 'zenn',
      author: {
        name: 'Zenn ユーザー',
        avatar_url: 'https://example.com/zenn-avatar.png',
      },
    })
  })

  it('タグが空のとき DEFAULT_ZENN_TOPICS が使用される', async () => {
    vi.stubGlobal('fetch', createMockFetch([createZennResponse([])]))

    const result = await fetchZennArticles({ tags: [], sort: 'created', page: 1 })

    // DEFAULT_ZENN_TOPICS のトピック数分だけ fetch が呼ばれる
    expect(fetch).toHaveBeenCalled()
    expect(result.articles).toHaveLength(0)
  })

  it('Qiita タグに対応する Zenn トピックが存在しない場合、空の結果を返す', async () => {
    const result = await fetchZennArticles({ tags: ['存在しないタグ'], sort: 'created', page: 1 })

    expect(result.articles).toHaveLength(0)
    expect(result.totalCount).toBe(0)
    expect(fetch).not.toHaveBeenCalled()
  })

  it('sort=likes の場合、記事を liked_count の降順でソートする', async () => {
    const articles: ZennArticleRaw[] = [
      { ...mockZennArticle, id: 1, liked_count: 10 },
      { ...mockZennArticle, id: 2, liked_count: 50 },
      { ...mockZennArticle, id: 3, liked_count: 30 },
    ]
    vi.stubGlobal('fetch', createMockFetch([createZennResponse(articles)]))

    const result = await fetchZennArticles({ tags: ['LLM'], sort: 'likes', page: 1 })

    expect(result.articles[0].likes_count).toBe(50)
    expect(result.articles[1].likes_count).toBe(30)
    expect(result.articles[2].likes_count).toBe(10)
  })

  it('sort=created の場合、記事を published_at の降順でソートする', async () => {
    const articles: ZennArticleRaw[] = [
      { ...mockZennArticle, id: 1, slug: 'a', published_at: '2024-01-01T00:00:00Z' },
      { ...mockZennArticle, id: 2, slug: 'b', published_at: '2024-03-01T00:00:00Z' },
      { ...mockZennArticle, id: 3, slug: 'c', published_at: '2024-02-01T00:00:00Z' },
    ]
    vi.stubGlobal('fetch', createMockFetch([createZennResponse(articles)]))

    const result = await fetchZennArticles({ tags: ['LLM'], sort: 'created', page: 1 })

    expect(result.articles[0].created_at).toBe('2024-03-01T00:00:00Z')
    expect(result.articles[1].created_at).toBe('2024-02-01T00:00:00Z')
    expect(result.articles[2].created_at).toBe('2024-01-01T00:00:00Z')
  })

  it('重複記事を除外する（同じ id の記事は1件のみ）', async () => {
    // tags=['AI', 'LLM'] の場合、2つの topic で fetch が走り同じ記事が含まれる可能性
    const sameArticle = { ...mockZennArticle, id: 999 }
    const mockFetch = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(createZennResponse([sameArticle])),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(createZennResponse([sameArticle])),
      })
    vi.stubGlobal('fetch', mockFetch)

    const result = await fetchZennArticles({ tags: ['AI', 'LLM'], sort: 'created', page: 1 })

    const ids = result.articles.map((a) => a.id)
    const uniqueIds = [...new Set(ids)]
    expect(ids).toHaveLength(uniqueIds.length)
  })

  it('API エラー時（全リクエスト失敗）に例外をスローする', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }))

    await expect(
      fetchZennArticles({ tags: ['LLM'], sort: 'created', page: 1 })
    ).rejects.toThrow()
  })

  it('user.name が空文字の場合、username を使用する', async () => {
    const articleWithNoName: ZennArticleRaw = {
      ...mockZennArticle,
      user: { username: 'fallbackuser', name: '', avatar_small_url: '' },
    }
    vi.stubGlobal('fetch', createMockFetch([createZennResponse([articleWithNoName])]))

    const result = await fetchZennArticles({ tags: ['LLM'], sort: 'created', page: 1 })

    expect(result.articles[0].author.name).toBe('fallbackuser')
  })

  it('next_page が存在する場合、totalCount がページ数を反映する', async () => {
    vi.stubGlobal('fetch', createMockFetch([createZennResponse([mockZennArticle], 2)]))

    const result = await fetchZennArticles({ tags: ['LLM'], sort: 'created', page: 1 })

    // hasNextPage=true の場合: totalCount = (page + 1) * COUNT = (1+1)*20 = 40
    expect(result.totalCount).toBe(40)
  })
})
