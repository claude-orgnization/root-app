import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { fetchTrendingRepos, buildSearchQuery } from './githubApi'
import type { DateRange } from '../types/github'

describe('buildSearchQuery', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-03-22'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('todayの場合、今日の日付でクエリを生成する', () => {
    const query = buildSearchQuery('today', 'All')
    expect(query).toContain('created:>=2024-03-22')
  })

  it('weekの場合、7日前の日付でクエリを生成する', () => {
    const query = buildSearchQuery('week', 'All')
    expect(query).toContain('created:>=2024-03-15')
  })

  it('monthの場合、30日前の日付でクエリを生成する', () => {
    const query = buildSearchQuery('month', 'All')
    expect(query).toContain('created:>=2024-02-21')
  })

  it('言語指定がある場合、language:xxxを追加する', () => {
    const query = buildSearchQuery('week', 'TypeScript')
    expect(query).toContain('language:TypeScript')
  })

  it('Allの場合、language指定を追加しない', () => {
    const query = buildSearchQuery('week', 'All')
    expect(query).not.toContain('language:')
  })
})

describe('fetchTrendingRepos', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-03-22'))
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  const mockRepos = [
    {
      id: 1,
      name: 'awesome-repo',
      full_name: 'user/awesome-repo',
      html_url: 'https://github.com/user/awesome-repo',
      description: 'An awesome repo',
      stargazers_count: 1000,
      forks_count: 100,
      language: 'TypeScript',
      created_at: '2024-03-20T00:00:00Z',
      owner: { login: 'user', avatar_url: 'https://avatars.githubusercontent.com/u/1' },
    },
  ]

  it('APIが成功した場合、リポジトリの配列と総数を返す', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ items: mockRepos, total_count: 1 }),
    } as Response)

    const result = await fetchTrendingRepos({ dateRange: 'week', language: 'All', page: 1 })
    expect(result.repos).toHaveLength(1)
    expect(result.repos[0].name).toBe('awesome-repo')
    expect(result.totalCount).toBe(1)
  })

  it('APIが失敗した場合、エラーをスローする', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 403,
    } as Response)

    await expect(
      fetchTrendingRepos({ dateRange: 'week', language: 'All', page: 1 })
    ).rejects.toThrow()
  })

  it('ページ番号に応じた正しいURLでfetchを呼び出す', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ items: [], total_count: 0 }),
    } as Response)

    await fetchTrendingRepos({ dateRange: 'week', language: 'All', page: 2 })
    const calledUrl = fetchSpy.mock.calls[0]?.[0] as string
    expect(calledUrl).toContain('page=2')
    expect(calledUrl).toContain('per_page=20')
  })
})
