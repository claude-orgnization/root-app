# Qiita API v2 仕様メモ

## ベースURL
```
https://qiita.com/api/v2
```

## 認証
- **未認証**: 60リクエスト/時間
- **認証済み**: 500リクエスト/時間
  - ヘッダーに `Authorization: Bearer <TOKEN>` を付与

---

## 使用エンドポイント

### 記事一覧取得
```
GET /items
```

#### クエリパラメータ
| パラメータ | 型 | 説明 |
|-----------|-----|------|
| `page` | integer | ページ番号（1〜100） |
| `per_page` | integer | 1ページの件数（1〜100、デフォルト20） |
| `query` | string | 検索クエリ |

#### queryの書き方
```
# タグ検索
tag:AI tag:LLM

# 複数タグのOR検索（スペース区切り）
tag:AI OR tag:機械学習

# 本プロジェクトで使うクエリ例
tag:AI OR tag:機械学習 OR tag:LLM OR tag:ChatGPT OR tag:DeepLearning OR tag:OpenAI OR tag:RAG OR tag:生成AI
```

#### レスポンス例
```json
[
  {
    "id": "xxxxxxxxxx",
    "title": "記事タイトル",
    "url": "https://qiita.com/user/items/xxxxxxxxxx",
    "created_at": "2024-01-01T00:00:00+09:00",
    "updated_at": "2024-01-02T00:00:00+09:00",
    "likes_count": 42,
    "tags": [
      { "name": "AI", "versions": [] },
      { "name": "LLM", "versions": [] }
    ],
    "user": {
      "id": "username",
      "name": "表示名",
      "profile_image_url": "https://..."
    },
    "body": "マークダウン本文（今回は使用しない）",
    "rendered_body": "HTML本文（今回は使用しない）"
  }
]
```

#### レスポンスヘッダー
```
Total-Count: 1234   # 総件数（ページネーションに使用）
```

---

## エラーハンドリング

| ステータスコード | 意味 | 対処 |
|----------------|------|------|
| 200 | 成功 | — |
| 400 | クエリ不正 | クエリを見直す |
| 401 | 認証エラー | トークンを確認 |
| 403 | レート制限超過 | 待機してリトライ |
| 500 | サーバーエラー | リトライ |

---

## CORS
Qiita APIはブラウザからの直接アクセス（CORS）を許可している。
プロキシサーバーは不要。
