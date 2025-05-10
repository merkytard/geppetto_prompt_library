# watch_bookmarks.py
# Sleduje zmeny v bookmarks_log.yml a pingne Mnemosyne pri zmene

import time
from pathlib import Path
import subprocess

BOOKMARKS = Path("orchestration/bookmarks_log.yml")
last_modified = None

print("📌 Watching bookmarks_log.yml for changes...")

while True:
    if BOOKMARKS.exists():
        current = BOOKMARKS.stat().st_mtime
        if last_modified is None:
            last_modified = current
        elif current != last_modified:
            print("📎 Bookmarks updated → invoking Mnemosyne.")
            subprocess.call(["python3", "daemons/mnemosyne_checker.py"])
            last_modified = current
    time.sleep(30)
