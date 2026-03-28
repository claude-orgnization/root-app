import type { KanbanColumn } from '../types/kanban'

interface Props {
  columns: KanbanColumn[]
  totalFavorites: number
}

export function ReadingStats({ columns, totalFavorites }: Props) {
  if (totalFavorites === 0) return null

  const doneColumn = columns.find((col) => col.id === 'done')
  const doneCount = doneColumn ? doneColumn.articleIds.length : 0
  const doneRate = Math.round((doneCount / totalFavorites) * 100)

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-4">
      <div className="flex flex-wrap items-center gap-4 mb-3">
        {columns.map((col) => (
          <div key={col.id} className="flex items-center gap-1.5 text-sm">
            <span className="text-gray-500 dark:text-gray-400">{col.title}:</span>
            <span className="font-semibold text-gray-900 dark:text-white">{col.articleIds.length}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0">読了率</span>
        <div className="flex-1 h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${doneRate}%` }}
          />
        </div>
        <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 shrink-0">
          {doneRate}%
        </span>
      </div>
    </div>
  )
}
