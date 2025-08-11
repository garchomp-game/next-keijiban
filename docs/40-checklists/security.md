# セキュリティ・運用メモ

- 認証: JWT（HS256）。exp は 15m 目安、refresh は別途（任意）。
- CORS: 開発は `http://localhost:3000` のみ許可。`Allow-Credentials: false`（既定）
- Rate Limit: `/auth/*` に厳しめ、WS `message:create` にも適用
- Secrets: .env のみ。サンプルは `.env.example` に鍵名を列挙
- ロギング: 重要イベント（login, room:create, message:create）を構造化ログに
- 本番起動: Gunicorn + eventlet もしくは gevent（WS対応のため）
