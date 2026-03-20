import type { QiitaArticle } from '../types/qiita'
import { ArticleCard } from './ArticleCard'
import { SkeletonCard } from './SkeletonCard'

interface Props {
  articles: QiitaArticle[]
  loading: boolean
}

export function ArticleList({ articles, loading }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (articles.length === 0) {
    return (
      <p className="text-center text-gray-500 dark:text-gray-400 py-16">
        記事が見つかりませんでした
      </p>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  )
}
