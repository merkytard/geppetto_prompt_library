# deploy_archivon.py – Spustenie a nasadenie Archivona z lokálneho ZIP balíka
import zipfile
from pathlib import Path

# Cesta k ZIP archívu a cieľový deploy priečinok
zip_path = Path("Archivon_Deploy_v1.zip")
deploy_path = Path("CreativeDatabase/agents/archivon")

def deploy_archivon():
    if not zip_path.exists():
        print("❌ ZIP súbor neexistuje!")
        return

    print(f"📦 Rozbaľujem Archivona do {deploy_path}...")
    deploy_path.mkdir(parents=True, exist_ok=True)

    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        for member in zip_ref.namelist():
            if member.startswith("Archivon/"):
                filename = member.replace("Archivon/", "")
                if filename:
                    with zip_ref.open(member) as source:
                        content = source.read()
                        (deploy_path / filename).write_bytes(content)

    print("✅ Archivon bol úspešne nasadený.")

if __name__ == "__main__":
    deploy_archivon()