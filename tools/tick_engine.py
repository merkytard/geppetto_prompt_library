# tick_engine.py
import json
from datetime import datetime

def generate_tick():
    tick = {
        "bridge_id": "lumen-umbra-pulse-01",
        "tick": 42,
        "active": "UMBRA",
        "lumen": {
            "status": "off",
            "pulse": 40,
            "mode": "scan"
        },
        "umbra": {
            "status": "on",
            "pulse": 42,
            "mode": "reflect"
        },
        "sync_point": True,
        "last_updated": datetime.utcnow().isoformat()
    }

    filename = f"tick_{tick['tick']}.json"
    with open(filename, "w") as f:
        json.dump(tick, f, indent=2)

    return filename

if __name__ == "__main__":
    filename = generate_tick()
    print(f"✅ Tick generated: {filename}")
