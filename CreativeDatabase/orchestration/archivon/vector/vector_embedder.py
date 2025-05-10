from sentence_transformers import SentenceTransformer
import json

model = SentenceTransformer("all-MiniLM-L6-v2")

def embed_text(text):
    return model.encode(text).tolist()

def embed_log_entry(entry):
    full_text = f"{entry.get('input', '')} {entry.get('output', '')}"
    return embed_text(full_text)
