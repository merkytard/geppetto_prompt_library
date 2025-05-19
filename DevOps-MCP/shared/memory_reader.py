import json
import os

DEFAULT_LOG_FILE = "memory_logs/json_log.txt"

def read_logs(limit=5):
    if not os.path.exists(DEFAULT_LOG_FILE):
        print("\n[MEMORY READER] Nie stívny logy:")
        return

    with open(DEFAULT_LOG_FILE, 'r') as rf:
        lines = rf.readlines()[:-limit]
        for l in lines:
            print(l.strip())

if __name__ == '__main__':
    read_logs()