# 📦 auto_indexer.py – Automatické indexovanie Geppetto systémov

import os
import json
from datetime import datetime
from pathlib import Path

ROOT_DIR = Path("/mnt/data/_g-Geppetto-System")
MANIFEST_PATH = ROOT_DIR / "_g-index" / "document_manifest.yml"
MIRROR_LOG_PATH = ROOT_DIR / "_g-memory" / "mirror_log.jsonl"
INDEX_FILE = ROOT_DIR / "_g-index" / "index.py"

PREFIX_MAP = {
    "core_": "core_engine",
    "mirror_": "mirror_layer",
    "deploy_": "deployment",
    "g-": "infrastructure",
    "a-": "content",
    "_g-": "system",
    "_a-": "archives"
}

INDEXED = []
MANIFEST = []

def classify_prefix(filename):
    for prefix, layer in PREFIX_MAP.items():
        if filename.startswith(prefix):
            return prefix, layer
    return "unclassified", "unknown"

def traverse_and_index():
    for root, _, files in os.walk(ROOT_DIR):
        for f in files:
            if f.endswith(('.py', '.json', '.yml', '.md')) and not f.startswith('.'):
                full_path = Path(root) / f
                rel_path = full_path.relative_to(ROOT_DIR)
                prefix, layer = classify_prefix(f)
                try:
                    with open(full_path, 'r', encoding='utf-8', errors='ignore') as file:
                        content = file.read()
                except:
                    content = ""
                indexed_item = {
                    "file": str(rel_path),
                    "prefix": prefix,
                    "layer": layer,
                    "timestamp": datetime.now().isoformat(),
                    "status": "incomplete" if any(tag in content for tag in ['TODO', 'FIXME', 'HACK']) else "complete"
                }
                INDEXED.append(indexed_item)
                MANIFEST.append(indexed_item)

def write_manifest():
    os.makedirs(MANIFEST_PATH.parent, exist_ok=True)
    with open(MANIFEST_PATH, "w", encoding="utf-8") as f:
        f.write("# 📘 Auto-generovaný manifest\n")
        for item in MANIFEST:
            f.write(f"- file: {item['file']}\n")
            f.write(f"  prefix: {item['prefix']}\n")
            f.write(f"  layer: {item['layer']}\n")
            f.write(f"  status: {item['status']}\n")
            f.write(f"  timestamp: {item['timestamp']}\n")

def append_mirror_log():
    os.makedirs(MIRROR_LOG_PATH.parent, exist_ok=True)
    with open(MIRROR_LOG_PATH, "a", encoding="utf-8") as f:
        for item in MANIFEST:
            f.write(json.dumps(item, ensure_ascii=False) + "\n")

def write_index_py():
    os.makedirs(INDEX_FILE.parent, exist_ok=True)
    with open(INDEX_FILE, "w", encoding="utf-8") as f:
        f.write("# 🔗 Auto-vygenerovaný index modulu\n")
        f.write("indexed_files = [\n")
        for item in INDEXED:
            f.write(f"    \"{item['file']}\",\n")
        f.write("]\n")

def main():
    print("🔍 Spúšťam AutoIndexer...")
    traverse_and_index()
    write_manifest()
    append_mirror_log()
    write_index_py()
    print(f"✅ Indexovaných súborov: {len(INDEXED)}")

if __name__ == "__main__":
    main()