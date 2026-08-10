import os
import sys
from pathlib import Path


def get_database_file() -> Path:
    if getattr(sys, "frozen", False):
        data_root = Path(os.environ.get("LOCALAPPDATA", Path.home() / "AppData" / "Local"))
        data_dir = data_root / "ChanosWarRoom"
        data_dir.mkdir(parents=True, exist_ok=True)
        return data_dir / "database.json"

    return Path(__file__).resolve().parent / "database.json"


DATABASE_FILE = get_database_file()
