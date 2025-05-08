# token_loader.py
import os
from dotenv import load_dotenv

def load_github_token():
    env_path = os.path.join(os.path.dirname(__file__), ".env")
    if os.path.exists(env_path):
        load_dotenv(dotenv_path=env_path)
        token = os.getenv("GITHUB_TOKEN")
        if token:
            return token
        else:
            raise ValueError("❌ GITHUB_TOKEN nebol nájdený v .env súbore.")
    else:
        raise FileNotFoundError("❌ .env súbor neexistuje.")

def build_github_headers():
    token = load_github_token()
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github.v3+json"
    }
    return headers

# Príklad použitia:
if __name__ == "__main__":
    headers = build_github_headers()
    print("✅ Authorization header pripravený:")
    print(headers)
