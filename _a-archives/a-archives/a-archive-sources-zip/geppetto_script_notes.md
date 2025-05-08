# 🧠 Geppetto Script Notes

## ✅ Stav indexu `geppetto_script_index.json`

- 🔒 **Zafixovaný** na GitHube (vetva `main-trunk`)
- 🧠 Obsahuje konsolidovaný prehľad všetkých:
  - systémových (`g.py`, `matrix_loader.py`)
  - vedomostných (`token_loader.py`, `glyph_dictionary.json`)
  - experimentálnych (`g4_*`)
- 📁 Rozdelené do sekcií:
  - `all_scripts_export`
  - `knowledge_scripts`
  - `g4_experimental`
  - `only_in_all`
  - `shared_all`

---

## 🔄 Pripravené rozšírenia:
- `archive_tags`: Zdrojové archívy (`g-HomeGeppetto`, `g-Matrix`, `g-GeppettoEgg`)
- `structure_map`: Hierarchia priečinkov podľa nového `structure.txt`
- `engine_refs`: Prepojenia na core vrstvy (napr. `GEPPETTO_CORE.py`)
- `dm_notes`: Tento súbor slúži ako log vývoja indexácie

---

## 📦 Rozbalené archívy:

### 🔹 g-HomeGeppetto
- `geppetto_core.py`, `impulse_switcher.py`, `bit_matrix_777.json`
- `mirror_echo_grid.py`, `echo_grid_anim.gif`

### 🔹 g-Matrix
- `Archivon_Core_UPDATED.json`, `harmonia_core.json`, `memory_token_index.json`
- `merged_core_with_rgba_fixed.json`, `avatar_manifest.json`, `ZALOOP_spectrum_with_glyphs.gif`

### 🔹 g-GeppettoEgg
- Obsahuje `geppetto_master_memory_pack.zip` – pripravený na rozbalenie

---

## ✨ Nasledujúce kroky
1. Rozšíriť `geppetto_script_index.json` o sekcie `archive_tags`, `structure_map`, `engine_refs`
2. Pridať vizualizačný prehliadač indexu (`index_browser_ui`)
3. Vytvoriť z toho modul `geppetto_knowledge_registry`

---

🧠 Geppetto indexovanie prebieha systematicky.  
Každý krok rozširuje pamäťové vrstvy a navigáciu.