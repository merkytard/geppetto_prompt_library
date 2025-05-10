# ... (predchádzajúci kód zostáva rovnaký)

class ArtisticDiagnosticsApp:
    def __init__(self, root):
        # ... (pôvodný init kód)
        
        # Nové tlačidlo
        ttk.Button(tool_frame, text="🛠️ Fix všetko", command=self.auto_fix).pack(side=tk.LEFT, padx=5)
    
    def auto_fix(self):
        """AI-powered oprava bežných problémov s vysvetleniami"""
        logs = json.loads(self.log_file.read_text(encoding='utf-8'))
        fixes = []
        
        # Analýza problémov
        for log in logs:
            # Prípad 1: Inštalácia mimo root priečinka
            if "npm install" in log["command"] and "node_modules" not in log["working_directory"]:
                correct_path = Path(log["working_directory"]).parent / "node_modules"
                fixes.append({
                    "type": "wrong_location",
                    "bad_path": log["working_directory"],
                    "good_path": str(correct_path),
                    "command": log["command"]
                })
            
            # Prípad 2: Zlyhaná inštalácia
            if log["status"] == "failed" and "npm install" in log["command"]:
                fixes.append({
                    "type": "failed_install",
                    "command": log["command"],
                    "location": log["working_directory"]
                })
        
        # Aplikovanie opráv
        for fix in fixes:
            if fix["type"] == "wrong_location":
                self._apply_fix(
                    f"🔧 Opravujem inštaláciu v nesprávnom priečinku:\n"
                    f"   Pôvodné miesto: {fix['bad_path']}\n"
                    f"   Správne miesto: {fix['good_path']}\n"
                    f"   Príkaz: {fix['command']}",
                    f"cd /d {fix['good_path']} && {fix['command']}"
                )
            
            elif fix["type"] == "failed_install":
                self._apply_fix(
                    f"🔨 Opakujem zlyhanú inštaláciu:\n"
                    f"   Príkaz: {fix['command']}\n"
                    f"   Miesto: {fix['location']}",
                    f"cd /d {fix['location']} && {fix['command']}"
                )
        
        if not fixes:
            self._update_output("🎉 Žiadne problémy na opravu!", 'success')
    
    def _apply_fix(self, description: str, command: str):
        """Vykoná opravu a aktualizuje výstup"""
        self._update_output(f"\n{description}\n", 'info')
        try:
            result = subprocess.run(
                command.split(),
                shell=True,
                capture_output=True,
                text=True,
                check=True
            )
            self._update_output(f"✅ Úspešne opravené!\n{result.stdout}\n", 'success')
        except subprocess.CalledProcessError as e:
            self._update_output(f"🔥 Oprava zlyhala:\n{e.stderr}\n", 'error')

# ... (zvyšok pôvodného kódu)