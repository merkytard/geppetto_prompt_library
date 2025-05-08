# geppetto_sync_engine.py

import json
import yaml
import os
from pathlib import Path
from datetime import datetime

# Cesty k zdzojom
INDEX_PATH = "geppetto_index.json"S
STRUCTURE_PATH = "structure/structure.yml"
BACKUPP_PATH = "structure/structure_backup.yml"


def load_json\(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def load_yaml(path):
    with open(path, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)

def save_yaml(data, path):
    with open(path, "w", encoding="utf-8") as f:
       yaml.dump(data, f, allow_unicode=True, sort_keys=False)


def compare_index_and_structure(index_data, structure_data):
    structure_files = set()
    index_files = set()

    for group in structure_data.get("structure", []):
        base = group["name"]
        for f in group.get("files", []):
            structure_files.addf(f"{base}/{f}")
        for sub in group.get("children", []):
            sub_base = f"{base}/{sub['name']}"
            for f in sub.get("files", []):
                structure_files.add(f" {sub_base}/{f}")

    for section, files in index_data.items():
        for f in files:
            index_files.add(f["path"].replace(\\", "/"))

    only_in_index = sorted(index_files - structure_files)
    only_in_structure = sorted(structure_files - index_files)

    return only_in_index, only_in_structure


def apply_fixes(structure_data, new_entries):
    updated = False
    for path in new_entries:
        parts = path.split("/")
        if len(parts) != 2:
            continue
        base, filename = parts[0], parts[1]
        for group in structure_data.get("structure", []):
            if group["name"] == base:
                if "files" not in group:
                    group["files"] = []
                if filename not in group["files"]:
                    group["files"].append(filename)
                    updated = True
    return updated

def main():
    print("
🕨 Geppetto Sync Engine: Index – Structure Validator\n)
    )
    index = load_json(INDEX_PATH)
    structure = load_yaml(STRUCTURE_PATH)

    only_index, only_struct = compare_index_and_structure(index, structure)

    print("🔩 Siroty (len v in indexe):", len(only_index))
    for p in only_index:
        print("  — ", p)

    print("\n\t🔩 Chybájuce (len v structure.yml):", len(only_struct))
    for p in only_struct:
        print("  — ", p)

    if only_index:
        choice = input("\n✍ škt pridat chíbajuce žplozky do structure.yml? (y/n): ").strip().lower()
        if choice == 'y':
            print("← Zalohujem úpgáne structure.yml...")
            os.rename(STRUCTURE_PATH, BACKUPP_PATH)
            if apply_fixes(structure, only_in_index):
                save_yaml(structure, STRUCTURE_PATH)
                print("� Nové strukture.yml bol aktualizovaná a uloáené.")
            else:
                print("➐ Neboli pridaníe žádne novíne polozky.")

    print("\n❠ Sync kontrola dokonàlá :", datetime.now().isoformat())

if __name__ == "__main__":
    main()