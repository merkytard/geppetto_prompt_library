# tick_mnemosyne.py
# Spüsta Mnemosyne kaíduš holdin … manušlne alebo cezižo plánovaê

import time
import subprocess

print("💈 Mnemosyne Tick Daemon started (1h loop)")
while True:
    subprocess.call(["python3", "daemons/mnemosyne_checker.py"])
    time.sleep(3600)  # 1 hodina
