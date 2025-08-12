# Flask + Next.js Realtime Board

リアルタイム掲示板のサンプル実装。バックエンドは Flask + Flask-SocketIO、フロントエンドは Next.js。永続化は PostgreSQL、Pub/Sub として Redis を使用。

Node 22 LTS を使用するため、`.nvmrc` を用意しています。

## Quick Start
1. **Infra**: PostgreSQL 16 と Redis 7 を localhost で起動（ports 5432/6379）
2. **Env files**
   - Backend: `cp backend/.env.example backend/.env`
   - Frontend: `cp frontend/.env.local.example frontend/.env.local`
3. **Install deps**
   - Backend: `python -m venv .venv && source .venv/bin/activate && pip install -r backend/requirements.txt`
   - Frontend: `npm --prefix frontend install`
4. **Run dev**
   - API/WS: `npm run dev:api` (http://localhost:5000)
   - Web: `npm run dev:web` (http://localhost:3000)

`CORS_ORIGIN` と `NEXT_PUBLIC_API_BASE_URL` でポート/オリジンを調整できます。


### Troubleshooting
- psycopg のビルドに失敗する場合は `psycopg[binary]` を利用するか、ビルドツールを確認してください。
- WebSocket は `eventlet` を利用しており、インストールされている必要があります。

## Docs
- Overview: `docs/00-overview.md`
- Architecture: `docs/10-architecture.md`
- REST API: `docs/20-api/openapi.yaml`
- WebSocket: `docs/20-api/websocket-events.md`
- Codex Guide: `docs/30-impl-guide-codex.md`

## 技術スタック
- Backend: Flask, Flask-SocketIO, SQLAlchemy, Alembic
- Frontend: Next.js, socket.io-client, React Query（推奨）
- Databases: PostgreSQL, Redis
- Tests: pytest / Playwright / Artillery（WS負荷）
