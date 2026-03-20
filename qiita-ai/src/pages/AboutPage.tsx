export function AboutPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">About</h1>
      <div className="prose dark:prose-invert text-gray-700 dark:text-gray-300 leading-relaxed flex flex-col gap-4">
        <p>
          <strong>QiitaAI Watch</strong> は、Qiita上のAI・機械学習関連記事を自動で収集・一覧表示するサービスです。
        </p>
        <p>
          LLM、ChatGPT、RAG、生成AI など話題のトピックをタグでフィルタリングしたり、
          新着順・いいね数順で並び替えることができます。
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          記事データは <a href="https://qiita.com/api/v2/docs" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">Qiita API v2</a> を使用して取得しています。
        </p>
      </div>
    </main>
  )
}
