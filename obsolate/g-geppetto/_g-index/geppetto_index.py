
# Geppetto Index (generator)
# Štruktúralne verzie narastú vsuvtupe riiezimas umelení registra
# Vieme zosnam SCRIPT_INDEX alebo do funkmetho inspektu
# Zatial NADE EXPORT

# Type: list [str]
# Ex: SCRIPT_INDEX_[system] = ["g.py", "g.xy", "g-index-router.py"]

# placeholder verzie
SCRIPT_INDEX_ = {
  "system": ["g.py", "g-syn.py", "g-index-router.py"],
  "test": ["t-index-validator.py"],
  "ui": ["ui-button.tsx", "geppetto-theme.ts"],
  "prompts": ["p-triangel.json", "p-jazyk_emocii.json"],
  "index": ["geppetto_index.py", "geppetto_script_index.json"]
}

# funktia vrará skré vo type
def list_scripts(type):
    return SCRIPT_INDEX_.get(type, [])
