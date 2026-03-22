---
name: add-app-to-deploy
description: 新しいアプリをGitHub Pagesデプロイワークフローに追加する際のチェックリスト付きスキル。過去の失敗（package-lock.json忘れ、ビルドエラー）を防ぐ。
argument-hint: "<app-directory-name>"
allowed-tools: Read, Glob, Grep, Bash, Edit, Write
---

# /add-app-to-deploy — アプリをデプロイワークフローに追加

## 背景（過去の教訓）

新アプリを `.github/workflows/deploy.yml` に追加する際、以下の失敗を繰り返した:

1. **`package-lock.json` が存在しない** → `npm ci` は `package-lock.json` 必須なので即失敗
2. **TypeScript ビルドエラー** → テストファイルの型エラーが残ったまま push し、`tsc -b && vite build` で失敗

**push する前にローカルで検証すれば全て防げた。**

## 実行手順

### 1. 対象アプリの事前検証（push 前に必ず実施）

```bash
# 対象ディレクトリに移動
cd <app-directory>

# package-lock.json の存在確認。なければ生成する
ls package-lock.json || npm install

# 依存関係のクリーンインストール（CI と同じ条件で確認）
rm -rf node_modules
npm ci

# TypeScript 型チェック（ビルドと同じコマンドで確認）
npx tsc -b

# ビルド実行
npm run build
```

上記が全て通ることを確認してから次に進む。1つでも失敗したらその場で修正する。

### 2. ワークフロー編集（`.github/workflows/deploy.yml`）

以下の3箇所を追加:

#### a. cache-dependency-path
```yaml
cache-dependency-path: |
  qiita-ai/package-lock.json
  puzzle-app/package-lock.json
  <app-name>/package-lock.json  # ← 追加
```

#### b. Install & Build ステップ
```yaml
- name: Install <app-name> dependencies
  working-directory: <app-name>
  run: npm ci

- name: Build <app-name>
  working-directory: <app-name>
  run: npm run build
```

#### c. Prepare deploy directory
```yaml
mkdir -p deploy/<app-name>
cp -r <app-name>/dist/. deploy/<app-name>/
```

### 3. コミット対象の確認

```bash
git status
```

以下が含まれていることを確認:
- `.github/workflows/deploy.yml` の変更
- `<app-name>/package-lock.json`（新規追加の場合）

### 4. コミット & プッシュ

全ての検証が通った後にのみプッシュする。
