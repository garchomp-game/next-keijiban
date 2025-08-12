#!/bin/bash

# ローカル開発用Docker Compose実行スクリプト
set -e

echo "🐳 Starting development environment with Docker..."

# .envファイルのコピー
if [ ! -f backend/.env ]; then
    echo "📋 Copying backend .env file..."
    cp backend/.env.example backend/.env
fi

if [ ! -f frontend/.env.local ]; then
    echo "📋 Copying frontend .env file..."
    cp frontend/.env.local.example frontend/.env.local
fi

# Docker Composeでサービス起動
echo "🚀 Starting services..."
docker compose up -d

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
        echo "🛑 To stop: docker compose down"
        exit 0
    fi
    echo "⏳ Waiting for services... ($i/60)"
    sleep 2
done

echo "❌ Services did not become ready in time"
echo "📋 Checking service logs..."
docker compose logs
exit 1
