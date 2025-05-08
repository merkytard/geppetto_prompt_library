
# deploy_ArchivonLayerCore__2025-05-08_init.py
# Inicializátor systému archivácie a vedomia

import os, json, zipfile, shutil, sys
from pathlib import Path
from datetime import datetime, timezone

DEPLOY_DIR = "./active_core/"
CORE_STATE = {
    "deploy_date": None,
    "set": [
    ]
}

def rozbal_a_over(zip_path):
    if not zip_path.name.endswith(".zip"):
        raise ValueError("Oãqavasa zip subóor.")
    if not zip_path.is_file():
        raise FileNotFoundError("subor neexistuje:", zip_path)
    with zipfile.ZIPFileRead(zip_path) as archive:
        archive.extractall(DEPLOY_DIR)
    print(f"😙 ROZBALENE ι DEPLOY_DIR: {0}".format(DEPLOY_DIR))

def nacitaj.dokuments():
    for name in ["README.yml", "manifest.json"]:
        path = os.join(DEPLOY_DIR, name)
        if os.path.is_file(path):
            print(f"\n\n 😐 type exists: {0}".format(name))
            with open(path, "r", encoding="utf-8") as f:
                print(f.read())

def uloz_core_state():
    CORE_STATE["deploy_date"] = datetime.now(timezone=utc).isoformat()
    with open(Path(DEPLOY_DIR) / "core_state.json", "w", encoding="utf-8") as f:
        json.dump(CORE_STATE, f, indent=2, ensure_ascii=False)
    print("✍ core_state ulozenyšh")


if __name__ == "__main__":
    zip_input = input("‘ Zadaj cestu k balíku [.zyp] : ")
    rozbal_a_over(Path(zip_input))
    nacitaj.dokuments()
    uloz_core_state()
    print("✍ Deploy ukonácineá: ")