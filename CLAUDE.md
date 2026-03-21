# CLAUDE.md — Claude Code 開発ガイド

## プロジェクト概要
Qiita APIを使ってAI関連記事を自動収集・表示するWebアプリ。

## 技術スタック
- **フロントエンド**: React + TypeScript + Vite
- **スタイリング**: Tailwind CSS v3
- **データ取得**: Qiita API v2（fetch使用、axiosは使わない）
- **パッケージマネージャ**: npm

## ディレクトリ構成
```
src/
├── components/    # UIコンポーネント
├── hooks/         # カスタムフック（API呼び出し含む）
├── types/         # TypeScript型定義
├── utils/         # ユーティリティ関数
└── constants/     # 定数（タグ一覧など）
```

## 開発ルール
- コンポーネントは関数コンポーネント + React hooks のみ使用
- `any` 型は禁止。型定義は `src/types/` に集約する
- フェーズ1はAPIキー不要（Qiita公開APIを直接使用）。フェーズ2でAPIキー対応予定
- CSSはTailwindのユーティリティクラスのみ使用（インラインstyleは使わない）
- ファイル名: コンポーネントはPascalCase、それ以外はcamelCase

## 実装の優先順位
仕様書（`docs/SPEC.md`）の「フェーズ1」→「フェーズ2」の順に実装する。
仕様に変更が生じた場合はコードを変更する前に `docs/SPEC.md` を更新する。

## カスタム開発エージェント

業務開発の全フローを自動化するエージェント群とスキルを用意している。

### エージェント（`.claude/agents/`）
- `dev-flow.md` — 全体オーケストレーター（仕様→設計→実装→PR）
- `spec-agent.md` — 要件仕様策定の専門エージェント
- `architect-agent.md` — データアーキテクチャ・設計の専門エージェント
- `tdd-agent.md` — TDDサイクル実行の専門エージェント
- `review-agent.md` — コードレビュー・PR作成の専門エージェント

### スキル / スラッシュコマンド（`.claude/skills/`）
- `/dev-flow` — 全フローを一貫実行
- `/spec-define` — 要件仕様の定義
- `/arch-design` — アーキテクチャ設計
- `/tech-stack` — 技術スタック確認・決定
- `/task-breakdown` — タスク分解
- `/tdd-cycle` — TDDサイクル（RED→GREEN→REFACTOR）
- `/e2e-test` — E2Eテスト作成・実行
- `/create-pr` — プルリクエスト作成

### フロー詳細
- フロー設計書: `docs/DEV-AGENT-FLOW.md`

## 参照ドキュメント
- 機能仕様: `docs/SPEC.md`
- アーキテクチャ: `docs/ARCHITECTURE.md`
- Qiita API仕様: `docs/API.md`
- 開発フロー設計: `docs/DEV-AGENT-FLOW.md`
