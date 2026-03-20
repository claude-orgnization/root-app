const PER_PAGE = 20

interface Props {
  page: number
  totalCount: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, totalCount, onPageChange }: Props) {
  const totalPages = Math.ceil(totalCount / PER_PAGE)
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-4 mt-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        ← 前へ
      </button>
      <span className="text-sm text-gray-600 dark:text-gray-400">
        {page} / {totalPages}
      </span>
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        次へ →
      </button>
    </div>
  )
}
