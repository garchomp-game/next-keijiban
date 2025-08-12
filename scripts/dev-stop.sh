#!/bin/bash

# 開発サーバー停止スクリプト
set -e

echo "🛑 Stopping development services..."

# ネイティブプロセスの停止
if [ -f .pids/backend.pid ]; then
    echo "🔧 Stopping backend..."
    kill $(cat .pids/backend.pid) 2>/dev/null || echo "Backend already stopped"
    rm .pids/backend.pid
fi

if [ -f .pids/frontend.pid ]; then
    echo "🌐 Stopping frontend..."
    kill $(cat .pids/frontend.pid) 2>/dev/null || echo "Frontend already stopped"
    rm .pids/frontend.pid
fi

# Docker Composeサービスの停止
if [ -f docker-compose.yml ]; then
    echo "🐳 Stopping Docker services..."
    docker compose down 2>/dev/null || echo "Docker services already stopped"
fi

# 開発用データベースコンテナの停止（必要に応じて）
docker stop postgres-dev redis-dev 2>/dev/null || echo "Development databases already stopped"
docker rm postgres-dev redis-dev 2>/dev/null || echo "Development databases already removed"

echo "✅ All services stopped"
