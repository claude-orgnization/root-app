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
  | { type: 'partial'; articles: Article[]; totalCount: number }
  | { type: 'append'; articles: Article[]; sort: SortOrder }
  | { type: 'error'; message: string }

function sortArticles(articles: Article[], sort: SortOrder): Article[] {
  return [...articles].sort((a, b) =>
    sort === 'likes'
      ? b.likes_count - a.likes_count
      : new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'loading':
      return { ...state, loading: true, error: null }
    case 'success':
      return { articles: action.articles, totalCount: action.totalCount, loading: false, error: null }
    case 'partial':
      return { articles: action.articles, totalCount: action.totalCount, loading: false, error: null }
    case 'append': {
      const merged = sortArticles([...state.articles, ...action.articles], action.sort)
      return { ...state, articles: merged }
    }
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

    if (source === 'qiita') {
      fetchQiitaArticles({ tags, sort, page, dateRange })
        .then(({ articles, totalCount }) => {
          if (!cancelled) dispatch({ type: 'success', articles, totalCount })
        })
        .catch((err: Error) => {
          if (!cancelled) dispatch({ type: 'error', message: err.message })
        })
    } else if (source === 'zenn') {
      fetchZennArticles({ tags, sort, page })
        .then(({ articles, totalCount }) => {
          if (!cancelled) dispatch({ type: 'success', articles, totalCount })
        })
        .catch((err: Error) => {
          if (!cancelled) dispatch({ type: 'error', message: err.message })
        })
    } else {
      // 'all': Qiitaを先に表示、Zennを後から追加（段階的フェッチ）
      let qiitaFailed = false
      let zennFailed = false

      const qiitaPromise = fetchQiitaArticles({ tags, sort, page, dateRange })
        .then(({ articles, totalCount }) => {
          if (!cancelled) dispatch({ type: 'partial', articles, totalCount })
        })
        .catch((err: Error) => {
          qiitaFailed = true
          return err
        })

      const zennPromise = fetchZennArticles({ tags, sort, page })
        .then(({ articles }) => {
          if (!cancelled) dispatch({ type: 'append', articles, sort })
        })
        .catch((err: Error) => {
          zennFailed = true
          return err
        })

      Promise.all([qiitaPromise, zennPromise]).then(([qiitaErr]) => {
        if (!cancelled && qiitaFailed && zennFailed) {
          const msg = qiitaErr instanceof Error ? qiitaErr.message : '記事の取得に失敗しました'
          dispatch({ type: 'error', message: msg })
        }
      })
    }

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tagsKey, sort, page, source, dateRange, retryCount])

  return state
}
