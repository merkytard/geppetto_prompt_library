# g-book.py
# Synchronizátor medzi bookmarks, mirror_log a pamäťovými tokenmi

import json
from pathlib import Path
from datetime import datetime

BOOKMARKS = Path("orchestration/bookmarks_log.yml")
MIRROR = Path("orchestration/logs/mirror_log.jsonl")
INDEX = Path("memory/memory_token_index.json")
TRACE = Path("daemons/daemon_trace.log")

def log(msg):
    with open(TRACE, "a", encoding="utf-8") as f:
        f.write(f"[{datetime.now().isoformat()}] [g-book] {msg}\n")

def sync():
    if not BOOKMARKS.exists() or not MIRROR.exists():
        log("Bookmarks or mirror log missing.")
        return

    try:
        with open(BOOKMARKS, "r", encoding="utf-8") as f:
            bookmarks = f.read().splitlines()

        with open(MIRROR, "r", encoding="utf-8") as f:
            mirror = [json.loads(line) for line in f if line.strip()]

        unsynced = []
        for line in bookmarks:
            if line.strip().startswith("#"):
                task_id = line.strip().split("–")[0].strip()
                if not any(task_id in m.get("content", "") for m in mirror):
                    unsynced.append(task_id)

        if unsynced:
            log(f"Unsynced bookmarks: {unsynced}")
        else:
            log("All bookmarks appear reflected.")

    except Exception as e:
        log(f"Error during sync: {str(e)}")

if __name__ == "__main__":
    sync()
