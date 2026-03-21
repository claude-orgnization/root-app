export type ArticleSource = 'qiita' | 'zenn'
export type SourceFilter = 'all' | 'qiita' | 'zenn'

export interface Article {
  id: string
  title: string
  url: string
  created_at: string
  likes_count: number
  tags: string[]
  source: ArticleSource
  author: {
    name: string
    avatar_url: string
  }
}
