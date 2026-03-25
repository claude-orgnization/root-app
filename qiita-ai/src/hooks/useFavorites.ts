import { useState, useCallback } from 'react'
import type { Article } from '../types/article'
import type { FavoriteArticle } from '../types/kanban'
import { FAVORITES_STORAGE_KEY } from '../types/kanban'

function loadFavorites(): FavoriteArticle[] {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY)
    return raw ? (JSON.parse(raw) as FavoriteArticle[]) : []
  } catch {
    return []
  }
}

function saveFavorites(favorites: FavoriteArticle[]): void {
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites))
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteArticle[]>(loadFavorites)

  const isFavorite = useCallback(
    (articleId: string) => favorites.some((f) => f.id === articleId),
    [favorites],
  )

  const toggleFavorite = useCallback(
    (article: Article) => {
      setFavorites((prev) => {
        const exists = prev.some((f) => f.id === article.id)
        const next = exists
          ? prev.filter((f) => f.id !== article.id)
          : [...prev, { ...article, favorited_at: new Date().toISOString() }]
        saveFavorites(next)
        return next
      })
    },
    [],
  )

  const removeFavorite = useCallback((articleId: string) => {
    setFavorites((prev) => {
      const next = prev.filter((f) => f.id !== articleId)
      saveFavorites(next)
      return next
    })
  }, [])

  const getFavorite = useCallback(
    (articleId: string) => favorites.find((f) => f.id === articleId),
    [favorites],
  )

  return { favorites, isFavorite, toggleFavorite, removeFavorite, getFavorite }
}
