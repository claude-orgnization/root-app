import { useCallback } from 'react'
import { useFavorites } from '../hooks/useFavorites'
import { useKanban } from '../hooks/useKanban'
import { KanbanBoard } from '../components/KanbanBoard'

export function BoardPage() {
  const { favorites, removeFavorite } = useFavorites()
  const {
    columns,
    moveArticle,
    addColumn,
    renameColumn,
    deleteColumn,
    removeArticleFromBoard,
  } = useKanban()

  const handleRemoveArticle = useCallback(
    (articleId: string) => {
      removeFavorite(articleId)
      removeArticleFromBoard(articleId)
    },
    [removeFavorite, removeArticleFromBoard],
  )

  return (
    <main className="max-w-full mx-auto px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-900 dark:text-white">
          カンバンボード
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {favorites.length} 件のお気に入り記事
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 dark:text-gray-400 mb-2">
            お気に入りの記事がありません
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            ホーム画面で記事の★ボタンをクリックして、お気に入りに追加しましょう
          </p>
        </div>
      ) : (
        <KanbanBoard
          columns={columns}
          favorites={favorites}
          onMoveArticle={moveArticle}
          onAddColumn={addColumn}
          onRenameColumn={renameColumn}
          onDeleteColumn={deleteColumn}
          onRemoveArticle={handleRemoveArticle}
        />
      )}
    </main>
  )
}
