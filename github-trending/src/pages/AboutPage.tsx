export function AboutPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">About</h1>
      <div className="prose dark:prose-invert">
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
          <strong>GitHub Trending Viewer</strong> は、GitHub Search API を使ってトレンドのリポジトリを表示するWebアプリです。
        </p>
        <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
          <li>期間フィルター（今日 / 今週 / 今月）でトレンドを絞り込み</li>
          <li>プログラミング言語フィルターで言語別トレンドを表示</li>
          <li>フロントエンドのみで動作（サーバーレス）</li>
          <li>GitHub Search API を認証なしで使用（60リクエスト/時間）</li>
        </ul>
      </div>
    </main>
  )
}
