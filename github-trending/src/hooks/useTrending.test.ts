import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useTrending } from './useTrending'
import * as githubApi from '../utils/githubApi'
import type { GitHubRepo } from '../types/github'

const mockRepo: GitHubRepo = {
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
}

describe('useTrending', () => {
  beforeEach(() => {
    vi.spyOn(githubApi, 'fetchTrendingRepos').mockResolvedValue({
      repos: [mockRepo],
      totalCount: 1,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('初期状態でloadingがtrueになる', () => {
    const { result } = renderHook(() =>
      useTrending({ dateRange: 'week', language: 'All', page: 1 })
    )
    expect(result.current.loading).toBe(true)
  })

  it('データ取得成功後、reposが設定される', async () => {
    const { result } = renderHook(() =>
      useTrending({ dateRange: 'week', language: 'All', page: 1 })
    )
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.repos).toHaveLength(1)
    expect(result.current.repos[0].name).toBe('awesome-repo')
    expect(result.current.error).toBeNull()
  })

  it('API失敗時にerrorが設定される', async () => {
    vi.spyOn(githubApi, 'fetchTrendingRepos').mockRejectedValue(new Error('API Error'))
    const { result } = renderHook(() =>
      useTrending({ dateRange: 'week', language: 'All', page: 1 })
    )
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.error).toBe('API Error')
    expect(result.current.repos).toHaveLength(0)
  })

  it('パラメータ変更時に再フェッチする', async () => {
    const fetchSpy = vi.spyOn(githubApi, 'fetchTrendingRepos')
    const { rerender } = renderHook(
      ({ dateRange }: { dateRange: 'today' | 'week' | 'month' }) =>
        useTrending({ dateRange, language: 'All', page: 1 }),
      { initialProps: { dateRange: 'week' as const } }
    )
    await waitFor(() => expect(fetchSpy).toHaveBeenCalledTimes(1))
    rerender({ dateRange: 'month' })
    await waitFor(() => expect(fetchSpy).toHaveBeenCalledTimes(2))
  })
})
