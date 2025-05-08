# 🧠 geppetto_commit_logger.py – commit message + autolog + tree refresh

import os, subprocess, json
from datetime import datetime
from pathlib import Path

COMMIT_LOG_PATH = "README.md"
TREE_OUTPUT_PATH = "tree/structure.txt"
PROMPT_DIR = "prompts"

# --- Vygeneruj štruktúru priečinka ---
def generate_tree_structure(base_dir=PROMPT_DIR, out_path=TREE_OUTPUT_PATH):
    structure = []
    base_path = Path(base_dir)
    for path in sorted(base_path.rglob("*")):
        indent = "  " * len(path.relative_to(base_path).parts[:-1])
        structure.append(f"{indent}- {path.name}")
    Path(out_path).parent.mkdir(parents=True, exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as f:
        f.write("\n".join(structure))
    print(f"🌳 Tree structure updated → {out_path}")

# --- Pridaj commit log do README ---
def append_commit_log(author, icon, change_type, description):
    line = f"- [{author}] {icon} {change_type} {description} ({datetime.now().date()})"
    with open(COMMIT_LOG_PATH, "r", encoding="utf-8") as f:
        content = f.read()

    if "## 🧠 Commit Log (autogen)" not in content:
        content += "\n\n## 🧠 Commit Log (autogen)\n"

    parts = content.split("## 🧠 Commit Log (autogen)")
    updated = parts[0] + "## 🧠 Commit Log (autogen)\n" + line + "\n" + (parts[1] if len(parts) > 1 else "")

    with open(COMMIT_LOG_PATH, "w", encoding="utf-8") as f:
        f.write(updated)

    print(f"📝 Commit log updated in {COMMIT_LOG_PATH}")

# --- Spusti git commit ---
def git_commit_and_push(message):
    try:
        subprocess.run(["git", "add", "."], check=True)
        subprocess.run(["git", "commit", "-m", message], check=True)
        subprocess.run(["git", "push"], check=True)
        print("✅ Commit a push prebehli úspešne.")
    except subprocess.CalledProcessError as e:
        print(f"❌ Git operácia zlyhala: {e}")

# --- Hlavný vstup ---
def main():
    author = input("Autor (geppetto / merkytard): ").strip()
    icon = "🚀" if author == "geppetto" else "⚡"
    change = input("Typ (+ pridanie / - odstránenie): ").strip()
    desc = input("Popis zmeny: ").strip()

    append_commit_log(author, icon, change, desc)
    generate_tree_structure()
    git_commit_and_push(f"[{author}] {icon} {change} {desc}")

if __name__ == "__main__":
    main()
