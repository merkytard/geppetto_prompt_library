# archivon_cycle_runner.py
# Spúšťa kompletný Archivon tok: zápis pamäte → echo → export → nodebase

import os

print("""\n🔁 Spúšťam Archivon CYCLE: zápis → echo → export → nodebase\n""")

# Krok 1: Zápis pamäťového fragmentu cez Imprintor (simulácia)
print("🧠 Zápis fragmentu pamäte cez Imprintor...")
os.system("echo '{"intent": "spomienka na farbu", "echo_level": 0.82, "bit": "11", "time": "2025-05-10T"}' > ../memory/memory_archivon.json")

# Krok 2: Echo & Resonancia – symbolický tok (placeholder)
print("🎶 Generovanie echo signálu...")
# Tu by bol volaný chat_to_emotion alebo glyph match – zjednodušené
os.system("echo '[{"tone": "láska", "symbol": "∆"}]' > ../memory/echo_resonance_map.json")

# Krok 3: Export do nodebase
print("📤 Export do nodebase...")
os.system("python3 archivon_to_nodebase.py")

# Krok 4: Import do Bit engine
print("📡 Import do Bit UI...")
os.system("python3 bit_node_import.py")

print("\n✅ Archivon CYCLE dokončený.")
