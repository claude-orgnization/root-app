import type { QiitaArticle, SortOrder } from '../types/qiita'
import { DEFAULT_QUERY } from '../constants/tags'

const BASE_URL = 'https://qiita.com/api/v2'
const PER_PAGE = 20

interface FetchArticlesParams {
  tags: string[]
  sort: SortOrder
  page: number
}

interface FetchArticlesResult {
  articles: QiitaArticle[]
  totalCount: number
}

export async function fetchArticles({
  tags,
  sort,
  page,
}: FetchArticlesParams): Promise<FetchArticlesResult> {
  const query = tags.length > 0
    ? tags.map((tag) => `tag:${tag}`).join(' OR ')
    : DEFAULT_QUERY

  const params = new URLSearchParams({
    query,
    page: String(page),
    per_page: String(PER_PAGE),
  })

  if (sort === 'likes') {
    params.set('query', `${query} sort:likes`)
  }

  const res = await fetch(`${BASE_URL}/items?${params}`)

  if (!res.ok) {
    throw new Error(`Qiita API error: ${res.status}`)
  }

  const articles: QiitaArticle[] = await res.json()
  const totalCount = Number(res.headers.get('Total-Count') ?? 0)

  return { articles, totalCount }
}
