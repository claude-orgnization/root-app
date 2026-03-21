import { test, expect } from '@playwright/test'

const MOCK_ZENN_ARTICLES = {
  articles: [
    {
      id: 1001,
      title: 'LLMを使った実践的な開発入門',
      slug: 'llm-practical-guide',
      published_at: '2026-03-01T10:00:00.000+09:00',
      liked_count: 150,
      user: {
        username: 'zenn_user1',
        name: 'Zenn Author One',
        avatar_small_url: 'https://storage.googleapis.com/zenn-user-upload/avatar/sample1.jpeg',
      },
      topics: [{ name: 'llm', display_name: 'LLM' }],
    },
    {
      id: 1002,
      title: 'ChatGPTを活用した生産性向上テクニック',
      slug: 'chatgpt-productivity',
      published_at: '2026-03-02T12:00:00.000+09:00',
      liked_count: 230,
      user: {
        username: 'zenn_user2',
        name: 'Zenn Author Two',
        avatar_small_url: 'https://storage.googleapis.com/zenn-user-upload/avatar/sample2.jpeg',
      },
      topics: [{ name: 'chatgpt', display_name: 'ChatGPT' }],
    },
  ],
  next_page: null,
}

test.describe('Zenn記事の表示', () => {
  test.beforeEach(async ({ page }) => {
    // Zenn API をモック
    await page.route('https://zenn.dev/api/articles**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_ZENN_ARTICLES),
      })
    })

    await page.goto('/')
  })

  test('Zennソースを選択するとZenn記事が表示される', async ({ page }) => {
    // Zenn ラジオボタンを選択
    await page.getByRole('radio', { name: 'Zenn' }).click()
    await expect(page.getByRole('radio', { name: 'Zenn' })).toBeChecked()

    // Zenn 記事のタイトルが表示される
    await expect(page.getByText('LLMを使った実践的な開発入門')).toBeVisible()
    await expect(page.getByText('ChatGPTを活用した生産性向上テクニック')).toBeVisible()
  })

  test('Zenn記事のリンクが正しいURL形式になっている', async ({ page }) => {
    await page.getByRole('radio', { name: 'Zenn' }).click()

    const articleLink = page.getByRole('link', { name: 'LLMを使った実践的な開発入門' })
    await expect(articleLink).toBeVisible()
    await expect(articleLink).toHaveAttribute(
      'href',
      'https://zenn.dev/zenn_user1/articles/llm-practical-guide'
    )
  })

  test('「すべて」表示でZenn記事とQiita記事が混在して表示される', async ({ page }) => {
    // Qiita API もモック
    await page.route('https://qiita.com/api/v2/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        headers: { 'Total-Count': '1' },
        body: JSON.stringify([
          {
            id: 'qiita_001',
            title: 'Qiita AI記事サンプル',
            url: 'https://qiita.com/sample/items/001',
            created_at: '2026-03-03T09:00:00+09:00',
            likes_count: 50,
            tags: [{ name: 'AI', versions: [] }],
            user: {
              id: 'qiita_user1',
              name: 'Qiita Author',
              profile_image_url: 'https://example.com/avatar.png',
            },
          },
        ]),
      })
    })

    // デフォルトは「すべて」
    await expect(page.getByRole('radio', { name: 'すべて' })).toBeChecked()

    // 両方の記事が表示される
    await expect(page.getByText('LLMを使った実践的な開発入門')).toBeVisible()
    await expect(page.getByText('Qiita AI記事サンプル')).toBeVisible()
  })

  test('Zenn APIエラー時にZennのみモードでエラーが表示される', async ({ page }) => {
    // エラーレスポンスを返すようにルートを上書き
    await page.route('https://zenn.dev/api/articles**', async (route) => {
      await route.fulfill({ status: 500 })
    })

    await page.getByRole('radio', { name: 'Zenn' }).click()

    // エラーメッセージが表示される
    await expect(page.getByText(/エラー|Error|失敗/i)).toBeVisible({ timeout: 10000 })
  })

  test('Zenn記事のいいね数が表示される', async ({ page }) => {
    await page.getByRole('radio', { name: 'Zenn' }).click()

    // いいね数が表示されている
    await expect(page.getByText('150')).toBeVisible()
    await expect(page.getByText('230')).toBeVisible()
  })
})
