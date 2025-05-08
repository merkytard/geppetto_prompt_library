
# 🧠 GEPPETTO_CORE.py
# Kompletný štartovací balíček: inicializácia + zápis + pamäťový zápisník

import os, json
from datetime import datetime

# Cesty
profile_path = "profile_buffer.json"
bit_dir = "bitmemory_buffer"
bitmemory_path = os.path.join(bit_dir, "profilBuffer_week.json")
bit_index_path = os.path.join(bit_dir, "BitMemory_FragBuffer_Index.json")

# --- Inicializácia pamäte ---
os.makedirs(bit_dir, exist_ok=True)

if not os.path.exists(bitmemory_path):
    week_structure = {
      "#Pondelok": [], "#Utorok": [], "#Streda": [],
      "#Štvrtok": [], "#Piatok": [], "#Sobota": [], "#Nedeľa": []
    }
    with open(bitmemory_path, "w", encoding="utf-8") as f:
        json.dump(week_structure, f, indent=2, ensure_ascii=False)

if not os.path.exists(bit_index_path):
    bit_meanings = {
      "01": "🌬️ Nádych – nový impulz",
      "10": "💨 Výdych – smerové rozhodnutie",
      "11": "⚡ Spustenie vrstvy",
      "00": "⏹️ Zotrvanie, ladenie"
    }
    with open(bit_index_path, "w", encoding="utf-8") as f:
        json.dump({ "bit_meanings": bit_meanings }, f, indent=2, ensure_ascii=False)

if not os.path.exists(profile_path):
    with open(profile_path, "w", encoding="utf-8") as f:
        json.dump({ "current_project": "default" }, f, indent=2, ensure_ascii=False)

# --- Zápis spúšťacieho fragmentu ---
with open(bitmemory_path, "r", encoding="utf-8") as f:
    week = json.load(f)
with open(bit_index_path, "r", encoding="utf-8") as f:
    bit_index = json.load(f)
with open(profile_path, "r", encoding="utf-8") as f:
    buffer = json.load(f)

day_key = "#" + datetime.now().strftime("%A")
bit = "11"
fragment = {
    "time": datetime.now().isoformat(timespec="seconds"),
    "bit": bit,
    "meaning": bit_index.get("bit_meanings", {}).get(bit, "⚡ Spustenie vrstvy"),
    "note": "GEPPETTO_CORE spustený",
    "linked_project": buffer.get("current_project", "default")
}
week.get(day_key, []).append(fragment)
with open(bitmemory_path, "w", encoding="utf-8") as f:
    json.dump(week, f, indent=2, ensure_ascii=False)

print(f"🧠 GEPPETTO_CORE spustený → {fragment['note']} → {fragment['meaning']}")
