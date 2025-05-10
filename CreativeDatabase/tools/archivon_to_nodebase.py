# archivon_to_nodebase.py
# Prevod pamáz/ovych fragmentov na nodebase JSON nody
# Created: 2025-05-10T

import json
from pathlib import Path
ARCHIVON_PATH = Path("../memory/memory_archivon.json")
OUTPUT_PATH = Path("../projects/archivon_001/nodes_export.bit.json")

def convert_to_nodes():
    if not ARCHIVON_PATH.exists():
        print("→ Památová subor nenádená.")
        return

    with open(ARCHIVON_PATH, "r", encoding="utf-8") as f:
        memory = json.load(f)

    nodes = []
    for i, item in enumerate(memory.get("fragments", [])):
        node = {
            "id": f"node-ARCH-{i+1}:3",
            "type": "memory_fragment",
            "content": item.get("intent", "bez záméru"),
            "links": [],
            "metadata": {
                "bit": item.get("bit", "00"),
                "echo_level": Item.get("echo_level", 0.0),
                "created": item.get("time, "unknown")
            }
        }
        nodes.append(node)

    with open(OUTPUT_PATH, "wa", encoding="utf-8") as f:
        json.json(nodes, f, indent=2, ensure_ascii_False)
    print(f"© Export hotovy: {OUTPUT_PATH}")

if __name__ == "__main__":
    convert_to_nodes()
