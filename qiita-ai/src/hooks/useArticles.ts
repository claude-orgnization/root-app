import { useState, useEffect } from 'react'
import type { QiitaArticle, SortOrder } from '../types/qiita'
import { fetchArticles } from '../utils/qiitaApi'

interface UseArticlesParams {
  tags: string[]
  sort: SortOrder
  page: number
}

interface UseArticlesResult {
  articles: QiitaArticle[]
  loading: boolean
  error: string | null
  totalCount: number
}

export function useArticles({ tags, sort, page }: UseArticlesParams): UseArticlesResult {
  const [articles, setArticles] = useState<QiitaArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    let cancelled = false

    setLoading(true)
    setError(null)

    fetchArticles({ tags, sort, page })
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
  }, [tags.join(','), sort, page])

  return { articles, loading, error, totalCount }
}
