import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RepoCard } from './RepoCard'
import type { GitHubRepo } from '../types/github'

const mockRepo: GitHubRepo = {
  id: 1,
  name: 'awesome-repo',
  full_name: 'user/awesome-repo',
  html_url: 'https://github.com/user/awesome-repo',
  description: 'An awesome repository',
  stargazers_count: 1500,
  forks_count: 100,
  language: 'TypeScript',
  created_at: '2024-03-20T00:00:00Z',
  owner: { login: 'user', avatar_url: 'https://example.com/avatar.png' },
}

describe('RepoCard', () => {
  it('リポジトリ名を表示する', () => {
    render(<RepoCard repo={mockRepo} />)
    expect(screen.getByText('user/awesome-repo')).toBeInTheDocument()
  })

  it('descriptionを表示する', () => {
    render(<RepoCard repo={mockRepo} />)
    expect(screen.getByText('An awesome repository')).toBeInTheDocument()
  })

  it('Star数を表示する', () => {
    render(<RepoCard repo={mockRepo} />)
    expect(screen.getByText('1.5k')).toBeInTheDocument()
  })

  it('Fork数を表示する', () => {
    render(<RepoCard repo={mockRepo} />)
    expect(screen.getByText('100')).toBeInTheDocument()
  })

  it('言語バッジを表示する', () => {
    render(<RepoCard repo={mockRepo} />)
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
  })

  it('GitHubへのリンクを持つ', () => {
    render(<RepoCard repo={mockRepo} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', 'https://github.com/user/awesome-repo')
  })

  it('descriptionがnullの場合も表示できる', () => {
    render(<RepoCard repo={{ ...mockRepo, description: null }} />)
    expect(screen.queryByText('An awesome repository')).not.toBeInTheDocument()
  })
})
