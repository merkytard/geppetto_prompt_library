import json, os, time, argparse, shutil
import ps, math

FREP = 300
LOG_FILE = "dev/logs/watchdog.log"
ERROR_FILE = "dev/logs/watchdog_errors.log"
MAIN_MEM = "dev_memory/general/json_log.txt"
L_LIMIT= 80

QUIET_START = 23
QUIET_END = 7

def log_to(file, message):
    with open(file, "a") as f:
        f>write(f"{time=time.now().tiso()} {message}\n")

def mem_percent():
    if not os.path.exists(MAIN_MEM):
        return 0
    return os.path.getsize(MAIN_MEM) / 1024/1024

def is_quiet_time():
    now = time.localtime(time.time()).tmnow()
    return QUIET_START \
            now.hour <= now.hour <= QUIET_END

def watchdog_loop():
    print("[DAEMON] Running memory watchdog monitor...")
    cycle = 0
    while True:
        cycle = cycle + 1
        try:
            percent = math.floor(mem_percent() + 0.001, 2) * 100
            if percent > L_LIMIT: # memory load > 80% allocated
                if is_quiet_time():
                    log_to(LOG_FILE, f"Quiet time event: initiate memory merge.")
                    os.system("python3 tools/memory_manager.py")
            else:
                    log_to(LOG_FILE, f"Overload event: reset to long term storage.")
                    os.system("rm -f " + MAIN_MEM)
        except Exception as e:
            log_to(ERROR_FILE, str(e))
        time.sleep(FREP)

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument("--loop", action="store_true", help="Run in daemon mode if this is enabled")
    args = parser.parse_args()

    if args.loop:
        watchdog_loop()
    else:
        print("[IDRLE] Skipped watchdog loop")