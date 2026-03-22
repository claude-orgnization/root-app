import type { GitHubRepo, DateRange } from '../types/github'
import type { Language } from '../constants/languages'

const BASE_URL = 'https://api.github.com/search/repositories'
const PER_PAGE = 20

function getDateString(daysAgo: number): string {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  return date.toISOString().split('T')[0]!
}

export function buildSearchQuery(dateRange: DateRange, language: Language): string {
  const daysMap: Record<DateRange, number> = {
    today: 0,
    week: 7,
    month: 30,
  }
  const dateStr = getDateString(daysMap[dateRange])
  let query = `created:>=${dateStr}`
  if (language !== 'All') {
    query += ` language:${language}`
  }
  return query
}

interface FetchParams {
  dateRange: DateRange
  language: Language
  page: number
}

interface FetchResult {
  repos: GitHubRepo[]
  totalCount: number
}

export async function fetchTrendingRepos({ dateRange, language, page }: FetchParams): Promise<FetchResult> {
  const query = buildSearchQuery(dateRange, language)
  const url = `${BASE_URL}?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=${PER_PAGE}&page=${page}`

  const res = await fetch(url)
  if (!res.ok) {
    if (res.status === 403) {
      throw new Error('GitHub APIのレート制限に達しました。しばらく待ってからお試しください。')
    }
    throw new Error(`GitHub API エラー: ${res.status}`)
  }

  const data = await res.json() as { items: GitHubRepo[]; total_count: number }
  return { repos: data.items, totalCount: Math.min(data.total_count, 1000) }
}
