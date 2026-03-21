import { useState, useEffect } from 'react'
import type { Article, SourceFilter } from '../types/article'
import type { SortOrder, DateRange } from '../types/qiita'
import { fetchQiitaArticles } from '../utils/qiitaApi'
import { fetchZennArticles } from '../utils/zennApi'

interface UseArticlesParams {
  tags: string[]
  sort: SortOrder
  page: number
  source: SourceFilter
  dateRange: DateRange
}

interface UseArticlesResult {
  articles: Article[]
  loading: boolean
  error: string | null
  totalCount: number
}

export function useArticles({ tags, sort, page, source, dateRange }: UseArticlesParams): UseArticlesResult {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    let cancelled = false

    setLoading(true)
    setError(null)

    async function load() {
      if (source === 'qiita') {
        return fetchQiitaArticles({ tags, sort, page, dateRange })
      }

      if (source === 'zenn') {
        return fetchZennArticles({ tags, sort, page })
      }

      // 'all': fetch both in parallel, merge results
      const [qiitaResult, zennResult] = await Promise.allSettled([
        fetchQiitaArticles({ tags, sort, page, dateRange }),
        fetchZennArticles({ tags, sort, page }),
      ])

      const qiita =
        qiitaResult.status === 'fulfilled'
          ? qiitaResult.value
          : { articles: [], totalCount: 0 }
      const zenn =
        zennResult.status === 'fulfilled'
          ? zennResult.value
          : { articles: [], totalCount: 0 }

      const merged = [...qiita.articles, ...zenn.articles]
      if (sort === 'likes') {
        merged.sort((a, b) => b.likes_count - a.likes_count)
      } else {
        merged.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
      }

      return { articles: merged, totalCount: qiita.totalCount }
    }

    load()
      .then(({ articles, totalCount }) => {
        if (!cancelled) {
          setArticles(articles)
          setTotalCount(totalCount)
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setError(err.message)
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [tags.join(','), sort, page, source, dateRange])

  return { articles, loading, error, totalCount }
}
