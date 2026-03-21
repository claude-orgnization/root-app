---
name: task-breakdown
description: 仕様書とアーキテクチャから実装タスクを細かく分解し、優先順位と依存関係を整理するスキル。
argument-hint: "<対象機能名>"
allowed-tools: Read, Glob, Grep, TodoWrite, AskUserQuestion
---

# /task-breakdown — タスク分解スキル

## 説明
仕様書とアーキテクチャから、実装タスクを細かく分解するスキル。

## 使い方
```
/task-breakdown          # 仕様全体からタスクを分解
/task-breakdown "認証機能" # 特定機能のタスクを分解
```

## 実行手順

1. **入力の確認**:
   - `docs/SPEC.md` の該当仕様を読み込む
   - `docs/ARCHITECTURE.md` の設計を読み込む

2. **タスク分解**:
   - 型定義の作成
   - カスタムフックの実装
   - コンポーネントの実装
   - テストの作成
   - 結合・動作確認
   の順序でタスクを分解する

3. **依存関係の整理**:
   - 各タスクの前提タスクを明示する
   - 並行実行可能なタスクを特定する

4. **見積もり**:
   - S（〜30分）/ M（〜1時間）/ L（1時間〜）で見積もる

5. **TodoList作成**: TodoWrite ツールでタスクリストを作成する。

## 出力フォーマット
```
1. [S] 型定義: Article インターフェースを作成 (依存: なし)
2. [M] Hook: useArticles カスタムフックを実装 (依存: 1)
3. [M] Component: ArticleList コンポーネントを実装 (依存: 1, 2)
4. [S] Test: useArticles のテストを作成 (依存: 1)
5. [S] Test: ArticleList のテストを作成 (依存: 1)
```
