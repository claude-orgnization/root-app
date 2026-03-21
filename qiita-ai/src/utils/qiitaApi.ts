import type { QiitaArticle, SortOrder, DateRange } from '../types/qiita'
import type { Article } from '../types/article'
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
  dateRange?: DateRange
}

interface FetchArticlesResult {
  articles: Article[]
  totalCount: number
}

function toArticle(a: QiitaArticle): Article {
  return {
    id: `qiita-${a.id}`,
    title: a.title,
    url: a.url,
    created_at: a.created_at,
    likes_count: a.likes_count,
    tags: a.tags.map((t) => t.name),
    source: 'qiita',
    author: {
      name: a.user.id,
      avatar_url: a.user.profile_image_url,
    },
  }
}

export async function fetchQiitaArticles({
  tags,
  sort,
  page,
  dateRange = 'all',
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

  let res: Response
  try {
    res = await fetch(`${BASE_URL}/items?${params}`)
  } catch (err) {
    console.error('[Qiita] fetch failed:', err)
    throw new Error('Qiita APIへの接続に失敗しました（ネットワークエラーまたはCORS制限）')
  }

  if (!res.ok) {
    console.error(`[Qiita] HTTP ${res.status}`)
    if (res.status === 403) {
      throw new Error('Qiita APIのレート制限に達しました（1時間60回まで）。しばらく待ってから再試行してください。')
    }
    throw new Error(`Qiita API エラー: ${res.status}`)
  }

  const raw: QiitaArticle[] = await res.json()
  const totalCount = Number(res.headers.get('Total-Count') ?? 0)

  return { articles: raw.map(toArticle), totalCount }
}
