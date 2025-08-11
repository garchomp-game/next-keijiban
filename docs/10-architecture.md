# アーキテクチャ

## 全体像
- **Backend**: Flask API + Flask-SocketIO（WS）。SQLAlchemy で Postgres に永続化。Redis は Socket.IO のメッセージブローカー/キューに利用。
- **Frontend**: Next.js（App Router）。REST クライアントは OpenAPI から TS 型生成。WS は socket.io-client。

## ポートとオリジン
- Backend: http://localhost:5000 （REST と Socket.IO を同一オリジンで提供）
- Frontend: http://localhost:3000
- CORS/WS: `http://localhost:3000` のみ許可（開発）

## 認証
- JWT (HS256)。/auth/login で発行、アクセストークンは `Authorization: Bearer` で送付。
- WS は接続時にクエリ or ヘッダで JWT を検証。

## DB モデル（最小）
- User { id, email(unique), passwordHash, displayName, createdAt }
- Room { id, name, createdAt }
- Message { id, roomId(FK), userId(FK), body, createdAt, editedAt? }

## メッセージ配信
- Socket.IO の名前空間 `/ws`、ルーム単位に join/leave。message:create を受けて Redis 経由で他インスタンスへファンアウト。

## 運用メモ
- 本番は Gunicorn + eventlet または gevent で WS 対応。
- 低遅延が重要な場合は `message:create` を ACK 即時、保存は非同期（後追い）に切り分け可能。
