# 🚀 Geppetto :: Bootloader a Orchestration Entry Point – SSH-Ready Edition

import os, sys, json, base64, subprocess, requests
from datetime import datetime
from pathlib import Path

# === KONFIGURÁCIA ===
CONFIG = {
    "profile_path": "profile_buffer.json",
    "prompt_destination": "./prompts/custom_model/",
    "prompt_urls": [
        "https://raw.githubusercontent.com/merkytard/geppetto_prompt_library/main/master_sync_prompts.json"
    ],
    "github": {
        "user": "merkytard",
        "repo": "geppetto_prompt_library",
        "branch": "main"
    },
    "scripts": [
        ("GEPPETTO_CORE.py", []),
        ("matrix_loader.py", []),
        ("trigger_spawner.py", ["NovaVlna"])
    ]
}

try:
    from token_loader import GITHUB_TOKEN
except ImportError:
    GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")

def log(msg): print(f"[Geppetto] {msg}")
def safe_json_load(path): return json.load(open(path, encoding="utf-8")) if os.path.exists(path) else {}
def safe_json_save(path, data): Path(path).parent.mkdir(parents=True, exist_ok=True); json.dump(data, open(path, "w", encoding="utf-8"), indent=2, ensure_ascii=False)

# === IndexZnalosti ===
def load_index():
    path = "geppetto_index.json"
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            index = json.load(f)
        log(f"📚 Načítaných modulov v indexe: {sum(len(v) for v in index.values())}")

# === GIT CEZ SSH ===
def is_ssh_repo():
    try:
        output = subprocess.check_output(["git", "remote", "-v"], text=True)
        return "git@" in output
    except:
        return False

def git_push_via_ssh(commit_msg="Geppetto 🔁 SSH Push"):
    try:
        subprocess.run(["git", "add", "."], check=True)
        subprocess.run(["git", "commit", "-m", commit_msg], check=True)
        subprocess.run(["git", "push", "origin", "main"], check=True)
        log("✅ Git push cez SSH prebehol úspešne.")
    except subprocess.CalledProcessError as e:
        log(f"❌ Git push zlyhal: {e}")
def commit_to_github(filepath, message="Geppetto 🚀 Commit"):
    if not GITHUB_TOKEN:
        log("❌ GITHUB_TOKEN chýba. Preskakujem commit.")
        return
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    encoded = base64.b64encode(content.encode()).decode()
    fname = os.path.basename(filepath)
    url = f"https://api.github.com/repos/{CONFIG['github']['user']}/{CONFIG['github']['repo']}/contents/prompts/custom_model/{fname}"
    headers = {
        "Authorization": f"Bearer {GITHUB_TOKEN}",
        "Accept": "application/vnd.github+json"
    }
    sha = requests.get(url, headers=headers).json().get("sha", None)
    payload = { "message": message, "content": encoded, "branch": CONFIG["github"]["branch"] }
    if sha: payload["sha"] = sha
    res = requests.put(url, headers=headers, json=payload)
    if res.status_code in [200, 201]:
        log(f"✅ Commit úspešný: {fname}")
    else:
        log(f"❌ Commit zlyhal: {res.status_code} → {res.text}")

def sync_prompts():
    os.makedirs(CONFIG["prompt_destination"], exist_ok=True)
    log("🔄 Synchronizujem prompty...")
    for url in CONFIG["prompt_urls"]:
        fname = os.path.basename(url)
        try:
            res = requests.get(url, timeout=10)
            if res.ok:
                path = os.path.join(CONFIG["prompt_destination"], fname)
                with open(path, "w", encoding="utf-8") as f:
                    f.write(res.text)
                log(f"✅ Prompt synchronizovaný: {fname}")
                commit_to_github(path, f"Sync {fname}")
            else:
                log(f"❌ Chyba HTTP {res.status_code} pre {fname}")
        except Exception as e:
            log(f"⚠️ Výnimka pri sync: {fname} → {e}")

def update_profile(script_path):
    profile = safe_json_load(CONFIG["profile_path"])
    profile.update({
        "last_trigger_script": script_path,
        "current_project": profile.get("current_project", "default")
    })
    safe_json_save(CONFIG["profile_path"], profile)
    log(f"🧭 Profil aktualizovaný: {script_path}")

def show_sync_status(script_path):
    profile = safe_json_load(CONFIG["profile_path"])
    log("🔍 SYNC STATUS:")
    log(f"  - Posledný spúšťač: {'🟢' if os.path.abspath(profile.get('last_trigger_script', '')) == os.path.abspath(script_path) else '🔴'}")
    log(f"  - Script existuje: {'🟢' if os.path.exists(script_path) else '🔴'}")

def run_script(script, args=None):
    args = args or []
    try:
        subprocess.run(["python3", script] + args, check=True)
        log(f"▶️ Spustený: {script}")
    except subprocess.CalledProcessError as e:
        log(f"❌ Chyba: {script} → {e}")

def main():
    boot_path = os.path.abspath(__file__)
    log("━" * 50)
    log("🟡 GEPPETTO SYSTEM BOOTING")
    log(datetime.now().isoformat(timespec="seconds"))
    sync_prompts()
    update_profile(boot_path)
    show_sync_status(boot_path)

    for script, args in CONFIG["scripts"]:
        run_script(script, args)

    if is_ssh_repo():
        git_push_via_ssh("Geppetto auto-push via SSH")

    log("📦 Súhrn spustenia:")
    log(f"  - Token načítaný: {'🟢' if GITHUB_TOKEN else '🔴'}")
    log(f"  - SSH pripojenie: {'🟢' if is_ssh_repo() else '🔴'}")
    log(f"  - Počet skriptov: {len(CONFIG['scripts'])}")
    log(f"  - GitHub user: {CONFIG['github']['user']} → {CONFIG['github']['repo']}")
    log("━" * 50)

if __name__ == "__main__":
    main()
