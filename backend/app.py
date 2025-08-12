import datetime as dt
import os

from flask import Flask, jsonify, g, request, session as ws_session
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_socketio import Namespace, SocketIO, join_room, leave_room

from backend.app.auth import bp as auth_bp
from backend.app.rooms import bp as rooms_bp
from backend.app.models import SessionLocal, Message, Room

app = Flask(__name__)
app.config.setdefault("JWT_SECRET_KEY", os.environ.get("JWT_SECRET_KEY", "change-me"))
app.config.setdefault("CORS_ORIGIN", os.environ.get("CORS_ORIGIN", "http://localhost:3000"))
app.config.setdefault("DATABASE_URL", os.environ.get("DATABASE_URL", "sqlite:///app.db"))

CORS(app, origins=app.config["CORS_ORIGIN"], supports_credentials=True)
jwt = JWTManager(app)
socketio = SocketIO(app, cors_allowed_origins=app.config["CORS_ORIGIN"])

app.register_blueprint(auth_bp)
app.register_blueprint(rooms_bp)


@app.before_request
def create_session():
    g.db = SessionLocal()


@app.teardown_request
def remove_session(exc=None):
    db = g.pop("db", None)
    if db is not None:
        if exc:
            db.rollback()
        db.close()


@app.get("/healthz")
def healthz():
    return jsonify({"status": "ok"})


class WSNamespace(Namespace):
    namespace = "/ws"

    def _ack(self, event: str, ok: bool = True, data=None, code=None, message=None, details=None):
        if ok:
            return {
                "ok": True,
                "event": event,
                "ts": dt.datetime.utcnow().isoformat() + "Z",
                "data": data or {},
            }
        return {
            "ok": False,
            "event": event,
            "code": code or "ERROR",
            "message": message or "",
            "details": details or {},
        }

    def on_connect(self):
        token = request.args.get("token")
        if not token:
            auth = request.headers.get("Authorization", "")
            if auth.startswith("Bearer "):
                token = auth.split(" ", 1)[1]
        if not token:
            return False
        try:
            data = jwt.decode_token(token)
        except Exception:  # pragma: no cover - token invalid
            return False
        ws_session["user_id"] = data["sub"]

    def on_room_join(self, data):
        room_id = data.get("roomId") if data else None
        if not room_id:
            return self._ack("room:join", ok=False, code="PAYLOAD_INVALID", message="roomId required")
        join_room(room_id)
        return self._ack("room:join", data={"roomId": room_id})

    def on_room_leave(self, data):
        room_id = data.get("roomId") if data else None
        if not room_id:
            return self._ack("room:leave", ok=False, code="PAYLOAD_INVALID", message="roomId required")
        leave_room(room_id)
        return self._ack("room:leave", data={"roomId": room_id})

    def on_message_create(self, data):
        room_id = data.get("roomId") if data else None
        body = data.get("body") if data else None
        if not room_id or not body:
            return self._ack("message:create", ok=False, code="PAYLOAD_INVALID", message="roomId and body required")
        session = SessionLocal()
        room = session.get(Room, room_id)
        if not room:
            session.close()
            return self._ack("message:create", ok=False, code="ROOM_NOT_FOUND", message="Room not found")
        msg = Message(room_id=room_id, user_id=ws_session.get("user_id"), body=body)
        session.add(msg)
        session.commit()
        payload = {
            "id": msg.id,
            "roomId": msg.room_id,
            "userId": msg.user_id,
            "body": msg.body,
            "createdAt": msg.created_at.isoformat(),
            "editedAt": None,
        }
        self.emit("message:new", payload, room=room_id)
        session.close()
        return self._ack("message:create", data={"id": msg.id, "roomId": msg.room_id})

    def on_message_typing(self, data):
        room_id = data.get("roomId") if data else None
        if not room_id:
            return self._ack("message:typing", ok=False, code="PAYLOAD_INVALID", message="roomId required")
        is_typing = bool(data.get("isTyping")) if data else False
        payload = {"roomId": room_id, "userId": ws_session.get("user_id"), "isTyping": is_typing}
        self.emit("message:typing", payload, room=room_id, include_self=False)
        return self._ack("message:typing", data={"roomId": room_id, "isTyping": is_typing})


socketio.on_namespace(WSNamespace(WSNamespace.namespace))


if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5000)
