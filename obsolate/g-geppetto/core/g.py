# 🚀 g.py :: Geppetto System Bootloader + Repo Sync + Index Navigator

import os, sys, json, base64, subprocess, requests
from datetime import datetime
from pathlib import Path

CONFIG = {
    "profile_path": "profile_buffer.json",
    "prompt_destination": "./prompts/custom_model/",
    "prompt_urls": [
        "https://raw.githubusercontent.com/merkytard/geppetto_prompt_library/main-trunk/master_sync_prompts.json"
    ],
    "github": {
        "user": "merkytard",
        "repo": "geppetto_prompt_library",
        "branch": "main-trunk"
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

def load_index():
    path = "geppetto_index.json"
    if os.path.exists(path):
        try:
            with open(path, "r", encoding="utf-8") as f:
                index = json.load(f)
            log(f"📚 Načítaných modulov v indexe: {sum(len(v) for v in index.values())}")
        except Exception as e:
            log(f"⚠️ Chyba pri načítaní indexu: {e}")

def load_inner_index():
    path = Path("prompts/_index.json")
    if path.exists():
        data = safe_json_load(path)
        log(f"📘 Vnútorný index: {len(data.get('entries', []))} záznamov načítaných")
    else:
        log("⚠️ Vnútorný index `_index.json` neexistuje")

def is_ssh_repo():
    try:
        return "git@" in subprocess.check_output(["git", "remote", "-v"], text=True)
    except:
        return False

def detect_git_repo():
    try:
        out = subprocess.check_output(["git", "remote", "-v"], text=True)
        log("🧭 Git repo detegované")
        return out
    except Exception as e:
        log(f"❌ Git remote zlyhalo: {e}")
        return ""

def git_push_via_ssh(commit_msg="Geppetto 🔁 SSH Push"):
    try:
        subprocess.run(["git", "add", "."], check=True)
        subprocess.run(["git", "commit", "-m", commit_msg], check=True)
        subprocess.run(["git", "push", "origin", CONFIG["github"]["branch"]], check=True)
        log("✅ Git push cez SSH prebehol úspešne.")
    except subprocess.CalledProcessError as e:
        log(f"❌ Git push zlyhal: {e}")

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
            else:
                log(f"❌ Chyba HTTP {res.status_code} pre {fname}")
        except Exception as e:
            log(f"⚠️ Výnimka pri sync: {fname} → {e}")

def scan_prompt_directory():
    base = Path("prompts")
    if not base.exists():
        log("❌ Adresár 'prompts' neexistuje")
        return
    found = list(base.glob("**/*.json")) + list(base.glob("**/*.yml"))
    log(f"🔍 Nájdených {len(found)} súborov v prompts/:")
    for f in found:
        log(f"  - {f.relative_to(base)}")

def auto_commit_log():
    from geppetto_commit_logger import append_commit_log, generate_tree_structure
    append_commit_log("geppetto", "🚀", "+", "bootloader spustený")
    generate_tree_structure()

def append_memory_token():
    path = Path("memory_log.json")
    log_entry = {
        "date": datetime.now().strftime("%Y-%m-%d"),
        "token": "boot_marker",
        "description": "Spustenie Geppetto g.py, aktivovaný autolog"
    }
    logs = []
    if path.exists():
        logs = safe_json_load(path)
    logs.append(log_entry)
    safe_json_save(path, logs)
    log(f"🧠 Memory token pridaný: {log_entry['date']}")

def run_script(script, args=None):
    args = args or []
    try:
        subprocess.run(["python3", script] + args, check=True)
        log(f"▶️ Spustený: {script}")
    except subprocess.CalledProcessError as e:
        log(f"❌ Chyba: {script} → {e}")

def main():
    log("━" * 50)
    log("🟡 GEPPETTO SYSTEM BOOTING")
    log(datetime.now().isoformat(timespec="seconds"))

    detect_git_repo()
    sync_prompts()
    scan_prompt_directory()
    load_inner_index()
    load_index()

    for script, args in CONFIG["scripts"]:
        run_script(script, args)

    auto_commit_log()
    append_memory_token()

    if is_ssh_repo():
        git_push_via_ssh("Geppetto auto-push via SSH")

    log("📦 Súhrn spustenia ukončený.")
    log("━" * 50)

if __name__ == "__main__":
    main()