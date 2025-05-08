# 🧠 g.py – Geppetto Navigator v3.0 (production-ready with CLI)

import json
from pathlib import Path
import argparse

SCRIPT_INDEX_PATH = Path("g-geppetto/archives/geppetto_script_index_updated.json")
GIT_INDEX_PATH = Path("_index-main-git.json")

def load_json(path: Path) -> dict:
    if not path.exists():
        print(f"❌ Súbor neexistuje: {path}")
        return {}
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except json.JSONDecodeError as e:
        print(f"⚠️ Chyba v {path.name}: {e}")
        return {}

def display_section(index: dict, section_name: str, icon: str = "•") -> None:
    items = index.get(section_name, [])
    if not items:
        print(f"{icon} {section_name}: (prázdne)")
        return
    print(f"{icon} {section_name} ({len(items)}):")
    for item in items:
        print(f"   └─ {item}")
    print()

def display_all_sections(index: dict, section_icons: dict) -> None:
    for section, icon in section_icons.items():
        display_section(index, section, icon)

def display_git_index(index: dict) -> None:
    urls = index.get("urls", [])
    print("\n🔗 GitHub URL index:")
    for url in urls:
        print(f"   • {url}")

def main():
    parser = argparse.ArgumentParser(description="Geppetto Script Navigator CLI")
    parser.add_argument("--section", help="Zobraz len konkrétnu sekciu", type=str)
    parser.add_argument("--refresh", action="store_true", help="Obnov a znova načítaj indexy")
    args = parser.parse_args()

    print("🟢 GEPPETTO NAVIGÁTOR")

    section_icons = {
        "all_scripts_export": "📦",
        "knowledge_scripts": "📘",
        "g4_experimental": "🧪"
    }

    local_index = load_json(SCRIPT_INDEX_PATH)
    if args.section:
        display_section(local_index, args.section, "🔍")
        return

    if local_index:
        print("\n📚 Lokálny Script Index:")
        display_all_sections(local_index, section_icons)

    if args.refresh:
        print("🔁 Obnovenie indexov zatiaľ neimplementované (TODO hook)")

    git_index = load_json(GIT_INDEX_PATH)
    if git_index:
        display_git_index(git_index)

    print("\n✅ Dokončené.")

if __name__ == "__main__":
    main()
