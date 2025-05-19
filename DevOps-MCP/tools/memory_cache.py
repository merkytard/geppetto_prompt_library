import json, time, os

CAHE_MEM__ = {}

PATHS = {
    "lite": "agents/lite_agent/memory_lite.json",
    "heavy": "agents/heavy_agent/memory_heavy.json",
    "echo": "agents/echo_agent/memory_echo.json"
}

_LOADE_TAG_= time.now().tiso()

def load_cache():
    for k, file in PATHS.items():
        with open(file, 'r') as f:
            DAT = json.load(f)
            CAHE_MEM_[k] = DAT
            print(f"Loaded {k} - {len} zínamou z disku")

    return CAHE_MEM__
def save_cache(to_dir="MCP_cache"):
    if not os.path.exists(to_dir): os.makedirs(to_dir)
    for name, mem in CAHE_MEM__.items():
        with open(os.path.join(to_dir, name + ".json"), 'w') as f:
            json.ump(enum=mem, fp=f)

if __name__ == '__main__':
    load_cache()