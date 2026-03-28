import { useCallback, useEffect, useSyncExternalStore } from 'react'
import type { Article } from '../types/article'
import type { FavoriteArticle } from '../types/kanban'
import { FAVORITES_STORAGE_KEY } from '../types/kanban'
import { loadJson, saveJson, persistJson, restoreFromIdb } from '../utils/storage'

type Listener = () => void

let cache: FavoriteArticle[] | null = null
const listeners = new Set<Listener>()

function notify(): void {
  listeners.forEach((l) => l())
}

function getSnapshot(): FavoriteArticle[] {
  if (cache === null) {
    cache = loadJson<FavoriteArticle[]>(FAVORITES_STORAGE_KEY, [])
  }
  return cache
}

function subscribe(listener: Listener): () => void {
  listeners.add(listener)

  const onStorage = (e: StorageEvent) => {
    if (e.key === FAVORITES_STORAGE_KEY) {
      cache = null
      notify()
    }
  }
  window.addEventListener('storage', onStorage)

  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}

function writeFavorites(next: FavoriteArticle[]): void {
  saveJson(FAVORITES_STORAGE_KEY, next)
  cache = next
  notify()
  // IndexedDB にも非同期で永続化
  persistJson(FAVORITES_STORAGE_KEY, next)
}

export function useFavorites() {
  const favorites = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)

  // 起動時に IndexedDB から復元 (localStorage が消えていた場合)
  useEffect(() => {
    let cancelled = false
    restoreFromIdb<FavoriteArticle[]>(FAVORITES_STORAGE_KEY, []).then((restored) => {
      if (cancelled) return
      if (restored.length > 0 && getSnapshot().length === 0) {
        cache = restored
        saveJson(FAVORITES_STORAGE_KEY, restored)
        notify()
      }
    })
    return () => { cancelled = true }
  }, [])

  const isFavorite = useCallback(
    (articleId: string) => favorites.some((f) => f.id === articleId),
    [favorites],
  )

  const toggleFavorite = useCallback(
    (article: Article) => {
      const current = getSnapshot()
      const exists = current.some((f) => f.id === article.id)
      const next = exists
        ? current.filter((f) => f.id !== article.id)
        : [...current, { ...article, favorited_at: new Date().toISOString() }]
      writeFavorites(next)
    },
    [],
  )

  const removeFavorite = useCallback((articleId: string) => {
    const current = getSnapshot()
    writeFavorites(current.filter((f) => f.id !== articleId))
  }, [])

  const getFavorite = useCallback(
    (articleId: string) => favorites.find((f) => f.id === articleId),
    [favorites],
  )

  return { favorites, isFavorite, toggleFavorite, removeFavorite, getFavorite }
}
