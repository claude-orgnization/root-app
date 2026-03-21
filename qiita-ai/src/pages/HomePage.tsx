import { useState, useCallback } from 'react'
import { useArticles } from '../hooks/useArticles'
import { FilterBar } from '../components/FilterBar'
import { ArticleList } from '../components/ArticleList'
import { Pagination } from '../components/Pagination'
import { ErrorMessage } from '../components/ErrorMessage'
import type { SortOrder } from '../types/qiita'
import type { SourceFilter } from '../types/article'

export function HomePage() {
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sort, setSort] = useState<SortOrder>('created')
  const [source, setSource] = useState<SourceFilter>('all')
  const [page, setPage] = useState(1)
  const [retryKey, setRetryKey] = useState(0)

  const { articles, loading, error, totalCount } = useArticles({
    tags: selectedTags,
    sort,
    page,
    source,
  })

  const handleTagsChange = useCallback((tags: string[]) => {
    setSelectedTags(tags)
    setPage(1)
  }, [])

  const handleSortChange = useCallback((newSort: SortOrder) => {
    setSort(newSort)
    setPage(1)
  }, [])

  const handleSourceChange = useCallback((newSource: SourceFilter) => {
    setSource(newSource)
    setPage(1)
  }, [])

  const handleRetry = useCallback(() => {
    setRetryKey((k) => k + 1)
  }, [])

  return (
    <main className="max-w-5xl mx-auto px-4 py-6 flex flex-col gap-6">
      <FilterBar
        selectedTags={selectedTags}
        sort={sort}
        source={source}
        onTagsChange={handleTagsChange}
        onSortChange={handleSortChange}
        onSourceChange={handleSourceChange}
      />

      {error ? (
        <ErrorMessage message={error} onRetry={handleRetry} key={retryKey} />
      ) : (
        <>
          <ArticleList articles={articles} loading={loading} />
          <Pagination page={page} totalCount={totalCount} onPageChange={setPage} />
        </>
      )}
    </main>
  )
}
