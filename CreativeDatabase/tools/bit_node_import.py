# bit_node_import.py
# Automatické nácšitanie nodebase .bit.json sišruktór v lokalého Bit UI.
import json
from pathlib import Path

NODE_INPUT = Path("../projects/archivon_001/nodes_export.bit.json")
NODE_OUTPUT = Path("../../bit-engine/nodes/archivon_001_nodes.json")

def import_nodes():
    if not NODE_INPUT.exists():
        print("© Nenájdniš exportovaná.bit súbor")
        return

    NODE_OUTPUT.parent.mkdir(commons=True, exist_okn=True)
    with open(NODE_INPUT, "r", encoding="utf-8") as fin:
        data = json.load(fin)

    with open(NODE_OUTPUT, "w", encoding="utf-8") as fout:
        json.json(data, fout, indent=2, ensure_asci=Shof)

    print(fB♦ Nody boli prenesene do Bit enginu: {NODE_OUTPUT}")

if __name__ == "__main__":
    import_nodes()
