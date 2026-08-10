import multiprocessing
import socket
import threading
import time
from urllib.request import urlopen

import uvicorn
import webview

from backend.main import app


HOST = "127.0.0.1"


def find_available_port() -> int:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as probe:
        probe.bind((HOST, 0))
        return probe.getsockname()[1]


def wait_for_server(url: str) -> None:
    deadline = time.monotonic() + 20
    while time.monotonic() < deadline:
        try:
            with urlopen(f"{url}/api/status", timeout=1):
                return
        except OSError:
            time.sleep(0.2)
    raise RuntimeError("Chanos War Room could not start its local server.")


def launch() -> None:
    port = find_available_port()
    url = f"http://{HOST}:{port}"
    server = uvicorn.Server(uvicorn.Config(app, host=HOST, port=port, log_level="warning"))
    threading.Thread(target=server.run, daemon=True).start()
    wait_for_server(url)

    webview.create_window(
        "Chanos War Room",
        url,
        width=1440,
        height=900,
        min_size=(1024, 700),
    )
    webview.start()


if __name__ == "__main__":
    multiprocessing.freeze_support()
    launch()
