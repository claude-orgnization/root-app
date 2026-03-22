import type { GitHubRepo } from '../types/github'
import { formatDate, formatStarCount } from '../utils/date'

interface Props {
  repo: GitHubRepo
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  JavaScript: 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
  Python: 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  Go: 'bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300',
  Rust: 'bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
  Java: 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300',
}

const DEFAULT_LANG_COLOR = 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'

export function RepoCard({ repo }: Props) {
  const langColor = repo.language ? (LANGUAGE_COLORS[repo.language] ?? DEFAULT_LANG_COLOR) : DEFAULT_LANG_COLOR

  return (
    <article className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <img
          src={repo.owner.avatar_url}
          alt={repo.owner.login}
          className="w-8 h-8 rounded-full shrink-0"
        />
        <div className="flex-1 min-w-0">
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-base font-semibold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 leading-snug break-all"
          >
            {repo.full_name}
          </a>
        </div>
      </div>

      {repo.description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2">
          {repo.description}
        </p>
      )}

      <div className="flex items-center justify-between flex-wrap gap-2 mt-auto">
        <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {formatStarCount(repo.stargazers_count)}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
              <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z" />
            </svg>
            {formatStarCount(repo.forks_count)}
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500">{formatDate(repo.created_at)}</span>
        </div>
        {repo.language && (
          <span className={`text-xs px-2 py-0.5 rounded font-medium ${langColor}`}>
            {repo.language}
          </span>
        )}
      </div>
    </article>
  )
}
