import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { FavoriteArticle } from '../types/kanban'

interface Props {
  article: FavoriteArticle
  onRemove: (articleId: string) => void
}

const SOURCE_BADGE: Record<string, { label: string; className: string }> = {
  qiita: {
    label: 'Qiita',
    className: 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  },
  zenn: {
    label: 'Zenn',
    className: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  },
}

export function KanbanCard({ article, onRemove }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: article.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const badge = SOURCE_BADGE[article.source]

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 cursor-grab active:cursor-grabbing ${isDragging ? 'opacity-50 shadow-lg' : 'hover:shadow-md'} transition-shadow`}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 leading-snug line-clamp-2"
          onClick={(e) => e.stopPropagation()}
        >
          {article.title}
        </a>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove(article.id)
          }}
          aria-label="お気に入りから削除"
          className="p-0.5 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shrink-0"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-2">
          {badge && (
            <span className={`px-1.5 py-0.5 rounded font-medium ${badge.className}`}>
              {badge.label}
            </span>
          )}
          <span>{article.author.name}</span>
        </div>
        <div className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5 text-rose-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
          </svg>
          <span>{article.likes_count}</span>
        </div>
      </div>
    </div>
  )
}
