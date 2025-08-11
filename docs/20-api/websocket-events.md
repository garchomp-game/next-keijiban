# WebSocket (Socket.IO) Event Definitions

- Namespace: `/ws`
- Transport: WebSocket（fallback可）
- Auth: 接続時に `Authorization: Bearer <JWT>` をヘッダ or クエリ（`token`）で渡す

## 共通ACKフォーマット
```json
// 成功
{
  "ok": true,
  "event": "<event-name>",
  "ts": "2025-08-12T00:00:00.000Z",
  "data": { /* event-specific */ }
}
```

```json
// 失敗
{
  "ok": false,
  "event": "<event-name>",
  "code": "ROOM_NOT_FOUND",
  "message": "Room not found",
  "details": { /* optional */ }
}
```

## Events

### `room:join`

* Client -> Server

```json
{ "roomId": "room_123" }
```

* Server -> ACK (success)

```json
{ "ok": true, "event": "room:join", "data": { "roomId": "room_123" } }
```

* Broadcast: `presence:update`（参加者数など）

### `room:leave`

* Client -> Server

```json
{ "roomId": "room_123" }
```

* ACK 同上

### `message:create`

* Client -> Server

```json
{ "roomId": "room_123", "body": "Hello" }
```

* ACK (success)

```json
{ "ok": true, "event": "message:create", "data": { "id": "msg_1", "roomId": "room_123" } }
```

* Broadcast: `message:new`

```json
{ "id": "msg_1", "roomId": "room_123", "userId": "u_9", "body": "Hello", "createdAt": "..." }
```

### `message:typing`

* Client -> Server

```json
{ "roomId": "room_123", "isTyping": true }
```

* Broadcast（同ルーム）

```json
{ "roomId": "room_123", "userId": "u_9", "isTyping": true }
```

### エラーコード例

* `AUTH_REQUIRED`, `INVALID_TOKEN`, `ROOM_NOT_FOUND`, `PAYLOAD_INVALID`, `RATE_LIMITED`
