import type { QiitaArticle } from '../types/qiita'
import { formatDate } from '../utils/date'

interface Props {
  article: QiitaArticle
}

export function ArticleCard({ article }: Props) {
  return (
    <article className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-base font-semibold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 leading-snug"
      >
        {article.title}
      </a>

      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <img
          src={article.user.profile_image_url}
          alt={article.user.id}
          className="w-5 h-5 rounded-full"
        />
        <span>{article.user.id}</span>
        <span>·</span>
        <span>{formatDate(article.created_at)}</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {article.tags.slice(0, 5).map((tag) => (
            <span
              key={tag.name}
              className="text-xs bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded"
            >
              {tag.name}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 shrink-0">
          <svg className="w-4 h-4 text-rose-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
          </svg>
          <span>{article.likes_count}</span>
        </div>
      </div>
    </article>
  )
}
