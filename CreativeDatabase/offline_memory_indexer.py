import os, json
from datetime import datetime
from pathlib import Path
import yaml

VECTORS_PATH = Path("geppetto_vectors.json")
SELF_VECTOR_PATH = Path("memory/geppetto_vector_self.json")
REVERSE_MEMORY_PATH = Path("reverse_indexed_memory.json")
MANIFEST_PATH = Path("manifest_of_mind.yml")

def load_json(path):
    if not path.exists():
        print(f"❌ Chýba: {path}")
        return {}
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def update_reverse_memory(vectors):
    reverse_memory = load_json(REVERSE_MEMORY_PATH)

    offline_memory = {
        "id": "offline_snapshot_001",
        "source": "bookmarks/docker_offline/",
        "created": datetime.now().isoformat(),
        "entries": list(vectors.keys())
    }

    reverse_memory["offline_memory"] = offline_memory

    with open(REVERSE_MEMORY_PATH, "w", encoding="utf-8") as f:
        json.dump(reverse_memory, f, indent=2, ensure_ascii=False)
    print("🧠 Reverse memory aktualizovaná.")

def update_manifest():
    entry = {
        "event": "offline_index_commit",
        "timestamp": datetime.now().isoformat(),
        "vector_reference": str(SELF_VECTOR_PATH),
        "daemon_active": True,
        "note": "Zápis HTTrack snapshotov do offline pamäti systému Archivon."
    }

    if MANIFEST_PATH.exists():
        with open(MANIFEST_PATH, "r", encoding="utf-8") as f:
            manifest = yaml.safe_load(f) or []
    else:
        manifest = []

    manifest.append(entry)

    with open(MANIFEST_PATH, "w", encoding="utf-8") as f:
        yaml.dump(manifest, f, allow_unicode=True)
    print("📓 Manifest aktualizovaný.")

def main():
    vectors = load_json(VECTORS_PATH)
    if not vectors:
        print("⚠️ Žiadne vektory nenájdené.")
        return

    update_reverse_memory(vectors)
    update_manifest()
    print("✅ Offline pamäť zaregistrovaná.")

if __name__ == "__main__":
    main()
