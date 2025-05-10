# mnemosyne_checker.py
# Sleduje odklon od zámerov, zápisov a pamäťových krokov

import json
from pathlib import Path
from datetime import datetime

BOOKMARKS = Path("../orchestration/bookmarks_log.yml")
MANIFEST = Path("../orchestration/document_manifest.yml")
MIRROR = Path("../orchestration/logs/mirror_log.jsonl")
TRACE = Path("daemon_trace.log")
PING_TARGET = Path("../dashboard/bitface_view.md")

def ping(message):
    with open(TRACE, "a", encoding="utf-8") as f:
        f.write(f"[{datetime.now().isoformat()}] {message}\n")
    with open(PING_TARGET, "a", encoding="utf-8") as f:
        f.write(f"\n> ⚠️ Mnemosyne Ping: {message}\n")

def run_check():
    issues = []

    if not BOOKMARKS.exists():
        issues.append("Missing bookmarks log.")
    if not MANIFEST.exists():
        issues.append("Missing document manifest.")
    if not MIRROR.exists():
        issues.append("No mirror log found (no reflections?).")

    if issues:
        for issue in issues:
            ping(issue)
    else:
        ping("All systems aligned. Mnemosyne is calm.")

if __name__ == "__main__":
    run_check()
