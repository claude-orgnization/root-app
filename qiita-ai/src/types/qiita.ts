export interface QiitaUser {
  id: string
  name: string
  profile_image_url: string
}

export interface QiitaArticle {
  id: string
  title: string
  url: string
  created_at: string
  likes_count: number
  tags: { name: string; versions: string[] }[]
  user: QiitaUser
}

export type SortOrder = 'created' | 'likes'
export type DateRange = 'all' | 'week' | 'month' | '3months'
