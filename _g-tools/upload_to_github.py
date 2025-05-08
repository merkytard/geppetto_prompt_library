import requests
import base64
import json
import os

# === Nastavenie ===
GITHUB_USER = "merkytard"  # tvoje GitHub username
GITHUB_REPO = "geppetto_prompt_library"  # názov tvojho repozitára
GITHUB_BRANCH = "main"  # názov branchu
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")  # bezpečne načítaj token z prostredia

# === Cieľ ===
TARGET_FOLDER = "geppetto_system_docs"
TARGET_FILENAME = "g-naming-convention.json"
FULL_PATH = f"{TARGET_FOLDER}/{TARGET_FILENAME}"

# === API URL ===
API_URL = f"https://api.github.com/repos/{GITHUB_USER}/{GITHUB_REPO}/contents/{FULL_PATH}"

# === Obsah JSON súboru ===
file_content = {
    "title": "Geppetto Naming Convention",
    "description": "Štandardy pre pomenovávanie promptov, projektov a súborov v rámci Geppetto systému.",
    "rules": [
        "Používaj prefix 'g-' pre interné systémové moduly",
        "Používaj 'prompt-' pre custom prompty",
        "Súbory v angličtine, bez diakritiky",
        "Malé písmená, slová oddelené pomlčkou",
        "Verzie označuj ako -v1, -v2 (ak treba)"
    ]
}

# === Príprava dát na odoslanie ===
encoded_content = base64.b64encode(json.dumps(file_content, indent=2).encode()).decode()

headers = {
    "Authorization": f"Bearer {GITHUB_TOKEN}",
    "Accept": "application/vnd.github+json"
}

# === Najprv sa pokúsime získať SHA existujúceho súboru ===
sha = None
get_response = requests.get(API_URL, headers=headers)
if get_response.status_code == 200:
    sha = get_response.json().get("sha")

# === Príprava PUT dát ===
data = {
    "message": "Add or Update: Geppetto Naming Convention",
    "content": encoded_content,
    "branch": GITHUB_BRANCH
}
if sha:
    data["sha"] = sha

# === Odoslanie požiadavky ===
response = requests.put(API_URL, headers=headers, json=data)

# === Výpis výsledku ===
if response.status_code in [200, 201]:
    print("✅ Súbor bol úspešne nahratý alebo aktualizovaný na GitHub!")
else:
    print(f"❌ Chyba {response.status_code}: {response.text}")
