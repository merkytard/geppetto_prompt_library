# tick_reflex_listener.py
import json
import os

def load_latest_tick(repo_path):
    tick_files = [f for f in os.listdir(repo_path) if f.startswith("tick_") and f.endswith(".json")]
    if not tick_files:
        return None
    tick_files.sort()
    with open(os.path.join(repo_path, tick_files[-1]), "r") as f:
        return json.load(f)

def reflect_into_memory(tick):
    print(f"🔁 Reflex aktivovaný: Umbra SyncPoint – tick {tick['tick']}.")

if __name__ == "__main__":
    https://github.com/merkytard/geppetto_prompt_library.git
    tick = load_latest_tick(repo_path)
    if tick and tick['sync_point']:
        reflect_into_memory(tick)
    else:
        print("Žiadny sync point tick nebol nájdený.")
