# push_secrets_to_github.py

import os
import requests
from dotenv import load_dotenv

# 1. Načítaj lokálny .env
load_dotenv()

# 2. Načítaj potrebné premenné
github_token = os.getenv("GITHUB_TOKEN")
repo_owner = "TVOJE_GITHUB_USERNAME"         # <- uprav
repo_name = "NAZOV_TVOJEHO_REPA"             # <- uprav
secrets_to_push = {
    "OPENAI_API_KEY": os.getenv("OPENAI_API_KEY"),
    "WEBHOOK_SECRET": os.getenv("WEBHOOK_SECRET")
}

# 3. GitHub API endpoint
api_url = f"https://api.github.com/repos/{repo_owner}/{repo_name}/actions/secrets"

headers = {
    "Authorization": f"token {github_token}",
    "Accept": "application/vnd.github.v3+json"
}

# 4. Nahraj každý secret
for key, value in secrets_to_push.items():
    if not value:
        print(f"⚠️  Variable {key} is empty. Skipping.")
        continue

    # GitHub chce verejný kľúč repo pre encrypt
    r = requests.get(f"{api_url}/public-key", headers=headers)
    if r.status_code != 200:
        print(f"❌ Failed to get public key for repo {repo_name}.")
        print(r.text)
        exit(1)

    response = r.json()
    public_key = response["key"]
    key_id = response["key_id"]

    # Encrypt cez libsodium
    from nacl import encoding, public

    def encrypt(public_key_str, secret_value):
        public_key_bytes = public_key_str.encode("utf-8")
        sealed_box = public.SealedBox(public.PublicKey(public_key_bytes, encoding.Base64Encoder()))
        encrypted = sealed_box.encrypt(secret_value.encode("utf-8"))
        return encoding.Base64Encoder.encode(encrypted).decode("utf-8")

    encrypted_value = encrypt(public_key, value)

    data = {
        "encrypted_value": encrypted_value,
        "key_id": key_id
    }

    # Upload secret
    upload_url = f"{api_url}/{key}"
    resp = requests.put
