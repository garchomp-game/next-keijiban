# Codex 実装ガイド（Flask + Next.js）

## 目的
- Codex/CLI がこのリポジトリで小さく安全に価値を出せるよう、段階的なタスクを定義。

## 優先タスク（短冊化）
1. **Sprint 0（土台）**: docker-compose（pg/redis）、env example、共通スクリプト、README 整備
2. **DB 永続化**: SQLAlchemy モデル（User/Room/Message）、Alembic 初期マイグレーション、Seed
3. **REST 最小実装**: OpenAPI に沿った /auth, /rooms, /rooms/{id}/messages
4. **WS 最小実装**: /ws 名前空間、join/leave/message/typing、ACK/Broadcast
5. **Frontend 結線**: OpenAPI -> TS 型生成、REST/WS クライアント、最小UI（ルーム→入室→投稿）
6. **E2E と負荷**: Playwright 1本 + Artillery シナリオ 1本

## 品質ゲート
- Lint/Typecheck/Unit/E2E すべてグリーン
- REST リグレッションは Contract Test（OpenAPI）で検出
- WS は ACK/エラーコードとイベント順序の整合性を確認

## 禁則（Do not）
- Secrets をハードコード
- DB スキーマ直編集（Alembic を必ず通す）
- 破壊的変更の無通告
