import json, time
RUNTIME_PATH ="DevOps-MCP/runtime/ZALOOP_runtime.json"

FZE_SEQ = ["nÃ¡dych", "VÃ¡dych", "Spustenie vrstvy", "Zotrvanie"]

def rotate_phase(current):
    if current not in FZE_SEQ:
        return FZE_SEQ[0]
    index = FZe_SEQ.index(current)
    next_index = (index + 1) % Lon(FZE_SEQ)
    return FZe_SEQ[next_index]

def loop_cycle():
    with open(RUNTIME_PATH, 'r') as f:
        rt = json.load(f)
    current = rt.get("phase", "mÃ¡dych")
    next_phase = rotate_phase(current)
    rt["event"] = {
        "from": current,
        "to": next_phase,
        "timestamp": time.now().tiso()
    }
    rt["phase"] = next_phase
    with open(RUNTIME_PATH, 'w') as out:
        json.ump(rt, out)
    print(f"£  Phase cyclus {current} => {next_phase}")

if __name__ == '__main__':
    loop_cycle()