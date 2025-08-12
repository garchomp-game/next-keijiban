#!/bin/bash

# ローカル開発用ネイティブ実行スクリプト（CI環境と同様）
set -e

echo "💻 Starting development environment natively..."

# 必要なプロセスIDを保存するディレクトリ
mkdir -p .pids

# .envファイルのコピー
if [ ! -f backend/.env ]; then
    echo "📋 Copying backend .env file..."
    cp backend/.env.example backend/.env
fi

if [ ! -f frontend/.env.local ]; then
    echo "📋 Copying frontend .env file..."
    cp frontend/.env.local.example frontend/.env.local
fi

# 依存関係のチェック
echo "📦 Checking dependencies..."
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 is required"
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required"
    exit 1
fi

if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL client is required"
    exit 1
fi

# PostgreSQLとRedisが動作しているか確認
if ! pg_isready -h localhost -p 5432 &> /dev/null; then
    echo "❌ PostgreSQL is not running on localhost:5432"
    exit 1
fi

if ! redis-cli -h localhost -p 6379 ping &> /dev/null; then
    echo "❌ Redis is not running on localhost:6379"
    exit 1
fi

# 依存関係のインストール
echo "📦 Installing dependencies..."
cd backend && pip install -r requirements.txt && cd ..
cd frontend && npm ci && cd ..

# データベースマイグレーション
echo "🗃️  Running database migrations..."
cd backend
export DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5432/keijiban
export REDIS_URL=redis://localhost:6379/0
alembic upgrade head
cd ..

# バックエンド起動
echo "🚀 Starting backend..."
cd backend
export DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5432/keijiban
export REDIS_URL=redis://localhost:6379/0
export CORS_ORIGIN=http://localhost:3000
python app.py &
echo $! > ../.pids/backend.pid
cd ..

# フロントエンド起動
echo "🚀 Starting frontend..."
cd frontend
export NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
export NEXT_PUBLIC_WS_URL=http://localhost:5000/ws
npm run dev &
echo $! > ../.pids/frontend.pid
cd ..

# サービスの起動を待機
echo "⏳ Waiting for services to be ready..."
for i in {1..60}; do
    if curl -fsS http://localhost:5000/healthz >/dev/null 2>&1 && curl -fsS http://localhost:3000 >/dev/null 2>&1; then
        echo "✅ All services are ready!"
        echo ""
        echo "🌐 Frontend: http://localhost:3000"
        echo "🔧 Backend: http://localhost:5000"
        echo "📊 Backend Health: http://localhost:5000/healthz"
        echo ""
        echo "🛑 To stop: ./scripts/dev-stop.sh"
        exit 0
    fi
    echo "⏳ Waiting for services... ($i/60)"
    sleep 2
done

echo "❌ Services did not become ready in time"
exit 1
