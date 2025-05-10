# tick_mnemosyne.py
# Spúšťa Mnemosyne každú hodinu – manuálne alebo cez plánovač

import time
import subprocess

print("🕐 Mnemosyne Tick Daemon started (1h loop)")
while True:
    subprocess.call(["python3", "daemons/mnemosyne_checker.py"])
    time.sleep(3600)  # 1 hodina
