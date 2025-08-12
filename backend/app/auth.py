from uuid import uuid4

from flask import Blueprint, g, jsonify, request
from sqlalchemy.exc import IntegrityError
from werkzeug.security import check_password_hash, generate_password_hash
from flask_jwt_extended import create_access_token

from .models import User

bp = Blueprint("auth", __name__, url_prefix="/auth")


@bp.post("/signup")
def signup():
    data = request.get_json() or {}
    email = data.get("email")
    password = data.get("password")
    display_name = data.get("displayName")
    if not email or not password or not display_name:
        return jsonify({"message": "Invalid payload"}), 400
    session = g.db
    user = User(id=str(uuid4()), email=email, password_hash=generate_password_hash(password), display_name=display_name)
    session.add(user)
    try:
        session.commit()
    except IntegrityError:
        session.rollback()
        return jsonify({"message": "Email already used"}), 400
    return ("", 201)


@bp.post("/login")
def login():
    data = request.get_json() or {}
    email = data.get("email")
    password = data.get("password")
    session = g.db
    user = session.query(User).filter_by(email=email).first()
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"message": "Invalid credentials"}), 401
    token = create_access_token(identity=user.id)
    return jsonify({"accessToken": token})
