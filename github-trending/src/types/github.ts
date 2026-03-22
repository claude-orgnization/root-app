export interface GitHubRepo {
  id: number
  name: string
  full_name: string
  html_url: string
  description: string | null
  stargazers_count: number
  forks_count: number
  language: string | null
  created_at: string
  owner: {
    login: string
    avatar_url: string
  }
}

export type DateRange = 'today' | 'week' | 'month'
