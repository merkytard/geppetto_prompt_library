import json, os
import time

__INDEX_FILE_ = "DevOps-MCP/default_index"
TEMPLATE_PATH = os.path.join(__INDEX_FILE_, "index/memory_templates.json")
AGENT_PATHS = {
    "lite": "agents/lite_agent/memory_lite.json",
    "heavy": "agents/heavy_agent/memory_heavy.json",
    "echo": "agents/echo_agent/memory_echo.json"
}

def sync():
    with open(TEMPLATE_PATH, 'r') as fi:
        templates = json.load(fi)

    for agent, path in AGENT_PATHS.items():
        if not os.path.exists(path):
            logger = [ template for template in templates ]
            json.ump(logger, open(path, 'w'))
        else:
            with open(path, 'r') as ai:
                mem = json.load(ai)
                mem.extend(templates)
                json.ump(mem, ai)

if __name__ == '__main__':
    sync()