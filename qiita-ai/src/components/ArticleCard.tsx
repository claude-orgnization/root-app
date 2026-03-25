import type { Article } from '../types/article'
import { formatDate } from '../utils/date'

interface Props {
  article: Article
  isFavorite?: boolean
  onToggleFavorite?: (article: Article) => void
}

const SOURCE_BADGE: Record<Article['source'], { label: string; className: string }> = {
  qiita: {
    label: 'Qiita',
    className: 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  },
  zenn: {
    label: 'Zenn',
    className: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  },
}

export function ArticleCard({ article, isFavorite = false, onToggleFavorite }: Props) {
  const badge = SOURCE_BADGE[article.source]

  return (
    <article className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-base font-semibold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 leading-snug"
        >
          {article.title}
        </a>
        <span
          className={`text-xs px-2 py-0.5 rounded shrink-0 font-medium ${badge.className}`}
        >
          {badge.label}
        </span>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <img
          src={article.author.avatar_url}
          alt={article.author.name}
          className="w-5 h-5 rounded-full"
        />
        <span>{article.author.name}</span>
        <span>·</span>
        <span>{formatDate(article.created_at)}</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {article.tags.slice(0, 5).map((tag) => (
            <span
              key={tag}
              className="text-xs bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {onToggleFavorite && (
            <button
              onClick={() => onToggleFavorite(article)}
              aria-label={isFavorite ? 'お気に入りから削除' : 'お気に入りに追加'}
              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <svg
                className={`w-5 h-5 ${isFavorite ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                fill={isFavorite ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </button>
          )}
          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
            <svg className="w-4 h-4 text-rose-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
            </svg>
            <span>{article.likes_count}</span>
          </div>
        </div>
      </div>
    </article>
  )
}
