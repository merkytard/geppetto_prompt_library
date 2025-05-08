# g-syn.py

import subprocess
import os
from datetime import datetime

print("\n🔄 Geppetto Sync CLI Initialized\n")

# Synchronizačný engine
sync_engine_path = "g-geppetto/g-scripts-used/geppetto_sync_engine.py"

if os.path.exists(sync_engine_path):
    print("🧠 Spúšťam synchronizačný engine...")
    subprocess.run(["python3", sync_engine_path])
else:
    print("⚠️  Nenájdený:", sync_engine_path)

print("\n✅ Dokončené:", datetime.now().isoformat())
