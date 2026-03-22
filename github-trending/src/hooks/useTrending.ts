import { useReducer, useEffect } from 'react'
import type { GitHubRepo, DateRange } from '../types/github'
import type { Language } from '../constants/languages'
import { fetchTrendingRepos } from '../utils/githubApi'

interface UseTrendingParams {
  dateRange: DateRange
  language: Language
  page: number
  retryCount?: number
}

interface UseTrendingResult {
  repos: GitHubRepo[]
  loading: boolean
  error: string | null
  totalCount: number
}

type State = UseTrendingResult

type Action =
  | { type: 'loading' }
  | { type: 'success'; repos: GitHubRepo[]; totalCount: number }
  | { type: 'error'; message: string }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'loading':
      return { ...state, loading: true, error: null }
    case 'success':
      return { repos: action.repos, totalCount: action.totalCount, loading: false, error: null }
    case 'error':
      return { ...state, repos: [], loading: false, error: action.message }
  }
}

const initialState: State = { repos: [], loading: true, error: null, totalCount: 0 }

export function useTrending({ dateRange, language, page, retryCount = 0 }: UseTrendingParams): UseTrendingResult {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    let cancelled = false

    dispatch({ type: 'loading' })

    fetchTrendingRepos({ dateRange, language, page })
      .then(({ repos, totalCount }) => {
        if (!cancelled) dispatch({ type: 'success', repos, totalCount })
      })
      .catch((err: Error) => {
        if (!cancelled) dispatch({ type: 'error', message: err.message })
      })

    return () => {
      cancelled = true
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange, language, page, retryCount])

  return state
}
