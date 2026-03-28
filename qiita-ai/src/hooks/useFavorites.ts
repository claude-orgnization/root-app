import { useCallback, useSyncExternalStore } from 'react'
import type { Article } from '../types/article'
import type { FavoriteArticle } from '../types/kanban'
import { FAVORITES_STORAGE_KEY } from '../types/kanban'
import { loadJson, saveJson } from '../utils/storage'

type Listener = () => void

let cache: FavoriteArticle[] | null = null
const listeners = new Set<Listener>()

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
      listeners.forEach((l) => l())
    }
  }
  window.addEventListener('storage', onStorage)

  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}

function writeFavorites(next: FavoriteArticle[]): boolean {
  const ok = saveJson(FAVORITES_STORAGE_KEY, next)
  if (ok) {
    cache = next
  }
  return ok
}

export function useFavorites() {
  const favorites = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)

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
