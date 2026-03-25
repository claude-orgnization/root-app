import { useState, useCallback } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { KanbanColumn } from './KanbanColumn'
import { KanbanCard } from './KanbanCard'
import type { KanbanColumn as KanbanColumnType, FavoriteArticle } from '../types/kanban'

interface Props {
  columns: KanbanColumnType[]
  favorites: FavoriteArticle[]
  onMoveArticle: (articleId: string, fromColumnId: string, toColumnId: string, newIndex: number) => void
  onAddColumn: (title: string) => void
  onRenameColumn: (columnId: string, title: string) => void
  onDeleteColumn: (columnId: string) => void
  onRemoveArticle: (articleId: string) => void
}

export function KanbanBoard({
  columns,
  favorites,
  onMoveArticle,
  onAddColumn,
  onRenameColumn,
  onDeleteColumn,
  onRemoveArticle,
}: Props) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isAddingColumn, setIsAddingColumn] = useState(false)
  const [newColumnTitle, setNewColumnTitle] = useState('')

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  )

  const getFavoriteById = useCallback(
    (id: string) => favorites.find((f) => f.id === id),
    [favorites],
  )

  const findColumnByArticleId = useCallback(
    (articleId: string) => columns.find((col) => col.articleIds.includes(articleId)),
    [columns],
  )

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }, [])

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event
      if (!over) return

      const activeArticleId = active.id as string
      const overId = over.id as string

      const activeColumn = findColumnByArticleId(activeArticleId)
      if (!activeColumn) return

      // Is the over target a column or an article?
      const overColumn = columns.find((col) => col.id === overId) ?? findColumnByArticleId(overId)
      if (!overColumn || activeColumn.id === overColumn.id) return

      // Move to the new column at the end
      const overIndex = overColumn.articleIds.indexOf(overId)
      const newIndex = overIndex >= 0 ? overIndex : overColumn.articleIds.length
      onMoveArticle(activeArticleId, activeColumn.id, overColumn.id, newIndex)
    },
    [columns, findColumnByArticleId, onMoveArticle],
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      setActiveId(null)
      if (!over) return

      const activeArticleId = active.id as string
      const overId = over.id as string
      if (activeArticleId === overId) return

      const activeColumn = findColumnByArticleId(activeArticleId)
      if (!activeColumn) return

      // Same column reorder
      if (activeColumn.articleIds.includes(overId)) {
        const oldIndex = activeColumn.articleIds.indexOf(activeArticleId)
        const newIndex = activeColumn.articleIds.indexOf(overId)
        if (oldIndex !== newIndex) {
          const newOrder = arrayMove(activeColumn.articleIds, oldIndex, newIndex)
          const targetIndex = newOrder.indexOf(activeArticleId)
          onMoveArticle(activeArticleId, activeColumn.id, activeColumn.id, targetIndex)
        }
      }
    },
    [findColumnByArticleId, onMoveArticle],
  )

  const handleAddColumn = () => {
    const trimmed = newColumnTitle.trim()
    if (trimmed) {
      onAddColumn(trimmed)
      setNewColumnTitle('')
      setIsAddingColumn(false)
    }
  }

  const activeArticle = activeId ? getFavoriteById(activeId) : null

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4 px-1">
        {columns.map((column) => {
          const columnArticles = column.articleIds
            .map((id) => getFavoriteById(id))
            .filter((a): a is FavoriteArticle => a !== undefined)

          return (
            <KanbanColumn
              key={column.id}
              column={column}
              articles={columnArticles}
              onRename={onRenameColumn}
              onDelete={onDeleteColumn}
              onRemoveArticle={onRemoveArticle}
            />
          )
        })}

        {/* Add column button */}
        <div className="min-w-[280px] w-[280px] shrink-0">
          {isAddingColumn ? (
            <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-3">
              <input
                type="text"
                value={newColumnTitle}
                onChange={(e) => setNewColumnTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddColumn()
                  if (e.key === 'Escape') {
                    setIsAddingColumn(false)
                    setNewColumnTitle('')
                  }
                }}
                placeholder="列の名前を入力..."
                className="w-full text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-3 py-1.5 text-gray-900 dark:text-white outline-none focus:border-indigo-400 mb-2"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddColumn}
                  className="text-sm px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
                >
                  追加
                </button>
                <button
                  onClick={() => {
                    setIsAddingColumn(false)
                    setNewColumnTitle('')
                  }}
                  className="text-sm px-3 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 rounded transition-colors"
                >
                  キャンセル
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAddingColumn(true)}
              className="w-full text-sm text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg py-6 hover:border-indigo-400 hover:text-indigo-500 transition-colors"
            >
              + 列を追加
            </button>
          )}
        </div>
      </div>

      <DragOverlay>
        {activeArticle ? (
          <div className="rotate-3">
            <KanbanCard article={activeArticle} onRemove={() => {}} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
