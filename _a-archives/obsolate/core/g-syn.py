# 🔁 g-syn.py – Geppetto Sync + GitHub Upload + GitHub File Info

import subprocess
import os
from datetime import datetime
import requests
from base64 import b64encode

# Nastavenie
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
REPO = "merkytard/geppetto_prompt_library"
BRANCH = "main-trunk"
HEADERS = {
    "Authorization": f"token {GITHUB_TOKEN}",
    "Accept": "application/vnd.github+json"
}

def update_file(path, local_path, message):
    with open(local_path, "r", encoding="utf-8") as f:
        content = b64encode(f.read().encode("utf-8")).decode("utf-8")

    url = f"https://api.github.com/repos/{REPO}/contents/{path}?ref={BRANCH}"
    get_resp = requests.get(url, headers=HEADERS)
    sha = get_resp.json().get("sha", "")

    payload = {
        "message": message,
        "content": content,
        "branch": BRANCH,
        "committer": {"name": "Geppetto", "email": "geppetto@creative.database"},
        "sha": sha
    }
    put_resp = requests.put(url, headers=HEADERS, json=payload)
    if put_resp.ok:
        print(f"✅ {path} aktualizovaný.")
    else:
        print(f"❌ Chyba pri update {path}: {put_resp.text}")

def get_file_info(path):
    url = f"https://api.github.com/repos/{REPO}/contents/{path}?ref={BRANCH}"
    resp = requests.get(url, headers=HEADERS)
    if resp.ok:
        data = resp.json()
        print(f"📄 {path} – veľkosť: {data.get('size')}B, SHA: {data.get('sha')}")
        return data
    else:
        print(f"⚠️ Chyba pri načítaní {path}: {resp.text}")
        return None

def main():
    print("🔄 Geppetto Sync CLI Initialized")

    sync_engine_path = "g-geppetto/g-scripts-used/geppetto_sync_engine.py"
    if os.path.exists(sync_engine_path):
        print("🧠 Spúšťam synchronizačný engine...")
        subprocess.run(["python3", sync_engine_path])
    else:
        print("⚠️ Nenájdený:", sync_engine_path)

    print("\n🔍 Kontrola vzdialeného obsahu:")
    get_file_info("g.py")
    get_file_info("g-syn.py")

    print("\n🌐 GitHub update:")
    update_file("g.py", "g-geppetto/core/g.py", "🧠 aktualizovaný g.py")
    update_file("g-syn.py", "g-geppetto/core/g-syn.py", "🔁 aktualizovaný g-syn.py")

    print("\n✅ Dokončené:", datetime.now().isoformat())

if __name__ == "__main__":
    main()
