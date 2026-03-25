import { useState, useCallback } from 'react'
import type { KanbanColumn } from '../types/kanban'
import { DEFAULT_COLUMNS, COLUMNS_STORAGE_KEY } from '../types/kanban'

function loadColumns(): KanbanColumn[] {
  try {
    const raw = localStorage.getItem(COLUMNS_STORAGE_KEY)
    return raw ? (JSON.parse(raw) as KanbanColumn[]) : DEFAULT_COLUMNS
  } catch {
    return DEFAULT_COLUMNS
  }
}

function saveColumns(columns: KanbanColumn[]): void {
  localStorage.setItem(COLUMNS_STORAGE_KEY, JSON.stringify(columns))
}

export function useKanban() {
  const [columns, setColumns] = useState<KanbanColumn[]>(loadColumns)

  const updateColumns = useCallback((updater: (prev: KanbanColumn[]) => KanbanColumn[]) => {
    setColumns((prev) => {
      const next = updater(prev)
      saveColumns(next)
      return next
    })
  }, [])

  const addArticleToBoard = useCallback(
    (articleId: string) => {
      updateColumns((prev) => {
        const alreadyExists = prev.some((col) => col.articleIds.includes(articleId))
        if (alreadyExists) return prev
        return prev.map((col, i) =>
          i === 0 ? { ...col, articleIds: [...col.articleIds, articleId] } : col,
        )
      })
    },
    [updateColumns],
  )

  const removeArticleFromBoard = useCallback(
    (articleId: string) => {
      updateColumns((prev) =>
        prev.map((col) => ({
          ...col,
          articleIds: col.articleIds.filter((id) => id !== articleId),
        })),
      )
    },
    [updateColumns],
  )

  const moveArticle = useCallback(
    (articleId: string, fromColumnId: string, toColumnId: string, newIndex: number) => {
      updateColumns((prev) =>
        prev.map((col) => {
          if (col.id === fromColumnId && col.id === toColumnId) {
            const ids = col.articleIds.filter((id) => id !== articleId)
            ids.splice(newIndex, 0, articleId)
            return { ...col, articleIds: ids }
          }
          if (col.id === fromColumnId) {
            return { ...col, articleIds: col.articleIds.filter((id) => id !== articleId) }
          }
          if (col.id === toColumnId) {
            const ids = [...col.articleIds]
            ids.splice(newIndex, 0, articleId)
            return { ...col, articleIds: ids }
          }
          return col
        }),
      )
    },
    [updateColumns],
  )

  const addColumn = useCallback(
    (title: string) => {
      const id = `custom-${Date.now()}`
      updateColumns((prev) => [...prev, { id, title, articleIds: [] }])
    },
    [updateColumns],
  )

  const renameColumn = useCallback(
    (columnId: string, title: string) => {
      updateColumns((prev) =>
        prev.map((col) => (col.id === columnId ? { ...col, title } : col)),
      )
    },
    [updateColumns],
  )

  const deleteColumn = useCallback(
    (columnId: string) => {
      updateColumns((prev) => {
        const target = prev.find((col) => col.id === columnId)
        if (!target) return prev
        const movedIds = target.articleIds
        return prev
          .filter((col) => col.id !== columnId)
          .map((col, i) =>
            i === 0 ? { ...col, articleIds: [...col.articleIds, ...movedIds] } : col,
          )
      })
    },
    [updateColumns],
  )

  const findColumnByArticleId = useCallback(
    (articleId: string) => columns.find((col) => col.articleIds.includes(articleId)),
    [columns],
  )

  return {
    columns,
    addArticleToBoard,
    removeArticleFromBoard,
    moveArticle,
    addColumn,
    renameColumn,
    deleteColumn,
    findColumnByArticleId,
  }
}
