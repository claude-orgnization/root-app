import { useCallback, useSyncExternalStore } from 'react'
import type { KanbanColumn } from '../types/kanban'
import { DEFAULT_COLUMNS, COLUMNS_STORAGE_KEY } from '../types/kanban'
import { loadJson, saveJson } from '../utils/storage'

type Listener = () => void

let cache: KanbanColumn[] | null = null
const listeners = new Set<Listener>()

function getSnapshot(): KanbanColumn[] {
  if (cache === null) {
    cache = loadJson<KanbanColumn[]>(COLUMNS_STORAGE_KEY, DEFAULT_COLUMNS)
  }
  return cache
}

function subscribe(listener: Listener): () => void {
  listeners.add(listener)

  const onStorage = (e: StorageEvent) => {
    if (e.key === COLUMNS_STORAGE_KEY) {
      cache = null
      listeners.forEach((l) => l())
    }
  }
  window.addEventListener('storage', onStorage)

  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}

function setColumns(next: KanbanColumn[]): void {
  saveJson(COLUMNS_STORAGE_KEY, next)
  cache = next
  listeners.forEach((l) => l())
}

function updateColumns(updater: (prev: KanbanColumn[]) => KanbanColumn[]): void {
  const next = updater(getSnapshot())
  setColumns(next)
}

export function useKanban() {
  const columns = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)

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
    [],
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
    [],
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
    [],
  )

  const addColumn = useCallback(
    (title: string) => {
      const id = `custom-${Date.now()}`
      updateColumns((prev) => [...prev, { id, title, articleIds: [] }])
    },
    [],
  )

  const renameColumn = useCallback(
    (columnId: string, title: string) => {
      updateColumns((prev) =>
        prev.map((col) => (col.id === columnId ? { ...col, title } : col)),
      )
    },
    [],
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
    [],
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
