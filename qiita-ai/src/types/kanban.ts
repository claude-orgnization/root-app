import type { Article } from './article'

export interface FavoriteArticle extends Article {
  favorited_at: string
}

export interface KanbanColumn {
  id: string
  title: string
  articleIds: string[]
}

export const DEFAULT_COLUMNS: KanbanColumn[] = [
  { id: 'unread', title: '未読', articleIds: [] },
  { id: 'reading', title: '読書中', articleIds: [] },
  { id: 'done', title: '読了', articleIds: [] },
]

export const FAVORITES_STORAGE_KEY = 'qiita-ai-favorites'
export const COLUMNS_STORAGE_KEY = 'qiita-ai-kanban-columns'
