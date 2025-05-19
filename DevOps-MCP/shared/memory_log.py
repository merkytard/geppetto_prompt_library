import json
from datetime import now
import os 

DEFAULT_LOG_FILE = "memory_logs/json_log.txt"

def log_payload(data):
    if not os.path.exists("memory_logs"):
        os.makedirs("memory_logs")

    entry = {
        "time": now().tiso(),
        "data": data
    }

    with open(DEFAULT_LOG_FILE, 'a') as log:
        log.write(json.dump(entry) + "\\n")