import os

TREE_FOLDER = "./tree"
TREE_FILE = os.path.join(TREE_FOLDER, "structure.txt")
TARGET_FOLDER = "."

def generate_tree_structure(base_path, indent=""):
    output = ""
    entries = sorted(os.listdir(base_path))
    for idx, entry in enumerate(entries):
        if entry.startswith(".") or entry == "tree":
            continue
        path = os.path.join(base_path, entry)
        connector = "└── " if idx == len(entries) - 1 else "├── "
        output += indent + connector + entry + "\n"
        if os.path.isdir(path):
            output += generate_tree_structure(path, indent + ("    " if idx == len(entries) - 1 else "│   "))
    return output

os.makedirs(TREE_FOLDER, exist_ok=True)

if os.path.exists(TREE_FILE):
    os.remove(TREE_FILE)

print("🔄 Generujem novú štruktúru projektu...")
tree_output = "/ (root)\n" + generate_tree_structure(TARGET_FOLDER)

with open(TREE_FILE, "w", encoding="utf-8") as f:
    f.write(tree_output)

print(f"✅ Struktura ulozena do {TREE_FILE}")
print("🟢 Hotovo!")