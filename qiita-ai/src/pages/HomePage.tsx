import { useState, useCallback } from 'react'
import { useArticles } from '../hooks/useArticles'
import { FilterSidebar } from '../components/FilterSidebar'
import { ArticleList } from '../components/ArticleList'
import { Pagination } from '../components/Pagination'
import { ErrorMessage } from '../components/ErrorMessage'
import type { SortOrder, DateRange } from '../types/qiita'

export function HomePage() {
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sort, setSort] = useState<SortOrder>('created')
  const [dateRange, setDateRange] = useState<DateRange>('all')
  const [page, setPage] = useState(1)
  const [retryKey, setRetryKey] = useState(0)

  const { articles, loading, error, totalCount } = useArticles({
    tags: selectedTags,
    sort,
    page,
    dateRange,
  })

  const handleTagsChange = useCallback((tags: string[]) => {
    setSelectedTags(tags)
    setPage(1)
  }, [])

  const handleSortChange = useCallback((newSort: SortOrder) => {
    setSort(newSort)
    setPage(1)
  }, [])

  const handleDateRangeChange = useCallback((newDateRange: DateRange) => {
    setDateRange(newDateRange)
    setPage(1)
  }, [])

  const handleRetry = useCallback(() => {
    setRetryKey((k) => k + 1)
  }, [])

  return (
    <main className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
      <FilterSidebar
        selectedTags={selectedTags}
        sort={sort}
        dateRange={dateRange}
        onTagsChange={handleTagsChange}
        onSortChange={handleSortChange}
        onDateRangeChange={handleDateRangeChange}
      />

      <div className="flex-1 flex flex-col gap-6 min-w-0">
        {error ? (
          <ErrorMessage message={error} onRetry={handleRetry} key={retryKey} />
        ) : (
          <>
            <ArticleList articles={articles} loading={loading} />
            <Pagination page={page} totalCount={totalCount} onPageChange={setPage} />
          </>
        )}
      </div>
    </main>
  )
}
