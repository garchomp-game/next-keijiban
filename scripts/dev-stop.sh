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

echo "✅ All services stopped"
