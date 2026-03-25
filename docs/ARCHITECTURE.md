# アーキテクチャ設計

## 全体構成
フロントエンドのみのSPA（Single Page Application）。
バックエンドサーバーは持たず、ブラウザから直接Qiita APIを呼び出す。

```
ブラウザ
  └── React SPA (Vite)
        └── Qiita API v2 (外部)
```

## GitHub Pages 公開構成

リポジトリ名: `root-app`

```
username.github.io/root-app/            ← TOPページ（静的HTML、プロジェクト一覧）
username.github.io/root-app/qiita-ai/   ← QiitaAI Watch（今回のアプリ）
username.github.io/root-app/xxx/        ← 将来の別プロジェクト
```

- Vite の `base` は `/root-app/qiita-ai/` に設定
- React Router の `basename` は `/root-app/qiita-ai` に設定
- GitHub Actions でビルド → gh-pagesブランチにデプロイ

---

## コンポーネント設計

```
App
├── Header               # サイト名・ナビゲーション（Board リンク追加）
├── pages/
│   ├── HomePage         # 記事一覧ページ
│   ├── BoardPage        # カンバンボードページ（Phase 2）
│   └── AboutPage        # About静的ページ
└── components/
    ├── ArticleCard      # 記事1件分のカード（♡お気に入りボタン追加）
    ├── ArticleList      # カードのグリッドレイアウト
    ├── FilterSidebar    # タグ・ソース・期間フィルター
    ├── Pagination       # ページネーション
    ├── SkeletonCard     # ローディング用スケルトン
    ├── ErrorMessage     # エラー表示 + リトライボタン
    ├── KanbanBoard      # カンバンボード本体（Phase 2）
    ├── KanbanColumn     # カンバンの列（Phase 2）
    └── KanbanCard       # カンバン用カード（Phase 2）
```

---

## データフロー

```
HomePage
  └── useArticles(フィルター, ソート, ページ)  ← カスタムフック
        └── fetchArticles()                    ← APIユーティリティ
              └── GET /api/v2/items?query=...  ← Qiita API
```

状態管理はReact組み込みの `useState` / `useEffect` で完結させる。
Reduxなどの外部状態管理ライブラリは使用しない。

### カンバンボード データフロー（Phase 2）

```
BoardPage
  └── useKanban()                    ← カンバン状態管理フック
        ├── useFavorites()           ← お気に入り管理フック
        │     └── localStorage       ← qiita-ai-favorites
        └── localStorage             ← qiita-ai-kanban-columns
              └── KanbanBoard
                    ├── KanbanColumn × n（dnd-kit DndContext）
                    │     └── KanbanCard × n（dnd-kit useSortable）
                    └── AddColumnButton
```

### localStorage スキーマ

```typescript
// qiita-ai-favorites: お気に入り記事の配列
FavoriteArticle[] // Article型 + favorited_at

// qiita-ai-kanban-columns: カンバン列定義と配置
KanbanColumn[] // { id, title, articleIds: string[] }
```

---

## 型定義

```typescript
// src/types/qiita.ts
interface QiitaArticle {
  id: string;
  title: string;
  url: string;
  created_at: string;
  likes_count: number;
  tags: { name: string }[];
  user: {
    id: string;
    profile_image_url: string;
  };
}
```

---

## 環境変数

フェーズ1では環境変数は使用しない。
Qiita APIは認証なし（60req/h）で記事取得が可能なため、フロントエンドのみで完結する。

> フェーズ2でAPIキー設定UIを追加する際に `VITE_QIITA_TOKEN` を導入する。

---

## 技術的決定事項

| 決定 | 理由 |
|------|------|
| Vite採用 | Create React Appより高速、現在の標準 |
| axiosを使わずfetch | 依存を減らすため。Qiita APIは単純なGETのみ |
| 外部状態管理なし | ページ間で共有する状態が少なく過剰になるため |
| Tailwind CSS | ユーティリティクラスで素早くUI構築できるため |
| @dnd-kit (Phase 2) | React向けD&Dライブラリ。タッチ対応・アクセシビリティ◎ |
| localStorage (Phase 2) | お気に入り・カンバン状態の永続化。バックエンド不要 |

---

# GitHub Trending Viewer アーキテクチャ

## 全体構成
フロントエンドのみのSPA（Single Page Application）。
バックエンドサーバーは持たず、ブラウザから直接GitHub Search APIを呼び出す。

```
ブラウザ
  └── React SPA (Vite)
        └── GitHub Search API (外部)
```

## GitHub Pages 公開構成

```
username.github.io/root-app/                   ← TOPページ（プロジェクト一覧）
username.github.io/root-app/github-trending/   ← GitHub Trending Viewer
```

- Vite の `base` は `/root-app/github-trending/` に設定
- React Router の `basename` は `/root-app/github-trending` に設定

---

## コンポーネント設計

```
App
├── Header               # サイト名・ナビゲーション
├── pages/
│   ├── HomePage         # リポジトリ一覧ページ
│   └── AboutPage        # About静的ページ
└── components/
    ├── RepoCard         # リポジトリ1件分のカード
    ├── RepoList         # カードのグリッドレイアウト
    ├── FilterBar        # 期間・言語フィルター
    ├── Pagination       # ページネーション
    ├── SkeletonCard     # ローディング用スケルトン
    └── ErrorMessage     # エラー表示 + リトライボタン
```

---

## データフロー

```
HomePage
  └── useTrending(期間, 言語, ページ)  ← カスタムフック
        └── fetchTrendingRepos()       ← APIユーティリティ
              └── GET /search/repositories?q=...  ← GitHub Search API
```

---

## 型定義

```typescript
// src/types/github.ts
interface GitHubRepo {
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

type DateRange = 'today' | 'week' | 'month'
```
