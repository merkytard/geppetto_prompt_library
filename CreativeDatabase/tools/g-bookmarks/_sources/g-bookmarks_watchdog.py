# 🛡️ g-bookmarks_watchdog.py – Sleduje _todo/ a po 3 minútach generuje bookmarks.html

import time
import subprocess
from pathlib import Path
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

BOOKMARKS_DIR = Path("_g-bookmarks/_todo")
VIEWER_SCRIPT = Path("_g-bookmarks/_sources/g-bookmarks_viewer.py")
DEBOUNCE_SECONDS = 5

last_modified = None
last_file = None

class BookmarkHandler(FileSystemEventHandler):
    def on_modified(self, event):
        global last_modified, last_file
        if event.is_directory:
            return
        if event.src_path.endswith(".todo.yml"):
            last_modified = time.time()
            last_file = Path(event.src_path).name
            print(f"✏️ Zaznamenaná zmena v {last_file}")


def debounce_loop():
    print(f"👀 Sledujem zmeny v {BOOKMARKS_DIR}/... (debounce {DEBOUNCE_SECONDS//10} min)")
    while True:
        time.sleep(5)
        if last_modified and (time.time() - last_modified > DEBOUNCE_SECONDS):
            print(f"⏱️ Zaznamenaná stabilná zmena: {last_file} – spúšťam build...")
            subprocess.call(["python", str(VIEWER_SCRIPT)])
            print("✅ Build dokončený. Čakám na ďalšie zmeny...")
            time.sleep(2)
            last_modified = None


def main():
    event_handler = BookmarkHandler()
    observer = Observer()
    observer.schedule(event_handler, str(BOOKMARKS_DIR), recursive=False)
    observer.start()
    try:
        debounce_loop()
    except KeyboardInterrupt:
        observer.stop()
    observer.join()


if __name__ == "__main__":
    main()
