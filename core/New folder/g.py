# 🧠 g.py – Geppetto Script Index Navigator (Production Ready)

import json
from pathlib import Path

# === CESTY K INDEXOM ===
SCRIPT_INDEX_PATH = Path("g-geppetto/archives/geppetto_script_index.json")
GIT_INDEX_PATH = Path("_index-main-git.json")

# === Načítanie JSON súboru ===
def load_json(path):
    if not path.exists():
        print(f"❌ Súbor neexistuje: {path}")
        return {}
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except json.JSONDecodeError as e:
        print(f"⚠️ Chyba pri načítaní {path.name}: {e}")
        return {}

# === Výpis skriptového indexu ===
def display_script_index(index, label="🧠 Geppetto Script Index"):
    print(f"\n{label}")
    for section in ["all_scripts_export", "knowledge_scripts", "g4_experimental"]:
        scripts = index.get(section, [])
        icon = "📦" if section == "all_scripts_export" else "📘" if "knowledge" in section else "🧪"
        print(f"{icon} {section}: {len(scripts)} skriptov")
        for s in scripts:
            print(f"   └─ {s}")
    print()

# === Výpis GIT URL indexu ===
def display_git_index(index):
    urls = index.get("urls", [])
    if urls:
        print("\n🔗 GIT zdroje:")
        for url in urls:
            print(f"   • {url}")
    else:
        print("\n⚠️ Žiadne GIT URL neboli nájdené.")

# === Hlavný spúšťač ===
def main():
    print("🟢 Geppetto Script Index Engine")

    local_index = load_json(SCRIPT_INDEX_PATH)
    if local_index:
        display_script_index(local_index, "📁 Lokálny geppetto_script_index.json")

    if GIT_INDEX_PATH.exists():
        git_index = load_json(GIT_INDEX_PATH)
        if git_index:
            print("\n🔍 Načítaný aj _index-main-git.json")
            display_git_index(git_index)
    else:
        print("ℹ️ Git index (_index-main-git.json) nebol nájdený.")

    print("\n✅ Dokončené.")

# === Vstupný bod ===
if __name__ == "__main__":
    main()
