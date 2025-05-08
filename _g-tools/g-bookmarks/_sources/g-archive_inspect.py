# 📦 g-archive_inspect.py – Rozbalovač ZIPov so záznamom do YAML + DB + archivon.route

import os
import zipfile
import yaml
import sqlite3
from pathlib import Path
from datetime import datetime

# Cesty
ARCHIVE_DIR = Path("_a-archives/a-archives/a-archive-sources-zip")
OUTPUT_DIR = Path("_a-archives/a-unpacked")
DB_PATH = Path("_a-archives/unpack_index.db")

# Pripojenie na SQLite databázu
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()
cursor.execute("""
CREATE TABLE IF NOT EXISTS archives (
    id INTEGER PRIMARY KEY,
    archive_name TEXT,
    extract_path TEXT,
    extracted_at TEXT,
    file_count INTEGER,
    has_manifest INTEGER,
    has_index INTEGER,
    has_mirror INTEGER,
    state TEXT,
    tags TEXT,
    notes TEXT
)
""")
conn.commit()

def generate_route_file(target_dir: Path):
    route = {
        "wave": "unknown-seed",
        "thread": "unassigned-thread",
        "state": "draft",
        "tension": 0.0,
        "weight": 0.0,
        "tags": ["todo", "placeholder"]
    }
    with open(target_dir / "archivon.route", "w", encoding="utf-8") as f:
        yaml.dump(route, f, allow_unicode=True)

def inspect_zip(zip_path: Path):
    # ✅ Ochrana pred duplicitou
    cursor.execute("SELECT COUNT(*) FROM archives WHERE archive_name = ?", (zip_path.name,))
    if cursor.fetchone()[0] > 0:
        print(f"⚠️ ZIP už bol rozbalený: {zip_path.name} – preskakujem.")
        return
    timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    name = zip_path.stem
    target_dir = OUTPUT_DIR / name / timestamp
    target_dir.mkdir(parents=True, exist_ok=True)

    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        zip_ref.extractall(target_dir)

    # Kontrola prítomnosti štruktúr
    all_files = [str(p.relative_to(target_dir)) for p in target_dir.rglob("*") if p.is_file()]
    has_index = any("index.py" in f for f in all_files)
    has_manifest = any("manifest" in f.lower() for f in all_files)
    has_mirror = any("mirror_log" in f for f in all_files)

    # YAML popis
    info = {
        "archive": zip_path.name,
        "extracted_to": str(target_dir),
        "timestamp": timestamp,
        "files": all_files,
        "status": "unpacked",
        "linked": False,
        "archivon": "archivon.route"
    }
    with open(target_dir / "unpack_info.yml", "w", encoding="utf-8") as f:
        yaml.dump(info, f, allow_unicode=True)

    # archivon.route šablóna
    generate_route_file(target_dir)

    # DB záznam
    cursor.execute("""
        INSERT INTO archives (
            archive_name, extract_path, extracted_at, file_count,
            has_manifest, has_index, has_mirror,
            state, tags, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        zip_path.name, str(target_dir), timestamp, len(all_files),
        int(has_manifest), int(has_index), int(has_mirror),
        "draft", "todo,placeholder", ""
    ))
    conn.commit()
    print(f"✅ Rozbalené: {zip_path.name} → {target_dir}")

def main():
    print("🔍 Hľadám ZIP archívy v:", ARCHIVE_DIR)
    for zip_file in ARCHIVE_DIR.glob("*.zip"):
        inspect_zip(zip_file)

if __name__ == "__main__":
    main()
    print("📦 Hotovo. Všetky archívy rozbalené a zaindexované.")
