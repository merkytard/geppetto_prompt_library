import os
import time
import json
from bs4 import BeautifulSoup
from sentence_transformers import SentenceTransformer

SOURCE_DIR = "./bookmarks/docker_offline"
VECTOR_OUTPUT = "geppetto_vectors.json"
model = SentenceTransformer("all-MiniLM-L6-v2")

def extract_text_from_html(file_path):
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        soup = BeautifulSoup(f, 'html.parser')
    title = soup.title.string.strip() if soup.title else ""
    headings = [h.get_text().strip() for h in soup.find_all(['h1', 'h2'])]
    return " ".join([title] + headings)

def main_loop():
    vectors = {}
    for root, _, files in os.walk(SOURCE_DIR):
        for file in files:
            if file.endswith(".html"):
                path = os.path.join(root, file)
                try:
                    text = extract_text_from_html(path)
                    embedding = model.encode(text).tolist()
                    vectors[path] = {
                        "summary": text[:150],
                        "vector": embedding
                    }
                except Exception as e:
                    print(f"⚠️ Chyba pri {path}: {e}")

    with open(VECTOR_OUTPUT, "w", encoding="utf-8") as f:
        json.dump(vectors, f, indent=2)
    print(f"✅ Vektory uložené do {VECTOR_OUTPUT}")

if __name__ == "__main__":
    while True:
        print("🌀 Archivon Démon beží… Skenujem offline snapshoty.")
        main_loop()
        time.sleep(600)
