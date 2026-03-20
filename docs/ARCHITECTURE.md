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
├── Header               # サイト名・ナビゲーション
├── pages/
│   ├── HomePage         # 記事一覧ページ
│   └── AboutPage        # About静的ページ
└── components/
    ├── ArticleCard      # 記事1件分のカード
    ├── ArticleList      # カードのグリッドレイアウト
    ├── FilterBar        # タグフィルター + ソート選択
    ├── Pagination       # ページネーション
    ├── SkeletonCard     # ローディング用スケルトン
    └── ErrorMessage     # エラー表示 + リトライボタン
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
