import datetime as dt
from uuid import uuid4

from flask import Blueprint, g, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from .models import Message, Room

bp = Blueprint("rooms", __name__)


def serialize_room(room: Room) -> dict:
    return {"id": room.id, "name": room.name, "createdAt": room.created_at.isoformat()}


def serialize_message(msg: Message) -> dict:
    return {
        "id": msg.id,
        "roomId": msg.room_id,
        "userId": msg.user_id,
        "body": msg.body,
        "createdAt": msg.created_at.isoformat(),
        "editedAt": msg.edited_at.isoformat() if msg.edited_at else None,
    }


@bp.get("/rooms")
@jwt_required()
def list_rooms():
    session = g.db
    rooms = session.query(Room).order_by(Room.created_at.asc()).all()
    return jsonify([serialize_room(r) for r in rooms])


@bp.post("/rooms")
@jwt_required()
def create_room():
    data = request.get_json() or {}
    name = data.get("name")
    if not name:
        return jsonify({"message": "Invalid payload"}), 400
    room = Room(id=str(uuid4()), name=name)
    session = g.db
    session.add(room)
    session.commit()
    return jsonify(serialize_room(room)), 201


@bp.get("/rooms/<room_id>/messages")
@jwt_required()
def list_messages(room_id: str):
    session = g.db
    query = session.query(Message).filter_by(room_id=room_id)
    since = request.args.get("since")
    if since:
        try:
            since_dt = dt.datetime.fromisoformat(since)
            query = query.filter(Message.created_at > since_dt)
        except ValueError:
            pass
    limit = request.args.get("limit", type=int) or 50
    limit = min(max(limit, 1), 100)
    messages = query.order_by(Message.created_at.asc()).limit(limit).all()
    return jsonify([serialize_message(m) for m in messages])


@bp.post("/rooms/<room_id>/messages")
@jwt_required()
def create_message(room_id: str):
    data = request.get_json() or {}
    body = data.get("body")
    if not body:
        return jsonify({"message": "Invalid payload"}), 400
    session = g.db
    room = session.get(Room, room_id)
    if not room:
        return jsonify({"message": "Room not found"}), 404
    msg = Message(id=str(uuid4()), room_id=room_id, user_id=get_jwt_identity(), body=body)
    session.add(msg)
    session.commit()
    return jsonify(serialize_message(msg)), 201
