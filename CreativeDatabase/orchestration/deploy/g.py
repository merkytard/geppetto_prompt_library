# g.py
# Hlavný Geppetto orchestrátor: spúšťa ticky, daemonov, synchronizáciu, pamäť

import subprocess
import sys

def run(command):
    print(f"▶️ Spúšťam: {command}")
    subprocess.call(command, shell=True)

def show_help():
    print("""
Geppetto CLI Interface (g.py)

Príkazy:
  g tick         → Spustí Mnemosyne tick (každú hodinu)
  g watch        → Sleduje bookmarks a volá démona
  g sync         → Spustí g-book pamäťovú synchronizáciu
  g summon       → Vyvolá démona Mnemosyne manuálne
  g status       → Vypíše posledné logy démona
""")

def main():
    if len(sys.argv) < 2:
        show_help()
        return

    cmd = sys.argv[1]
    if cmd == "tick":
        run("python3 tools/tick_mnemosyne.py")
    elif cmd == "watch":
        run("python3 tools/watch_bookmarks.py")
    elif cmd == "sync":
        run("python3 tools/g-book.py")
    elif cmd == "summon":
        run("python3 daemons/summon_daemon.py")
    elif cmd == "status":
        run("tail -n 10 daemons/daemon_trace.log")
    else:
        show_help()

if __name__ == "__main__":
    main()
