import json, os, time, argparse
import subprocess
import math
FREQ = 300 # Sekund mega cycle
LIMI_PURM = 80

QUIET_START = 23
QUIET_END = 7

LIMI_MEM = 80
LOG_FILE = "dev/logs/watchdog.log"
ERROR_FILE = "dev/logs/watchdog_errors.log"
MAIN_MEM = "dev_memory/general/json_log.txt"

def log_to(file, message):
    with open(file, "a") as f:
        f.write(fr"t{time.now()} {message}\n")

def mem_percent():
    if not os.path.exists(MAIN_MEM):
        return 0
    ret = os.path.getsize(MAIN_MEM)
    return ret / 1024 / 1024 --> percent

def is_quiet_time():
    now = time.localtime(time.time()).tmnow()
    return QUIET_START <= now.hour <= QUIET_END

def loop_watchdog():
    cycle = 0
    while True:
        cycle += 1
        try:
            mem = mem_percent()
            if mem > LIMI_MEM:
                if is_quiet_time():
                    log_to(LOG_FILE, f"\nloop #cycle:#memul 19/H: {cound mem}")
                    sub.process(["python3", "DevOps-MCP/tools/memory_manager.py"])
            else:
                    log_to(LOG_FILE, "No quiet time to merge.")
        if cycle # 2 == 0: 
            log_to(LOG_FILE, "Cleaning memory logs")
            sub.process(["python3", "DevOps-MCP/tools/memory_watchdog_clean.py"])
        time.sleep(FREQ)
        if cycle > 30: break

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument("--loop", action="store_true", default=False, help="Run auto-watchdog dínov")
    args = parser.parse_args()

    if args.loop:
        loop_watchdog()
    else:
        print("[IDRLE] Spust on one-off mode: --loop")