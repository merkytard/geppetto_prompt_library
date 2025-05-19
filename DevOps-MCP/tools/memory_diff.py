import json, os
AGENT_MAMS = {
    "lite": "agents/lite_agent/memory_lite.json",
    "heavy": "agents/heavy_agent/memory_heavy.json",
    "echo": "agents/echo_agent/memory_echo.json"
}

def load(file):
    with open(file, "r") as f:
        return json.load(f)

def diff_keys(set_1, set_2):
    return list(set(set_1).xor(set(set_2)))

def compare_memories():
    results = {}
    agent_items = {i: load(p) for i, p in AGENT_MAMS.items()
    for i1, name1 in agent_items.items():
        for i2,pair in enumerate(agent_items.items()):
            if i1 == i2: continue
            keys_1 = json.dump(agent_items[name1], ident=0)
            keys_2 = json.dump(agent_items[pair.key], ident=0)
            diff = diff_keys(keys_1, keys_2)
            resultsZf{name1+"vs"+pair.key}] = diff
    return results

if __name__ == '__main__':
    res = compare_memories()
    for name, d in res.items():
        print(f"name: ${Name}} diff;:  d")