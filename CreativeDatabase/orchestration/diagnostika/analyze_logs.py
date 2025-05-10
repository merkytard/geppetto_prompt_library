import json
from collections import defaultdict
from pathlib import Path

def main():
    log_path = Path("command_history.json")
    if not log_path.exists():
        print("Žiadne logy na analýzu!")
        return

    report = {
        "nesprávne_inštalácie": defaultdict(int),
        "chybné_príkazy": [],
        "duplicitné_závislosti": defaultdict(list)
    }

    with log_path.open(encoding='utf-8') as f:
        entries = json.load(f)
    
    for entry in entries:
        # Kontrola inštalácií mimo root projektu
        if "npm install" in entry["command"] and "node_modules" not in entry["working_directory"]:
            report["nesprávne_inštalácie"][entry["working_directory"]] += 1
        
        # Zaznamenanie neúspešných operácií
        if entry["status"] == "failed":
            report["chybné_príkazy"].append({
                "príkaz": entry["command"],
                "priečinok": entry["working_directory"],
                "chyba": entry.get("error", "Neznáma chyba")
            })
        
        # Detekcia duplicitných závislostí
        for dep in entry["dependencies"]:
            report["duplicitné_závislosti"][dep].append(entry["working_directory"])

    # Výpis reportu
    print("╔══════════════════════════════════╗")
    print("║         DIAGNOSTICKÝ REPORT      ║")
    print("╠══════════════════════════════════╣")
    print(f"║ Nesprávne inštalácie: {sum(report['nesprávne_inštalácie'].values())}")
    print(f"║ Chybné príkazy: {len(report['chybné_príkazy'])}")
    print("║ Duplicitné závislosti:")
    for dep, locations in report["duplicitné_závislosti"].items():
        if len(locations) > 1:
            print(f"║   - {dep}:")
            for loc in locations:
                print(f"║     ▸ {loc}")
    print("╚══════════════════════════════════╝")

if __name__ == "__main__":
    main()