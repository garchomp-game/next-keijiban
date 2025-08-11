# Codex/CLI 用タスク（コピペ可）

## T1: Sprint 0（土台整備）
目的:
  Postgres/Redis の docker-compose、.env.example、README、共通 npm scripts を追加し、以降のタスクの実行性を担保する。

やること:
  - `docker-compose.yml` に postgres:16-alpine / redis:7-alpine を定義（healthcheck含む）
  - `backend/.env.example` と `frontend/.env.local.example` を作成
  - ルート `README.md` を更新（Quick Start/Ports/CORS）
  - ルート package.json がある場合は scripts を追加（無ければスキップ）

受け入れ条件:
  - `docker compose up -d` が成功し、両コンテナが healthy
  - .env.example に必要キーが網羅（DB/JWT/WS/CORS）
  - README の手順でローカル起動がイメージ可能

## T2: DB 永続化（SQLAlchemy + Alembic）
目的: User/Room/Message の最小モデル、初期マイグレーション、Seed スクリプトを追加。

受け入れ条件:
  - `alembic upgrade head` で3テーブル作成
  - `python backend/scripts/seed.py` でルーム/ユーザ/サンプル投稿投入

## T3: REST 実装
目的: OpenAPI に準拠する /auth, /rooms, /rooms/{id}/messages を Flask Blueprint で実装。
受け入れ条件:
  - OpenAPI の happy path が 200/201 を返す
  - エラー時 400/401/404 のハンドラが統一レスポンス

## T4: WS 実装（Socket.IO）
目的: `/ws` 名前空間と join/leave/message/typing を実装。ACK/Broadcast 準拠。
受け入れ条件:
  - 2クライアント間で message:new がリアルタイム受信
  - 無効トークンで接続拒否、ACK は規定フォーマット

## T5: Frontend 結線
目的: OpenAPI -> 型生成、REST/WS Client、最小UI（ルーム→入室→投稿）。
受け入れ条件:
  - UI から投稿 → 別タブで即時反映
  - 基本エラーがトースト表示

## T6: E2E/負荷
目的: Playwright 1本（happy path）と Artillery 1本（WS スモーク）を追加し、CI で実行可能にする。
