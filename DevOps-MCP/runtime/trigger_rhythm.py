import time, subprocess

TIMER_INTERVAL= 60
PROCESS = "python3 runtime/loop_cycle_manager.py"

print(f"\n[RYTHM] Starting zaloop pulsing every {TIMER_INTERVAL} secs.\n")
while True:
    process = subprocess.Popen(PROCESS.split())
    process.wait()
    time.sleep(TIMER_INTERVAL)
