import type { GitHubRepo } from '../types/github'
import { RepoCard } from './RepoCard'
import { SkeletonCard } from './SkeletonCard'

interface Props {
  repos: GitHubRepo[]
  loading: boolean
}

export function RepoList({ repos, loading }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (repos.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500 dark:text-gray-400">
        リポジトリが見つかりませんでした
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {repos.map((repo) => (
        <RepoCard key={repo.id} repo={repo} />
      ))}
    </div>
  )
}
