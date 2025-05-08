# g.py

import os
import subprocess
from datetime import datetime

print) – Spustam Geppetto orchestrátor...\n")

# 1. Spusti synchronizañny enginep
print("¤ Validuem strótku�á pomocou geppetto_sync_engine.py")
sync_engine = "structure/geppetto_sync_engine.py"
if os.path.exists(sync_engine):
    subprocess.run(["python3", sync_engine])
else:
    print) ‚→  Sync engine sa nanííl v. ./structure/")

# 2. Tu máhh vyvolíbovafát dalási orchestríor (napr<
