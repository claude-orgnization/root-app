import { useState } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { KanbanCard } from './KanbanCard'
import type { KanbanColumn as KanbanColumnType } from '../types/kanban'
import type { FavoriteArticle } from '../types/kanban'
import { DEFAULT_COLUMNS } from '../types/kanban'

interface Props {
  column: KanbanColumnType
  articles: FavoriteArticle[]
  onRename: (columnId: string, title: string) => void
  onDelete: (columnId: string) => void
  onRemoveArticle: (articleId: string) => void
}

const DEFAULT_COLUMN_IDS = DEFAULT_COLUMNS.map((c) => c.id)

export function KanbanColumn({ column, articles, onRename, onDelete, onRemoveArticle }: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(column.title)
  const isDefault = DEFAULT_COLUMN_IDS.includes(column.id)

  const { setNodeRef, isOver } = useDroppable({ id: column.id })

  const handleRename = () => {
    const trimmed = editTitle.trim()
    if (trimmed && trimmed !== column.title) {
      onRename(column.id, trimmed)
    } else {
      setEditTitle(column.title)
    }
    setIsEditing(false)
  }

  return (
    <div
      className={`bg-gray-100 dark:bg-gray-900 rounded-lg p-3 min-w-[280px] w-[280px] shrink-0 flex flex-col max-h-[calc(100vh-10rem)] ${isOver ? 'ring-2 ring-indigo-400' : ''}`}
    >
      <div className="flex items-center justify-between mb-3 px-1">
        {isEditing ? (
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleRename()
              if (e.key === 'Escape') {
                setEditTitle(column.title)
                setIsEditing(false)
              }
            }}
            className="text-sm font-semibold bg-white dark:bg-gray-800 border border-indigo-400 rounded px-2 py-0.5 text-gray-900 dark:text-white outline-none flex-1 mr-2"
            autoFocus
          />
        ) : (
          <h3
            className="text-sm font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400"
            onClick={() => {
              setEditTitle(column.title)
              setIsEditing(true)
            }}
            title="クリックで名前を変更"
          >
            {column.title}
            <span className="ml-2 text-xs font-normal text-gray-400">{articles.length}</span>
          </h3>
        )}
        {!isDefault && !isEditing && (
          <button
            onClick={() => onDelete(column.id)}
            aria-label={`${column.title}列を削除`}
            className="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>

      <div ref={setNodeRef} className="flex-1 overflow-y-auto space-y-2 min-h-[60px]">
        <SortableContext items={articles.map((a) => a.id)} strategy={verticalListSortingStrategy}>
          {articles.length === 0 ? (
            <p className="text-xs text-gray-400 dark:text-gray-500 text-center py-6">
              カードがありません
            </p>
          ) : (
            articles.map((article) => (
              <KanbanCard key={article.id} article={article} onRemove={onRemoveArticle} />
            ))
          )}
        </SortableContext>
      </div>
    </div>
  )
}
