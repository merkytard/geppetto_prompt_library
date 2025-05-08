# auto_git_sync.py
import subprocess
import os
import sys

def push_tick_to_git(file_path):
    https://github.com/merkytard/geppetto_prompt_library.git
    repo_path = "/path/to/your/repo"

    os.chdir(repo_path)
    subprocess.run(["git", "add", file_path])
    subprocess.run(["git", "commit", "-m", f"Auto-sync tick {file_path}"])
    subprocess.run(["git", "push"])
    print(f"✅ Tick {file_path} bol synchronizovaný do Gitu.")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Použitie: python auto_git_sync.py tick_42.json")
    else:
        push_tick_to_git(sys.argv[1])
