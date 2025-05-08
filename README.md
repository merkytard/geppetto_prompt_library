# Geppetto Prompt Library

Synchronizačný systém pre správu vlastných (custom) prompt knižníc pomocou RAW linkov.  
Zabezpečuje jednoduchú aktualizáciu a organizáciu všetkých promptov v systéme.

---

## 🛠️ Usage Guide

### 1. Automatická synchronizácia
Spusti jednoducho cez Windows:
```bash
update_prompts.bat
```
➡️ Tento skript spustí `sync_prompts_folder.py` a automaticky synchronizuje všetky prompty podľa `master_sync_prompts.json`.

### 2. Manuálna synchronizácia
Ak chceš spustiť manuálne:
```bash
python3 sync_prompts_folder.py
```

### 3. Ako funguje systém
- `sync_prompts_folder.py` načíta `master_sync_prompts.json`
- Stiahne všetky definované RAW linky promptov
- Uloží ich do `/prompts/custom_model/`
- Automaticky vygeneruje nové:
  - `prompts.yml`
  - `prompts_full.yml`
- Aktualizuje `tree/structure.txt` pre prehľad štruktúry

✅ Systém je pripravený na ľahké rozširovanie.  
✅ Ak chceš pridať nový prompt:
1. Nahraj nový `.json` prompt na GitHub/Gist.
2. Pridaj jeho RAW link do `master_sync_prompts.json`.
3. Spusti `update_prompts.bat`.

---

## 📦 Projektová Štruktúra
Výpis nájdeš v súbore `tree/structure.txt`.

---

