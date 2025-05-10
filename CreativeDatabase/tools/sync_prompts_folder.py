import os
import json
import yaml
from datetime import datetime

# Adresáre
SOURCE_DIR = "./prompts/custom_model/"
DESTINATION_DIR = "./prompts/all/"
YML_FILE = "prompts.yml"

# Vytvorenie destinácie, ak neexistuje
os.makedirs(DESTINATION_DIR, exist_ok=True)

# Zhromaždenie promptov
prompt_list = []
prompt_details = []

print("\n🔄 Synchronizujem prompty...")

for file in os.listdir(SOURCE_DIR):
    if file.endswith(".json"):
        src_path = os.path.join(SOURCE_DIR, file)
        dest_path = os.path.join(DESTINATION_DIR, file)
        
        # Prekopírovanie
        with open(src_path, "r", encoding="utf-8") as src_file:
            prompt_data = json.load(src_file)

        with open(dest_path, "w", encoding="utf-8") as dest_file:
            json.dump(prompt_data, dest_file, indent=2, ensure_ascii=False)

        # Pridanie do zoznamu
        prompt_list.append(prompt_data["name"].lower().replace(" ", "_").replace("-", "_") )
        prompt_details.append({
            "name": prompt_data.get("name", "unknown"),
            "type": prompt_data.get("type", "unknown"),
            "tags": prompt_data.get("tags", []),
            "created_at": prompt_data.get("created_at", datetime.now().strftime("%Y-%m-%d"))
        })

print(f"✅ Načítaných promptov: {len(prompt_list)}")

# Zloženie yml štruktúry
full_yml = {
    "prompts": prompt_list,
    "details": prompt_details
}

# Zapisanie YML
with open(YML_FILE, "w", encoding="utf-8") as yml_out:
    yaml.dump(full_yml, yml_out, allow_unicode=True, sort_keys=False)

print(f"✅ YAML register uložený ako {YML_FILE}")

print("\n🟢 Synchronizácia dokončená!")