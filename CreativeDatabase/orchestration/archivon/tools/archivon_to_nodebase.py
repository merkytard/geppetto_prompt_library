# archivon_to_nodebase.py
# Prevod pamäťových fragmentov na nodebase JSON nody
# Created: 2025-05-10T

import json
from pathlib import Path

ARCHIVON_PATH = Path("../memory/memory_archivon.json")
OUTPUT_PATH = Path("../projects/archivon_001/nodes_export.bit.json")

def convert_to_nodes():
    if not ARCHIVON_PATH.exists():
        print("❌ Pamäťový súbor nenájdený.")
        return

    with open(ARCHIVON_PATH, "r", encoding="utf-8") as f:
        memory = json.load(f)

    nodes = []
    for i, item in enumerate(memory.get("fragments", [])):
        node = {
            "id": f"node-ARCH-{i+1:03}",
            "type": "memory_fragment",
            "content": item.get("intent", "bez zámeru"),
            "links": [],
            "metadata": {
                "bit": item.get("bit", "00"),
                "echo_level": item.get("echo_level", 0.0),
                "created": item.get("time", "unknown")
            }
        }
        nodes.append(node)

    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(nodes, f, indent=2, ensure_ascii=False)
    print(f"✅ Export hotový: {OUTPUT_PATH}")

if __name__ == "__main__":
    convert_to_nodes()
