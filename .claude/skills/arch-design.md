# /arch-design — アーキテクチャ設計スキル

## 説明
確定した仕様書をもとに、データモデル・API・コンポーネント構成を設計するスキル。

## 使い方
```
/arch-design           # docs/SPEC.md を読んで設計を開始
/arch-design "認証機能" # 特定機能のアーキテクチャを設計
```

## 実行手順

1. **仕様の読み込み**: `docs/SPEC.md` と `CLAUDE.md` を確認する。

2. **データモデル設計**:
   - TypeScript 型定義を `src/types/` に設計する
   - インターフェースと型エイリアスを適切に使い分ける

3. **API設計**:
   - エンドポイント、メソッド、パラメータを定義する
   - `docs/API.md` を更新する

4. **コンポーネント設計**:
   - コンポーネントツリーと責務を定義する
   - Props の型を定義する
   - 状態管理方針（hooks / context）を決定する

5. **ドキュメント更新**: `docs/ARCHITECTURE.md` を更新する。

## 出力
- 更新された `docs/ARCHITECTURE.md`
- 更新された `docs/API.md`
- 型定義の設計案
