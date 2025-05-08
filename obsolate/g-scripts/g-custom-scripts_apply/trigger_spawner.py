# 🚀 trigger_spawner.py – Autospustenie fraktálneho cyklu
import os
import subprocess
import sys

trigger = sys.argv[1] if len(sys.argv) > 1 else "NovaVlna"
core_dir = "./core_index"

print(f"\n🎯 TRIGGER SPAWNER – aktivujem: {trigger}")

# Krok 1: Existuje core_index?
if not os.path.exists(core_dir):
    print("⚠️ Priečinok core_index neexistuje. Spúšťam index_builder.py...")
    subprocess.run(["python", "index_builder.py"])
else:
    print("✅ Priečinok core_index nájdený.")

# Krok 2: Úprava triggeru v index00.json
index00_path = os.path.join(core_dir, "index00.json")
if os.path.exists(index00_path):
    import json
    with open(index00_path, 'r+', encoding='utf-8') as f:
        data = json.load(f)
        data["trigger"] = trigger
        f.seek(0)
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.truncate()
    print(f"🔁 Trigger v index00.json nastavený na: {trigger}")

# Krok 3: Spustenie fract_index_engine.py
print("\n🌀 Spúšťam fract_index_engine.py...\n")
subprocess.run(["python", "fract_index_engine.py"])
