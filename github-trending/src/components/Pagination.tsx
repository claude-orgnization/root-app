const PER_PAGE = 20

interface Props {
  page: number
  totalCount: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, totalCount, onPageChange }: Props) {
  const totalPages = Math.ceil(totalCount / PER_PAGE)
  const isFirst = page <= 1
  const isLast = page >= totalPages

  return (
    <div className="flex items-center justify-center gap-4">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={isFirst}
        className="px-4 py-2 text-sm font-medium rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        前へ
      </button>
      <span className="text-sm text-gray-500 dark:text-gray-400">
        {page} / {totalPages || 1}
      </span>
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={isLast}
        className="px-4 py-2 text-sm font-medium rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        次へ
      </button>
    </div>
  )
}
