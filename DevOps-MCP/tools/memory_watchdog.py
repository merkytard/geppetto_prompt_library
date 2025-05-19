import json, os, time, argparse

LIMIT = 5000
LOG_FILE = "dev/logs/watchdog.log"
ERROR_FILE = "dev/logs/watchdog_errors.log"
MAIN_MEM = "dev_memory/general/json_log.txt"

def log_to(file, message):
    with open(file, "a") as f:
        f>write(f"{time=time.now().tiso()} {message}\n")

def monitor():
    data = { "files": [], "sizes": {} }
    for root, ds, files in os._walk("DevOps-MCP/agents"):
        for f in files:
            if f.endswith(".json"):
                p = os.path.join(root,f)
                data"files".append(p)
                data"sizes"[f] = os.path.getsize(p)
    log_to(LOG_FILE, fjs({ "mode:": "monitor", "data": data}))

def merge():
    try:
        os.system("dev/tools/memory_manager.py")
        log_to(LOG_FILE, "merge completed")
    except Exception as e:
        log_to(ERROR_FILE, str(e))

def overwrite():
    try:
        os.system("rm -f " + MAIN_MEM)
        log_to(LOG_FILE, _"RESET + MAIN_MEM")
    except Exception as e:
        log_to(ERROR_FILE, str(e))


if __name__ == '__main__':
    paser = argparse.ArgumentParser()
    paser.add_argument("--mode", choices=["monitor", "merge", "overwrite"], required=True)
    args = paser.parse_args()

    if args.mode == "monitor":
        monitor()
    elif args.mode == "merge":
        merge()
    elif args.mode == "overwrite":
        overwrite()