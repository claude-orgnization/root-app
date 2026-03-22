import { useState } from 'react'
import type { DateRange } from '../types/github'
import type { Language } from '../constants/languages'
import { useTrending } from '../hooks/useTrending'
import { RepoList } from '../components/RepoList'
import { FilterBar } from '../components/FilterBar'
import { Pagination } from '../components/Pagination'
import { ErrorMessage } from '../components/ErrorMessage'

export function HomePage() {
  const [dateRange, setDateRange] = useState<DateRange>('week')
  const [language, setLanguage] = useState<Language>('All')
  const [page, setPage] = useState(1)
  const [retryCount, setRetryCount] = useState(0)

  const { repos, loading, error, totalCount } = useTrending({ dateRange, language, page, retryCount })

  function handleDateRangeChange(range: DateRange) {
    setDateRange(range)
    setPage(1)
  }

  function handleLanguageChange(lang: Language) {
    setLanguage(lang)
    setPage(1)
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-6 flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">GitHub Trending</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          GitHub Search APIを使ったトレンドリポジトリ一覧
        </p>
      </div>

      <FilterBar
        dateRange={dateRange}
        language={language}
        onDateRangeChange={handleDateRangeChange}
        onLanguageChange={handleLanguageChange}
      />

      {error ? (
        <ErrorMessage message={error} onRetry={() => setRetryCount((c) => c + 1)} />
      ) : (
        <>
          <RepoList repos={repos} loading={loading} />
          {!loading && totalCount > 0 && (
            <Pagination page={page} totalCount={totalCount} onPageChange={setPage} />
          )}
        </>
      )}
    </main>
  )
}
