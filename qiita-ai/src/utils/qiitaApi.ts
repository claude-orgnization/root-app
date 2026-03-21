import type { QiitaArticle, SortOrder, DateRange } from '../types/qiita'
import { DEFAULT_QUERY } from '../constants/tags'

const BASE_URL = 'https://qiita.com/api/v2'
const PER_PAGE = 20

function getDateRangeQuery(dateRange: DateRange): string {
  if (dateRange === 'all') return ''
  const now = new Date()
  if (dateRange === 'week') now.setDate(now.getDate() - 7)
  else if (dateRange === 'month') now.setMonth(now.getMonth() - 1)
  else if (dateRange === '3months') now.setMonth(now.getMonth() - 3)
  const yyyy = now.getFullYear()
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')
  return ` created:>=${yyyy}-${mm}-${dd}`
}

interface FetchArticlesParams {
  tags: string[]
  sort: SortOrder
  page: number
  dateRange: DateRange
}

interface FetchArticlesResult {
  articles: QiitaArticle[]
  totalCount: number
}

export async function fetchArticles({
  tags,
  sort,
  page,
  dateRange,
}: FetchArticlesParams): Promise<FetchArticlesResult> {
  const baseQuery = tags.length > 0
    ? tags.map((tag) => `tag:${tag}`).join(' OR ')
    : DEFAULT_QUERY

  const dateQuery = getDateRangeQuery(dateRange)
  const sortQuery = sort === 'likes' ? ' sort:likes' : ''
  const query = `${baseQuery}${dateQuery}${sortQuery}`

  const params = new URLSearchParams({
    query,
    page: String(page),
    per_page: String(PER_PAGE),
  })

  const res = await fetch(`${BASE_URL}/items?${params}`)

  if (!res.ok) {
    throw new Error(`Qiita API error: ${res.status}`)
  }

  const articles: QiitaArticle[] = await res.json()
  const totalCount = Number(res.headers.get('Total-Count') ?? 0)

  return { articles, totalCount }
}
