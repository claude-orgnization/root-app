import { test, expect } from '@playwright/test'

test.describe('FilterSidebar — タグ・期間・ソートフィルター', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('ページ初期表示: サイドバーと記事一覧が表示される', async ({ page }) => {
    // サイドバーが存在する
    await expect(page.getByRole('complementary')).toBeVisible()
    // フィルターラベルが表示されている
    await expect(page.getByText('フィルター', { exact: true })).toBeVisible()
    await expect(page.getByText('タグ', { exact: true })).toBeVisible()
    await expect(page.getByText('期間', { exact: true })).toBeVisible()
    await expect(page.getByText('並び順', { exact: true })).toBeVisible()
    // 「全期間」がデフォルト選択
    await expect(page.getByRole('radio', { name: '全期間' })).toBeChecked()
    // 「新着順」がデフォルト選択
    await expect(page.getByRole('combobox')).toHaveValue('created')
  })

  test('タグフィルター: AI チェックで絞り込みが反映される', async ({ page }) => {
    const aiCheckbox = page.getByRole('checkbox', { name: 'AI', exact: true })
    // 初期状態は未チェック
    await expect(aiCheckbox).not.toBeChecked()
    // チェックする
    await aiCheckbox.click()
    await expect(aiCheckbox).toBeChecked()
    // リセットボタンが出現する
    await expect(page.getByText('フィルターをリセット')).toBeVisible()
  })

  test('タグフィルター: 複数選択できる', async ({ page }) => {
    await page.getByRole('checkbox', { name: 'LLM' }).click()
    await page.getByRole('checkbox', { name: 'ChatGPT' }).click()
    await expect(page.getByRole('checkbox', { name: 'LLM' })).toBeChecked()
    await expect(page.getByRole('checkbox', { name: 'ChatGPT' })).toBeChecked()
  })

  test('期間フィルター: 今週を選択できる', async ({ page }) => {
    await page.getByRole('radio', { name: '今週' }).click()
    await expect(page.getByRole('radio', { name: '今週' })).toBeChecked()
    await expect(page.getByRole('radio', { name: '全期間' })).not.toBeChecked()
    // リセットボタンが出現する
    await expect(page.getByText('フィルターをリセット')).toBeVisible()
  })

  test('期間フィルター: 今月・3ヶ月以内も選択できる', async ({ page }) => {
    await page.getByRole('radio', { name: '今月' }).click()
    await expect(page.getByRole('radio', { name: '今月' })).toBeChecked()

    await page.getByRole('radio', { name: '3ヶ月以内' }).click()
    await expect(page.getByRole('radio', { name: '3ヶ月以内' })).toBeChecked()
    await expect(page.getByRole('radio', { name: '今月' })).not.toBeChecked()
  })

  test('ソート: いいね数順に切り替えられる', async ({ page }) => {
    await page.getByRole('combobox').selectOption('likes')
    await expect(page.getByRole('combobox')).toHaveValue('likes')
    await expect(page.getByText('フィルターをリセット')).toBeVisible()
  })

  test('フィルターリセット: 全条件がデフォルトに戻る', async ({ page }) => {
    // 複数フィルターを設定
    await page.getByRole('checkbox', { name: 'AI', exact: true }).click()
    await page.getByRole('radio', { name: '今月' }).click()
    await page.getByRole('combobox').selectOption('likes')

    // リセット
    await page.getByText('フィルターをリセット').click()

    // デフォルトに戻っている
    await expect(page.getByRole('checkbox', { name: 'AI', exact: true })).not.toBeChecked()
    await expect(page.getByRole('radio', { name: '全期間' })).toBeChecked()
    await expect(page.getByRole('combobox')).toHaveValue('created')
    // リセットボタンが消える
    await expect(page.getByText('フィルターをリセット')).not.toBeVisible()
  })
})
