import { useReducer, useEffect } from 'react'
import type { Article, SourceFilter } from '../types/article'
import type { SortOrder, DateRange } from '../types/qiita'
import { fetchQiitaArticles } from '../utils/qiitaApi'
import { fetchZennArticles } from '../utils/zennApi'
import { loadCache, saveCache } from '../utils/storage'

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
  | { type: 'cache'; articles: Article[]; totalCount: number }
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
    case 'cache':
      // キャッシュから復元: loadingは継続（裏でフェッチ中）
      return { articles: action.articles, totalCount: action.totalCount, loading: true, error: null }
    case 'success':
      return { articles: action.articles, totalCount: action.totalCount, loading: false, error: null }
    case 'partial':
      return { articles: action.articles, totalCount: action.totalCount, loading: false, error: null }
    case 'append': {
      const merged = sortArticles([...state.articles, ...action.articles], action.sort)
      return { ...state, articles: merged }
    }
    case 'error':
      // キャッシュ記事がある場合はエラーでも記事を維持
      if (state.articles.length > 0) {
        return { ...state, loading: false, error: null }
      }
      return { ...state, loading: false, error: action.message }
  }
}

function cacheKey(tagsKey: string, sort: string, page: number, source: string, dateRange: string): string {
  return `qiita-ai-articles-${source}-${tagsKey}-${sort}-${page}-${dateRange}`
}

interface CachedResult {
  articles: Article[]
  totalCount: number
}

const initialState: State = { articles: [], loading: true, error: null, totalCount: 0 }

export function useArticles({ tags, sort, page, source, dateRange, retryCount = 0 }: UseArticlesParams): UseArticlesResult {
  const [state, dispatch] = useReducer(reducer, initialState)

  const tagsKey = tags.join(',')

  useEffect(() => {
    let cancelled = false

    const key = cacheKey(tagsKey, sort, page, source, dateRange)

    // ステップ1: キャッシュがあれば即座に表示
    const cached = loadCache<CachedResult>(key)
    if (cached) {
      dispatch({ type: 'cache', articles: cached.articles, totalCount: cached.totalCount })
    } else {
      dispatch({ type: 'loading' })
    }

    // ステップ2: 裏でAPI取得して更新 + キャッシュ保存
    function saveAndDispatch(articles: Article[], totalCount: number): void {
      if (cancelled) return
      saveCache(key, { articles, totalCount })
      dispatch({ type: 'success', articles, totalCount })
    }

    if (source === 'qiita') {
      fetchQiitaArticles({ tags, sort, page, dateRange })
        .then(({ articles, totalCount }) => saveAndDispatch(articles, totalCount))
        .catch((err: Error) => {
          if (!cancelled) dispatch({ type: 'error', message: err.message })
        })
    } else if (source === 'zenn') {
      fetchZennArticles({ tags, sort, page })
        .then(({ articles, totalCount }) => saveAndDispatch(articles, totalCount))
        .catch((err: Error) => {
          if (!cancelled) dispatch({ type: 'error', message: err.message })
        })
    } else {
      // 'all': Qiitaを先に表示、Zennを後から追加
      let qiitaFailed = false
      let zennFailed = false
      let allArticles: Article[] = []
      let qiitaTotalCount = 0

      const qiitaPromise = fetchQiitaArticles({ tags, sort, page, dateRange })
        .then(({ articles, totalCount }) => {
          if (!cancelled) {
            allArticles = articles
            qiitaTotalCount = totalCount
            dispatch({ type: 'partial', articles, totalCount })
          }
        })
        .catch((err: Error) => {
          qiitaFailed = true
          return err
        })

      const zennPromise = fetchZennArticles({ tags, sort, page })
        .then(({ articles }) => {
          if (!cancelled) {
            allArticles = sortArticles([...allArticles, ...articles], sort)
            dispatch({ type: 'append', articles, sort })
          }
        })
        .catch((err: Error) => {
          zennFailed = true
          return err
        })

      Promise.all([qiitaPromise, zennPromise]).then(([qiitaErr]) => {
        if (cancelled) return
        if (qiitaFailed && zennFailed) {
          const msg = qiitaErr instanceof Error ? qiitaErr.message : '記事の取得に失敗しました'
          dispatch({ type: 'error', message: msg })
        } else {
          // 成功分をキャッシュ
          saveCache(key, { articles: allArticles, totalCount: qiitaTotalCount })
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
