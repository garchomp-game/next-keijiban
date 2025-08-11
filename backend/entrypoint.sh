#!/usr/bin/env bash
set -e

# Wait for Postgres
if [ -n "$DATABASE_URL" ]; then
  echo "Waiting for Postgres at postgres:5432..."
  until nc -z postgres 5432; do
    sleep 1
  done
fi

# Wait for Redis
echo "Waiting for Redis at redis:6379..."
until nc -z redis 6379; do
  sleep 1
done

echo "Starting Flask (reload enabled)"
export FLASK_ENV=${FLASK_ENV:-development}
export FLASK_RUN_HOST=0.0.0.0
export FLASK_RUN_PORT=${FLASK_RUN_PORT:-5000}
exec flask --app app.py run --reload --host 0.0.0.0 --port $FLASK_RUN_PORT
