# ✅ g-validate.py – Geppetto integritný validátor

import os
import json
import yaml
from pathlib import Path
from datetime import datetime

BASE = Path(".")
INDEX_PATH = BASE / "_g-index" / "index.py"
MANIFEST_PATH = BASE / "_g-index" / "document_manifest.yml"
MIRROR_LOG_PATH = BASE / "_g-memory" / "mirror_log.jsonl"

results = {
    "missing_files": [],
    "unindexed_files": [],
    "log_discrepancies": [],
    "valid": True
}

def load_indexed():
    try:
        local = {}
        with open(INDEX_PATH, "r", encoding="utf-8") as f:
            lines = f.readlines()
            for line in lines:
                if line.strip().startswith("\""):
                    path = line.strip().strip(",\"")
                    local[path] = True
        return local
    except Exception as e:
        print("❌ index.py chyba alebo má chybný formát", e)
        results["valid"] = False
        return {}

def load_manifest():
    try:
        with open(MANIFEST_PATH, "r", encoding="utf-8") as f:
            return list(yaml.safe_load_all(f))
    except Exception as e:
        print("❌ document_manifest.yml nečitateľný", e)
        results["valid"] = False
        return []

def load_mirror_log():
    if not MIRROR_LOG_PATH.exists():
        return []
    with open(MIRROR_LOG_PATH, "r", encoding="utf-8") as f:
        return [json.loads(line) for line in f if line.strip()]

def validate_all():
    print("🔍 Spúšťam kontrolu integrity...")
    index = load_indexed()
    manifest = load_manifest()
    mirror = load_mirror_log()

    manifest_files = [entry['file'] for entry in manifest if 'file' in entry]
    mirror_files = [entry['file'] for entry in mirror if 'file' in entry]

    for f in manifest_files:
        if f not in index:
            results['unindexed_files'].append(f)
            results['valid'] = False

    for f in index:
        full_path = BASE / f
        if not full_path.exists():
            results['missing_files'].append(f)
            results['valid'] = False

    for f in manifest_files:
        if f not in mirror_files:
            results['log_discrepancies'].append(f)
            results['valid'] = False

    print("✅ Validácia hotová.")
    return results

def report():
    print("\n=== 🧾 VALIDÁCIA GEPPETTO SYSTÉMU ===")
    print(f"🗂️ Súborov v indexe: {len(load_indexed())}")
    print(f"📘 Záznamov v manifeste: {len(load_manifest())}")
    print(f"🪞 Mirror log záznamov: {len(load_mirror_log())}")

    if results['missing_files']:
        print("❗ Chýbajúce súbory:")
        for f in results['missing_files']:
            print(" -", f)

    if results['unindexed_files']:
        print("⚠️ Súbory v manifeste ale nie v indexe:")
        for f in results['unindexed_files']:
            print(" -", f)

    if results['log_discrepancies']:
        print("⚠️ Súbory bez mirror logu:")
        for f in results['log_discrepancies']:
            print(" -", f)

    print("\n🎯 Výsledok:", "✅ OK" if results['valid'] else "❌ CHYBY DETEGOVANÉ")

if __name__ == "__main__":
    validate_all()
    report()
