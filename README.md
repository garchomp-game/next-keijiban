# Flask + Next.js Realtime Board

リアルタイム掲示板のサンプル実装。バックエンドは Flask + Flask-SocketIO、フロントエンドは Next.js。永続化は PostgreSQL、Pub/Sub として Redis を使用。

## Quick Start
1. **Infra**: `docker compose up -d`  # Postgres/Redis 起動
2. **Backend env**: `cp backend/.env.example backend/.env` を編集
3. **Frontend env**: `cp frontend/.env.local.example frontend/.env.local` を編集
4. **Install deps**:
   - Backend: `python -m venv .venv && source .venv/bin/activate && pip install -r backend/requirements.txt`
   - Frontend: `npm --prefix frontend i`
5. **Run dev**:
   - API/WS: `flask --app backend/app.py run --host 0.0.0.0 --port 5000`
   - Web: `npm --prefix frontend run dev` (http://localhost:3000)

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
