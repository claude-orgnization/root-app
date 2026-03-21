import type { Article } from '../types/article'
import type { SortOrder } from '../types/qiita'
import { ZENN_TOPIC_MAP, DEFAULT_ZENN_TOPICS } from '../constants/tags'

const BASE_URL = 'https://zenn.dev/api'
const COUNT = 20

interface ZennUser {
  username: string
  name: string
  avatar_small_url: string
}

interface ZennTopic {
  name: string
  display_name: string
}

interface ZennArticleRaw {
  id: number
  title: string
  slug: string
  published_at: string
  liked_count: number
  user: ZennUser
  topics: ZennTopic[]
}

interface ZennResponse {
  articles: ZennArticleRaw[]
  next_page: number | null
}

function toArticle(a: ZennArticleRaw): Article {
  return {
    id: `zenn-${a.id}`,
    title: a.title,
    url: `https://zenn.dev/${a.user.username}/articles/${a.slug}`,
    created_at: a.published_at,
    likes_count: a.liked_count,
    tags: a.topics.map((t) => t.display_name),
    source: 'zenn',
    author: {
      name: a.user.name || a.user.username,
      avatar_url: a.user.avatar_small_url,
    },
  }
}

export async function fetchZennArticles({
  tags,
  sort,
  page,
}: {
  tags: string[]
  sort: SortOrder
  page: number
}): Promise<{ articles: Article[]; totalCount: number }> {
  const topics =
    tags.length > 0
      ? tags.map((tag) => ZENN_TOPIC_MAP[tag]).filter(Boolean)
      : DEFAULT_ZENN_TOPICS

  if (topics.length === 0) {
    return { articles: [], totalCount: 0 }
  }

  const order = sort === 'likes' ? 'trending' : 'latest'

  const results = await Promise.allSettled(
    topics.map((topic) =>
      fetch(
        `${BASE_URL}/articles?topicname=${topic}&order=${order}&page=${page}`
      ).then((res) => {
        if (!res.ok) throw new Error(`Zenn API エラー: ${res.status}`)
        return res.json() as Promise<ZennResponse>
      })
    )
  )

  const fulfilledResults = results.filter(
    (r): r is PromiseFulfilledResult<ZennResponse> => r.status === 'fulfilled'
  )

  if (fulfilledResults.length === 0 && results.length > 0) {
    const firstErr = (results[0] as PromiseRejectedResult).reason as Error
    console.error('[Zenn] all topic requests failed:', firstErr)
    if (firstErr instanceof TypeError) {
      throw new Error('Zenn APIへの接続に失敗しました（ネットワークエラーまたはCORS制限）。Zennタブの代わりに「すべて」または「Qiita」をお試しください。')
    }
    throw new Error(firstErr.message ?? 'Zenn API request failed')
  }

  const rejectedCount = results.length - fulfilledResults.length
  if (rejectedCount > 0) {
    console.warn(`[Zenn] ${rejectedCount}/${results.length} topic requests failed`)
  }

  const seen = new Set<number>()
  const articles: Article[] = []
  let hasNextPage = false

  for (const result of fulfilledResults) {
    if (result.value.next_page !== null) hasNextPage = true
    for (const a of result.value.articles) {
      if (!seen.has(a.id)) {
        seen.add(a.id)
        articles.push(toArticle(a))
      }
    }
  }

  if (sort === 'likes') {
    articles.sort((a, b) => b.likes_count - a.likes_count)
  } else {
    articles.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  }

  const totalCount = hasNextPage ? (page + 1) * COUNT : page * COUNT

  return { articles, totalCount }
}
