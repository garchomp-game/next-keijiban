import os

from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_socketio import Namespace, SocketIO

app = Flask(__name__)
app.config.setdefault("JWT_SECRET_KEY", os.environ.get("JWT_SECRET_KEY", "change-me"))
app.config.setdefault("CORS_ORIGIN", os.environ.get("CORS_ORIGIN", "http://localhost:3000"))

CORS(app, origins=app.config["CORS_ORIGIN"], supports_credentials=True)
jwt = JWTManager(app)
socketio = SocketIO(app, cors_allowed_origins=app.config["CORS_ORIGIN"]) 


@app.get("/healthz")
def healthz():
    return jsonify({"status": "ok"})


class WSNamespace(Namespace):
    namespace = "/ws"

    def on_connect(self):
        pass

    def on_disconnect(self):
        pass


socketio.on_namespace(WSNamespace(WSNamespace.namespace))


if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5000)
