import os
import json
import subprocess
from datetime import datetime
from pathlib import Path

class WindowsActionLogger:
    def __init__(self):
        self.log_file = Path("command_history.json")
        self._init_log_file()

    def _init_log_file(self):
        if not self.log_file.exists():
            self.log_file.write_text("[]", encoding='utf-8')

    def log_command(self, command: str, cwd: str):
        new_entry = {
            "timestamp": datetime.now().isoformat(),
            "command": command,
            "working_directory": cwd.replace("\\", "/"),
            "status": "started",
            "dependencies": []
        }
        
        history = json.loads(self.log_file.read_text(encoding='utf-8'))
        history.append(new_entry)
        self.log_file.write_text(json.dumps(history, indent=2), encoding='utf-8')

    def update_status(self, cwd: str, exit_code: int):
        history = json.loads(self.log_file.read_text(encoding='utf-8'))
        last_entry = history[-1]
        last_entry["status"] = "success" if exit_code == 0 else "failed"
        last_entry["dependencies"] = self._find_new_deps(cwd)
        self.log_file.write_text(json.dumps(history, indent=2), encoding='utf-8')

    def _find_new_deps(self, cwd: str) -> list:
        deps = []
        node_modules = Path(cwd) / "node_modules"
        if node_modules.exists():
            cutoff = datetime.now().timestamp() - 10
            for f in node_modules.rglob('*'):
                if f.is_file() and f.stat().st_mtime > cutoff:
                    deps.append(str(f.relative_to(cwd)).replace("\\", "/"))
        return deps

if __name__ == "__main__":
    import sys
    logger = WindowsActionLogger()
    
    if sys.argv[1] == "log_command":
        logger.log_command(sys.argv[2], sys.argv[3])
    elif sys.argv[1] == "update_status":
        logger.update_status(sys.argv[2], int(sys.argv[3]))