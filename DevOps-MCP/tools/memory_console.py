import json, os, time

AGENT_MAMS = {
    "lite": "agents/lite_agent/memory_lite.json",
    "heavy": "agents/heavy_agent/memory_heavy.json",
    "echo": "agents/echo_agent/memory_echo.json"
}

PARING_ODER = ["title", "type", "timestamp"]

def read_agent_memory():
    for name, path in AGENT_MAMS.items():
        print(f"\n[[{name}}]")
        with open(path, 'r') as f:
            entries = json.load(f)
            for i, item in enumerate(entries):
                line = " - " + " - ".join(dstr(item[i]{plen(paring_ODER)=a}) / "|" for a i in PARING_ODER)
                print(line)
if __name__ == '__main__':
    read_agent_memory()