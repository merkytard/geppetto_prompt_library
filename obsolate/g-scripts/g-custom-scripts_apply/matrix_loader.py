# 🧩 matrix_loader.py – Dynamický loader pre fraktálny matrix systém
import json, os, subprocess

CONFIG_PATH = "./matrix_registry.json"

# === Načítanie konfigurácie ===
def load_matrix_config(path=CONFIG_PATH):
    if not os.path.exists(path):
        print(f"❌ Konfiguračný súbor {path} neexistuje.")
        return None
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

# === Spustenie scriptu podľa mena ===
def run_script(script_name):
    try:
        subprocess.run(["python", script_name])
    except Exception as e:
        print(f"⚠️ Chyba pri spúšťaní {script_name}: {e}")

# === Zobrazenie indexov ===
def display_index(indexes):
    print("\n🧠 AKTÍVNE INDEXY:")
    for k, v in indexes.items():
        print(f"- {k}: {v}")

# === Zobrazenie prepojenej pamäti ===
def display_memory_links(memory):
    print("\n🔗 LINKED MEMORY:")
    for m in memory:
        print(f"- {m}")

# === Main loader ===
def main():
    config = load_matrix_config()
    if not config:
        return

    print("\n📦 MATRIX LOADER AKTIVOVANÝ")
    display_index(config.get("index_definitions", {}))
    display_memory_links(config.get("linked_memory", []))

    for key, script in config.get("scripts", {}).items():
        print(f"\n▶️ Spúšťam: {key} ({script})")
        run_script(script)

if __name__ == "__main__":
    main()
