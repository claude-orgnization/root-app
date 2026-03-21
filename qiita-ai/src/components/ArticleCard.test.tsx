import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ArticleCard } from './ArticleCard'
import type { Article } from '../types/article'

const qiitaArticle: Article = {
  id: 'qiita-1',
  title: 'Qiita テスト記事',
  url: 'https://qiita.com/testuser/items/qiita1',
  created_at: '2024-06-15T12:00:00Z',
  likes_count: 42,
  tags: ['AI', 'LLM', 'ChatGPT'],
  source: 'qiita',
  author: {
    name: 'testuser',
    avatar_url: 'https://example.com/avatar.png',
  },
}

const zennArticle: Article = {
  ...qiitaArticle,
  id: 'zenn-1',
  title: 'Zenn テスト記事',
  url: 'https://zenn.dev/zennuser/articles/zenn1',
  source: 'zenn',
  author: { name: 'zennuser', avatar_url: 'https://example.com/zenn-avatar.png' },
}

describe('ArticleCard', () => {
  it('記事タイトルが表示される', () => {
    render(<ArticleCard article={qiitaArticle} />)
    expect(screen.getByText('Qiita テスト記事')).toBeInTheDocument()
  })

  it('記事 URL がリンクに設定される', () => {
    render(<ArticleCard article={qiitaArticle} />)
    const link = screen.getByRole('link', { name: 'Qiita テスト記事' })
    expect(link).toHaveAttribute('href', 'https://qiita.com/testuser/items/qiita1')
  })

  it('リンクが新しいタブで開く', () => {
    render(<ArticleCard article={qiitaArticle} />)
    const link = screen.getByRole('link', { name: 'Qiita テスト記事' })
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('著者名が表示される', () => {
    render(<ArticleCard article={qiitaArticle} />)
    expect(screen.getByText('testuser')).toBeInTheDocument()
  })

  it('いいね数が表示される', () => {
    render(<ArticleCard article={qiitaArticle} />)
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('タグが表示される（最大5件）', () => {
    render(<ArticleCard article={qiitaArticle} />)
    expect(screen.getByText('AI')).toBeInTheDocument()
    expect(screen.getByText('LLM')).toBeInTheDocument()
    expect(screen.getByText('ChatGPT')).toBeInTheDocument()
  })

  it('タグが6件以上あっても最大5件しか表示しない', () => {
    const articleWithManyTags: Article = {
      ...qiitaArticle,
      tags: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'],
    }
    render(<ArticleCard article={articleWithManyTags} />)
    expect(screen.getByText('T1')).toBeInTheDocument()
    expect(screen.getByText('T5')).toBeInTheDocument()
    expect(screen.queryByText('T6')).not.toBeInTheDocument()
  })

  it('Qiita ソースのとき "Qiita" バッジが表示される', () => {
    render(<ArticleCard article={qiitaArticle} />)
    expect(screen.getByText('Qiita')).toBeInTheDocument()
  })

  it('Zenn ソースのとき "Zenn" バッジが表示される', () => {
    render(<ArticleCard article={zennArticle} />)
    expect(screen.getByText('Zenn')).toBeInTheDocument()
  })

  it('著者アバター画像が表示される', () => {
    render(<ArticleCard article={qiitaArticle} />)
    const avatar = screen.getByAltText('testuser')
    expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.png')
  })
})
