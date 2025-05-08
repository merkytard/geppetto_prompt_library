# 📡 g-bookmarks_watchdog.py – Sleduje zmeny v _g-bookmarks/ a buildí bookmarks.html

import time
from pathlib import Path
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import subprocess

BOOKMARKS_DIR = Path("_g-bookmark s")
TRIGGER_SUFFIX = ".todo.yml"
DEBOUNCE_SECONDS = 180  # 3 minúty

class BookmarkHandler(FileSystemEventHandler):
    def __init__(self):
        self.last_modified = {}

    def on_modified(self, event):
        if event.is_directory or not event.src_path.endswith(TRIGGER_SUFFIX):
            return
        bookmark = Path(event.src_path)
        now = time.time()
        self.last_modified[bookmark] = now

    def debounce_check(self):
        now = time.time()
        for path, modified_time in list(self.last_modified.items()):
            if now - modified_time > DEBOUNCE_SECONDS:
                print(f"⏱️ Zaznamenaná stabilná zmena: {path.name} – spúšťam build...")
                subprocess.run(["python", "g-bookmarks_viewer.py"])
                del self.last_modified[path]

if __name__ == "__main__":
    print("👀 Sledujem zmeny v _g-bookmarks/... (debounce 3 min)")
    event_handler = BookmarkHandler()
    observer = Observer()
    observer.schedule(event_handler, str(BOOKMARKS_DIR), recursive=False)
    observer.start()

    try:
        while True:
            time.sleep(15)
            event_handler.debounce_check()
    except KeyboardInterrupt:
        observer.stop()
    observer.join()
