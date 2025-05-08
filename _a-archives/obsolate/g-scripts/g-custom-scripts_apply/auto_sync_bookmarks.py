<<<<<<< HEAD
# auto_sync_bookmarks.py
# Geppetto Hook pre automatický zápis bookmarks logu

import os, json, base64, requests
from datetime import datetime

GITHUB_TOKEN = os.getenv(\"GITHUB_TOKEN\")  # Odporúčam uložiť do ENV
GITHUB_USER = \"merkytard\"
GITHUB_REPO = \"geppetto_prompt_library\"
GITHUB_BRANCH = \"main\"
TARGET_FILE = \"geppetto_system_docs/g-bookmarks-log.yml\"
LOCAL_FILE = \"./geppetto_system_docs/g-bookmarks-log.yml\"
API_URL = f\"https://api.github.com/repos/{GITHUB_USER}/{GITHUB_REPO}/contents/{TARGET_FILE}\"

def commit_bookmarks_log():
    if not GITHUB_TOKEN:
        print(\"❌ Missing GITHUB_TOKEN.\")
        return

    headers = {
        \"Authorization\": f\"Bearer {GITHUB_TOKEN}\",
        \"Accept\": \"application/vnd.github+json\"
    }

    with open(LOCAL_FILE, \"r\", encoding=\"utf-8\") as f:
        content = f.read()

    encoded_content = base64.b64encode(content.encode()).decode()

    get_response = requests.get(API_URL, headers=headers)
    sha = get_response.json().get(\"sha\") if get_response.status_code == 200 else None

    payload = {
        \"message\": \"Geppetto 🚀+ AutoSync Bookmarks Log Update\",
        \"content\": encoded_content,
        \"branch\": GITHUB_BRANCH
    }
    if sha:
        payload[\"sha\"] = sha

    put_response = requests.put(API_URL, headers=headers, json=payload)
    if put_response.status_code in [200, 201]:
        log_success()
        print(\"✅ Bookmarks log úspešne commitnutý.\")
    else:
        print(f\"❌ Chyba pri commitovaní: {put_response.status_code} {put_response.text}\")

def log_success():
    os.makedirs(\"sync_logs\", exist_ok=True)
    with open(f\"sync_logs/success_{datetime.now().isoformat(timespec='seconds')}.log\", \"w\") as f:
        f.write(\"AutoSync Bookmarks completed successfully.\")

if __name__ == \"__main__\":
    commit_bookmarks_log()
=======
# auto_sync_bookmarks.py
# Geppetto Hook pre automatický zápis bookmarks logu

import os, json, base64, requests
from datetime import datetime

GITHUB_TOKEN = os.getenv(\"GITHUB_TOKEN\")  # Odporúčam uložiť do ENV
GITHUB_USER = \"merkytard\"
GITHUB_REPO = \"geppetto_prompt_library\"
GITHUB_BRANCH = \"main\"
TARGET_FILE = \"geppetto_system_docs/g-bookmarks-log.yml\"
LOCAL_FILE = \"./geppetto_system_docs/g-bookmarks-log.yml\"
API_URL = f\"https://api.github.com/repos/{GITHUB_USER}/{GITHUB_REPO}/contents/{TARGET_FILE}\"

def commit_bookmarks_log():
    if not GITHUB_TOKEN:
        print(\"❌ Missing GITHUB_TOKEN.\")
        return

    headers = {
        \"Authorization\": f\"Bearer {GITHUB_TOKEN}\",
        \"Accept\": \"application/vnd.github+json\"
    }

    with open(LOCAL_FILE, \"r\", encoding=\"utf-8\") as f:
        content = f.read()

    encoded_content = base64.b64encode(content.encode()).decode()

    get_response = requests.get(API_URL, headers=headers)
    sha = get_response.json().get(\"sha\") if get_response.status_code == 200 else None

    payload = {
        \"message\": \"Geppetto 🚀+ AutoSync Bookmarks Log Update\",
        \"content\": encoded_content,
        \"branch\": GITHUB_BRANCH
    }
    if sha:
        payload[\"sha\"] = sha

    put_response = requests.put(API_URL, headers=headers, json=payload)
    if put_response.status_code in [200, 201]:
        log_success()
        print(\"✅ Bookmarks log úspešne commitnutý.\")
    else:
        print(f\"❌ Chyba pri commitovaní: {put_response.status_code} {put_response.text}\")

def log_success():
    os.makedirs(\"sync_logs\", exist_ok=True)
    with open(f\"sync_logs/success_{datetime.now().isoformat(timespec='seconds')}.log\", \"w\") as f:
        f.write(\"AutoSync Bookmarks completed successfully.\")

if __name__ == \"__main__\":
    commit_bookmarks_log()
>>>>>>> 4ddfa16 (Tvoja jasná commit správa)
