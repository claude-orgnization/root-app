import { useReducer, useEffect } from 'react'
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
  retryCount?: number
}

interface UseArticlesResult {
  articles: Article[]
  loading: boolean
  error: string | null
  totalCount: number
}

type State = UseArticlesResult

type Action =
  | { type: 'loading' }
  | { type: 'success'; articles: Article[]; totalCount: number }
  | { type: 'error'; message: string }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'loading':
      return { ...state, loading: true, error: null }
    case 'success':
      return { articles: action.articles, totalCount: action.totalCount, loading: false, error: null }
    case 'error':
      return { ...state, loading: false, error: action.message }
  }
}

const initialState: State = { articles: [], loading: true, error: null, totalCount: 0 }

export function useArticles({ tags, sort, page, source, dateRange, retryCount = 0 }: UseArticlesParams): UseArticlesResult {
  const [state, dispatch] = useReducer(reducer, initialState)

  const tagsKey = tags.join(',')

  useEffect(() => {
    let cancelled = false

    dispatch({ type: 'loading' })

    async function load(): Promise<{ articles: Article[]; totalCount: number }> {
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

      if (qiitaResult.status === 'rejected' && zennResult.status === 'rejected') {
        throw (qiitaResult.reason as Error)
      }

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
        if (!cancelled) dispatch({ type: 'success', articles, totalCount })
      })
      .catch((err: Error) => {
        if (!cancelled) dispatch({ type: 'error', message: err.message })
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tagsKey, sort, page, source, dateRange, retryCount])

  return state
}
