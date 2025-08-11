# AGENTS.md — Agents Guide for Flask + Next.js Bulletin Board

## Workspace
- Backend: ./backend  (Flask + Flask-SocketIO, SQLAlchemy/Alembic)
- Frontend: ./frontend (Next.js 14/15, app router 推奨)
- Docs: ./docs
- Infra: docker-compose (Postgres, Redis)

## Runtime & Tools
- Python: 3.11+
- Node: 22 LTS（.nvmrcで固定可）
- Datastores: PostgreSQL 16, Redis 7
- Package: pip（Poetry可だが標準はpip） / npm or pnpm（どちらかに統一）

## Local Setup (順序)
1) `docker compose up -d`  # Postgres & Redis が立ち上がること
2) Backend env: `cp backend/.env.example backend/.env` に必要値を記入
3) Frontend env: `cp frontend/.env.local.example frontend/.env.local`
4) Backend deps（参考）: `python -m venv .venv && source .venv/bin/activate && pip install -r backend/requirements.txt`
5) Frontend deps: `npm --prefix frontend i` （または `pnpm -C frontend i`）

> 実装タスク完了後、開発起動は `npm --prefix frontend run dev` と `flask --app backend/app.py run` を基本とする想定（詳細は README 参照）。

## Commands（想定・Codex実装後に成立）
- Dev: `npm run dev:web` / `npm run dev:api`
- Test: `npm run test:web` / `npm run test:api` / `npm run e2e`
- Lint & Typecheck: `npm run lint` / `npm run typecheck`
- DB: `alembic upgrade head` / `alembic revision --autogenerate -m "..."`

## Quality Gates
- Lint/Typecheck/Unit/E2E すべて成功
- REST: OpenAPIのスキーマ準拠（/docs/20-api/openapi.yaml）
- WS: ACKフォーマット準拠（/docs/20-api/websocket-events.md）
- 重大な挙動変更はテスト同梱

## Constraints / Guardrails
- **Do NOT commit secrets**（.envはexampleのみ）
- DBスキーマ変更は Alembic migration 必須
- Socket.IO イベントは必ず ACK を返す（成功/失敗の共通フォーマット）
- フロントは API 型を生成して使用（OpenAPI -> TS 型）
- パフォーマンス予算: 初期目標 P95 < 300ms（GET /rooms, GET /rooms/{id}/messages 50件）

## PR Rules
- Conventional Commits
- 変更理由 / 影響範囲 / ロールバック手順 / 実行ログ or スクショ（E2E/WS）
