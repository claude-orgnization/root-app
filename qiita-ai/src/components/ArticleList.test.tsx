import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ArticleList } from './ArticleList'
import type { Article } from '../types/article'

const mockArticle: Article = {
  id: 'qiita-1',
  title: 'テスト記事',
  url: 'https://qiita.com/test',
  created_at: '2024-01-15T12:00:00Z',
  likes_count: 10,
  tags: ['AI'],
  source: 'qiita',
  author: { name: 'testuser', avatar_url: 'https://example.com/avatar.png' },
}

describe('ArticleList', () => {
  it('loading=true のときスケルトンカードが表示される', () => {
    const { container } = render(<ArticleList articles={[]} loading={true} />)
    // スケルトンカードは6枚表示される
    const skeletons = container.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('loading=false かつ articles が空のとき「記事が見つかりませんでした」が表示される', () => {
    render(<ArticleList articles={[]} loading={false} />)
    expect(screen.getByText('記事が見つかりませんでした')).toBeInTheDocument()
  })

  it('記事一覧が表示される', () => {
    render(<ArticleList articles={[mockArticle]} loading={false} />)
    expect(screen.getByText('テスト記事')).toBeInTheDocument()
  })

  it('複数の記事がすべて表示される', () => {
    const articles: Article[] = [
      { ...mockArticle, id: 'qiita-1', title: '記事1' },
      { ...mockArticle, id: 'qiita-2', title: '記事2' },
      { ...mockArticle, id: 'qiita-3', title: '記事3' },
    ]
    render(<ArticleList articles={articles} loading={false} />)
    expect(screen.getByText('記事1')).toBeInTheDocument()
    expect(screen.getByText('記事2')).toBeInTheDocument()
    expect(screen.getByText('記事3')).toBeInTheDocument()
  })
})
