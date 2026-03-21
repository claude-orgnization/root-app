# /create-pr — プルリクエスト作成スキル

## 説明
実装・テスト完了後にプルリクエストを作成するスキル。

## 使い方
```
/create-pr                # 現在のブランチでPRを作成
/create-pr --draft        # ドラフトPRとして作成
```

## 実行手順

1. **事前チェック**:
   ```bash
   # 全テスト通過を確認
   npm test -- --run

   # 型チェック
   npx tsc --noEmit

   # リント
   npm run lint
   ```

2. **変更内容の確認**:
   ```bash
   git status
   git diff --stat main...HEAD
   git log --oneline main...HEAD
   ```

3. **コミットの整理**:
   - 未コミットの変更があればコミットする
   - コミットメッセージが適切か確認する

4. **PR作成**:
   ```bash
   gh pr create \
     --title "feat: 機能の簡潔な説明" \
     --body "$(cat <<'EOF'
   ## 概要
   この PR の目的を1〜2文で説明

   ## 変更内容
   - 追加: ...
   - 変更: ...
   - 削除: ...

   ## 関連仕様
   - docs/SPEC.md#セクション名

   ## テスト
   - [x] ユニットテスト通過
   - [x] 型チェック通過
   - [x] リント通過
   - [ ] E2Eテスト通過（該当する場合）
   EOF
   )"
   ```

5. **結果報告**: 作成したPRのURLをユーザーに報告する。

## コミットメッセージ規約
```
feat: 新機能追加
fix: バグ修正
refactor: リファクタリング
test: テスト追加・修正
docs: ドキュメント更新
style: コードフォーマット
chore: ビルド・設定変更
```
