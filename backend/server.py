from __future__ import annotations

import json
import mimetypes
import os
import sys
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlparse

from data import dataset


ROOT = Path(__file__).resolve().parent.parent
FRONTEND = ROOT / "frontend"
HOST = "0.0.0.0"
PORT = int(sys.argv[1] if len(sys.argv) > 1 else os.environ.get("PORT", "8000"))


class PrototypeHandler(BaseHTTPRequestHandler):
    def do_GET(self) -> None:
        path = urlparse(self.path).path
        if path == "/api/bootstrap":
            self.send_json(dataset())
            return

        if path.startswith("/api/trace/"):
            field_id = unquote(path.rsplit("/", 1)[-1])
            data = dataset()
            field = next((item for item in data["fields"] if item["id"] == field_id), None)
            if not field:
                self.send_json({"error": "Field not found"}, status=404)
                return
            document = next((item for item in data["documents"] if item["id"] == field["documentId"]), None)
            self.send_json({"field": field, "document": document})
            return

        if path in ("", "/"):
            self.send_file(FRONTEND / "index.html")
            return

        if path.startswith("/static/"):
            relative = unquote(path.removeprefix("/static/"))
            target = (FRONTEND / relative).resolve()
            if FRONTEND.resolve() not in target.parents and target != FRONTEND.resolve():
                self.send_error(403)
                return
            self.send_file(target)
            return

        self.send_error(404)

    def do_POST(self) -> None:
        path = urlparse(self.path).path
        if path != "/api/corrections":
            self.send_error(404)
            return

        length = int(self.headers.get("Content-Length", "0"))
        body = self.rfile.read(length).decode("utf-8") if length else "{}"
        try:
            payload = json.loads(body)
        except json.JSONDecodeError:
            self.send_json({"error": "Invalid JSON"}, status=400)
            return

        self.send_json(
            {
                "status": "queued",
                "message": "Correction captured in the Smart Review log.",
                "correction": payload,
            }
        )

    def send_json(self, payload: dict, status: int = 200) -> None:
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(body)

    def send_file(self, path: Path) -> None:
        if not path.exists() or not path.is_file():
            self.send_error(404)
            return

        content_type, _ = mimetypes.guess_type(path.name)
        body = path.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", content_type or "application/octet-stream")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, format: str, *args: object) -> None:
        print("%s - %s" % (self.address_string(), format % args))


if __name__ == "__main__":
    server = ThreadingHTTPServer((HOST, PORT), PrototypeHandler)
    print(f"EasyTax prototype running at http://{HOST}:{PORT}")
    print("Press Ctrl+C to stop.")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping server.")
        server.server_close()
