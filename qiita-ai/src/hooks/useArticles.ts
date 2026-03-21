import { useReducer, useEffect } from 'react'
import type { QiitaArticle, SortOrder, DateRange } from '../types/qiita'
import { fetchArticles } from '../utils/qiitaApi'

interface UseArticlesParams {
  tags: string[]
  sort: SortOrder
  page: number
  dateRange: DateRange
}

interface UseArticlesResult {
  articles: QiitaArticle[]
  loading: boolean
  error: string | null
  totalCount: number
}

type State = UseArticlesResult

type Action =
  | { type: 'loading' }
  | { type: 'success'; articles: QiitaArticle[]; totalCount: number }
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

export function useArticles({ tags, sort, page, dateRange }: UseArticlesParams): UseArticlesResult {
  const [state, dispatch] = useReducer(reducer, initialState)

  const tagsKey = tags.join(',')

  useEffect(() => {
    let cancelled = false

    dispatch({ type: 'loading' })

    fetchArticles({ tags, sort, page, dateRange })
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
  }, [tagsKey, sort, page, dateRange])

  return state
}
